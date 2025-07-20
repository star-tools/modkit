import Buffer from './buffer.js'
import pako from './pako.js'
import bzip from './bzip.js';
import {Int64, UInt64, toUInt64, uint64BitwiseNot}  from './int64.js';


/**
 * Encryption table for MPQ hash function
 */
const encryptionTable = (() => {
  let seed = new UInt64(0x00100001)
  let table = {}

  for (let i = 0, m = 256; i < m; ++i) {
    let index = i
    for (let j = 0, n = 5; j < n; ++j) {
      seed = seed.mul(toUInt64(125)).add(toUInt64(3)).mod(toUInt64(0x2AAAAB))
      let temp1 = seed.and(toUInt64(0xFFFF)).shiftLeft(0x10)

      seed = seed.mul(toUInt64(125)).add(toUInt64(3)).mod(toUInt64(0x2AAAAB))
      let temp2 = seed.and(toUInt64(0xFFFF))

      table[index] = temp1.or(temp2)

      index += 0x100
    }
  }

  return table
})()

const hashTypes = {
  TABLE_OFFSET: 0,
  HASH_A: 1,
  HASH_B: 2,
  TABLE: 3
}

const MPQ_FILE_IMPLODE       = 0x00000100
const MPQ_FILE_COMPRESS      = 0x00000200
const MPQ_FILE_ENCRYPTED     = 0x00010000
const MPQ_FILE_FIX_KEY       = 0x00020000
const MPQ_FILE_SINGLE_UNIT   = 0x01000000
const MPQ_FILE_DELETE_MARKER = 0x02000000
const MPQ_FILE_SECTOR_CRC    = 0x04000000
const MPQ_FILE_EXISTS        = 0x80000000

class MPQArchive {

  /**
   * Create a MPQArchive object
   *
   * Skip reading listfile by pass listfile=false argument,
   * and then the `files` attribute will be `undefined`.
   */
  constructor (buffer, filename, listfile = true) {
    this.filename = filename
    try {
      this.file = buffer
      this.header = this.readHeader()
      this.hashTable = this.readTable('hash')
      this.blockTable = this.readTable('block')
      if (listfile) {


        let data = this.readFile('(listfile)')
        if(data.constructor === Uint8Array){
            this.files =  new TextDecoder().decode(data).toString().trim().split(/\s+/)
        }
        else{
            this.files = data.toString().trim().split(/\s+/)
        }
      
    
      } else {
        this.files = []
      }
    } catch (err) {
      console.error(`[mpqjs] ${err.message}`)
      console.error(err)
    }
  }


  /**
   * Read the compression type & decompress file data,
   * used by `MPQArchive.prototype.readFile`
   */
  decompress  (data) {
    let type = data.readUInt8(0)
    switch (type) {
      case 0:
        // raw data
        return data
      case 2:
        return pako.inflate(data.slice(1))
      case 16:
          return Buffer.from(bzip.decompressFile(data.slice(1)))
      default:
        throw new TypeError(`Unsupported compression type "${type}"`)
    }
  }

  /**
   * Read the header of a MPQ archive
   */
  readHeader () {
    let header
    this.readOffset = 0

    let magic = this.file.slice(this.readOffset, 4)
    if (magic == 'MPQ\x1a') {
      header = this._readMPQHeader()
      header.offset = 0
    } else if (magic == 'MPQ\x1b') {
      let userDataHeader = this._readMPQUserDataHeader()
      this.readOffset = userDataHeader.mpqHeaderOffset
      header = this._readMPQHeader()
      header.offset = userDataHeader.mpqHeaderOffset
      header.userDataHeader = userDataHeader
    } else {
      throw new TypeError('Invalid file header.', this.filename)
    }

    return header
  }

  /**
   * Read hash/block table of a MPQ archive
   */
  readTable (type) {
    if (type !== 'hash' && type !== 'block') {
      throw new TypeError(`Invalid table type "${type}"`)
    }

    const tableOffset = this.header[`${type}TableOffset`]
    const tableEntries = this.header[`${type}TableEntries`]
    const key = this._hash(`(${type} table)`, 'TABLE')

    this.readOffset = tableOffset + this.header.offset
    let data = this.file.slice(this.readOffset, this.readOffset + tableEntries * 16)
    this.readOffset += tableEntries * 16
    data = this._decrypt(data, key)

    return Array(tableEntries).fill(0).map((z, i) => {
      return this._unpackEntry(data.slice(i * 16, i * 16 + 16), type)
    })
  }

  /**
   * Get the hash table entry corresponding to a given filename
   */
  getHashTableEntry (filename) {
    let hashA = this._hash(filename, 'HASH_A').toBuffer().readUInt32BE(4)
    let hashB = this._hash(filename, 'HASH_B').toBuffer().readUInt32BE(4)
    return this.hashTable.find(entry =>
      entry.hashA === hashA && entry.hashB === entry.hashB)
  }

  /**
   * Read a file from the MPQ archive
   */
  readFile (filename, forceDecompress = false) {
    let hashEntry = this.getHashTableEntry(filename)
    if (!hashEntry) return Buffer.alloc(0)

    let blockEntry = this.blockTable[hashEntry.blockTableIndex]

    // Read the block
    if (blockEntry.flags & MPQ_FILE_EXISTS) {
      if (blockEntry.archivedSize === 0) return Buffer.alloc(0)

      this.readOffset = blockEntry.offset + this.header.offset
      let fileData = this.file.slice(this.readOffset,
        this.readOffset + blockEntry.archivedSize)
      this.readOffset += blockEntry.archivedSize

      if (blockEntry.flags & MPQ_FILE_ENCRYPTED) {
        // TODO: decrypt file
        throw new Error('Encryption file is not supported yet.')
      }

      if (blockEntry.flags & MPQ_FILE_SINGLE_UNIT) {
        // Single unit files only need to be decompressed,
        // but compression only happens when at least one byte is gained.
        if ((blockEntry.flags & MPQ_FILE_COMPRESS) &&
            (forceDecompress || blockEntry.size > blockEntry.archivedSize)) {
          fileData = this.decompress(fileData)
        }
      } else {
        // TODO: Test case didn't cover

        // File consists of many sectors.
        // They all need to be decompressed separately and united.
        let sectorSize = 512 << this.header.sectorSizeShift
        let sectors = Math.ceil(blockEntry.size / sectorSize)

        let crc
        if (blockEntry.flags & MPQ_FILE_SECTOR_CRC) {
          crc = true
          ++sectors
        } else {
          crc = false
        }

        let positions = Array(sectors + 1).fill(0).map((toUInt64, i) => fileData.readUInt32LE(i * 4))
        let result = []
        let sectorBytesLeft = blockEntry.size
        let len = positions.length - (crc ? 2 : 1)

        for (let i = 0; i < len; ++i) {
          let sector = fileData.slice(positions[i], positions[i + 1])
          if ((blockEntry.flags & MPQ_FILE_COMPRESS) &&
              (forceDecompress || sectorBytesLeft > sector.length)) {
            sector = this.decompress(sector)
          }
          sectorBytesLeft -= sector.length
          result.push(sector)
        }

        fileData = Buffer.concat(result)
      }

      return fileData
    }

    return Buffer.alloc(0)
  }

  /**
   * Extract all the files inside the MPQ archive in memory
   */
  extract () {
    if (this.files && this.files.length > 0) {
      if (this._extractedFilesObject) return this._extractedFilesObject
      this._extractedFilesObject = this.files.reduce((result, filename) => {
        return Object.assign(result, {
          [filename]: this.readFile(filename)
        })
      }, {})
      return this._extractedFilesObject
    } else {
      throw new Error('Cannot extract file without listfile')
    }
  }





//   /**
//    * Extract all files and write to disk
//    */
//   extractToDisk (index = 1) {
//     const { name } = path.parse(this.filename)
//     let dirname = path.join(process.cwd(), name)
//     if (index > 1) {
//       dirname += toUInt64 + index
//     }
//     if (fs.existsSync(dirname)) {
//       return extractToDisk(index + 1)
//     } else {
//       fs.mkdirSync(dirname)
//       let files = this.extract()
//       Object.keys(files).forEach(key =>
//         fs.writeFileSync(path.join(dirname, key), files[key]))
//     }
//   }

  /**
   * Extract given files from the archive to disk
//    */
//   extractFiles (filenames) {
//     filenames.forEach(name =>
//       fs.writeFileSync(path.join(process.cwd(), name), this.readFile(name)))
//   }

  printHeaders () {
    console.log('MPQ archive header')
    console.log('------------------')
    Object.keys(this.header).forEach(key => {
      if (key === 'userDataHeader') return

      let content = this.header[key]

      if (key === 'magic') {
        content = JSON.stringify(content)
                      .replace('\\u00', '\\x')
                      .replace(/"/g, '')
      }

      console.log(`${key.padEnd(30, ' ')} ${content}`)
    })
    console.log('')
  }

  printHashTable () {
    console.log('MPQ archive hash table')
    console.log('----------------------')
    console.log(' Hash A   Hash B  Locl Plat BlockIdx')
    this.hashTable.forEach(({
      hashA, hashB, locale, platform, blockTableIndex
    }) => {
      console.log(
        hashA.toString(16).toUpperCase().padStart(8, 0) + ' ' +
        hashB.toString(16).toUpperCase().padStart(8, 0) + ' ' +
        locale.toString(16).toUpperCase().padStart(4, 0) + ' ' +
        platform.toString(16).toUpperCase().padStart(4, 0) + ' ' +
        blockTableIndex.toString(16).toUpperCase().padStart(8, 0)
      )
    })
    console.log('')
  }

  printBlockTable () {
    console.log('MPQ archive block table')
    console.log('-----------------------')
    console.log(' Offset  ArchSize RealSize  Flags')
    this.blockTable.forEach(({ offset, archivedSize, size, flags }) => {
      console.log(
        offset.toString(16).toUpperCase().padStart(8, 0) + ' ' +
        archivedSize.toString().padStart(8, ' ') + ' ' +
        size.toString().padStart(8, ' ') + ' ' +
        flags.toString(16).toUpperCase().padStart(8, 0)
      )
    })
    console.log('')
  }

  printFiles () {
    if (this.files) {
      console.log('Files')
      console.log('-----')
      let width = Math.max.apply(null, this.files.map(f => f.length))
      this.files.forEach(filename => {
        let hashEntry = this.getHashTableEntry(filename)
        let blockEntry = this.blockTable[hashEntry.blockTableIndex]
        console.log(
          filename.padEnd(width, ' ') + ' ' +
          blockEntry.size.toString().padStart(8, ' ') + ' bytes'
        )
      })
      console.log('')
    }
  }

  /**
   * Unpack entry data from buffer, used by `readTable`
   */
  _unpackEntry (data, type) {
    switch (type) {
      case 'hash':
        return {
          hashA: data.readUInt32LE(0),
          hashB: data.readUInt32LE(4),
          locale: data.readUInt16LE(8),
          platform: data.readUInt16LE(10),
          blockTableIndex: data.readUInt32LE(12)
        }
        break
      case 'block':
        return {
          offset: data.readUInt32LE(0),
          archivedSize: data.readUInt32LE(4),
          size: data.readUInt32LE(8),
          flags: data.readUInt32LE(12)
        }
        break
      default:
        throw new TypeError(`Invalid table type "${type}"`)
    }
  }

  /**
   * Read the MPQ header, used by `readHeader()`
   */
  _readMPQHeader () {
    let header = {
      magic: this.file.slice(this.readOffset, this.readOffset + 4).toString(),
      headerSize: this.file.readUInt32LE(this.readOffset + 4),
      archivedSize: this.file.readUInt32LE(this.readOffset + 8),
      formatVersion: this.file.readUInt16LE(this.readOffset + 12),
      sectorSizeShift: this.file.readUInt16LE(this.readOffset + 14),
      hashTableOffset: this.file.readUInt32LE(this.readOffset + 16),
      blockTableOffset: this.file.readUInt32LE(this.readOffset + 20),
      hashTableEntries: this.file.readUInt32LE(this.readOffset + 24),
      blockTableEntries: this.file.readUInt32LE(this.readOffset + 28)
    }
    this.readOffset += 32
    if (header.formatVersion === 1) {
      // TODO: test case didn't cover
      Object.assign(header, {
        extendedBlockTableOffset: toUInt64(this.file.slice(this.readOffset, this.readOffset + 8)),
        hashTableOffsetHigh: this.file.readInt16LE(this.readOffset + 8),
        blockTableOffsetHigh: this.file.readInt16LE(this.readOffset + 10)
      })
      this.readOffset += 12
    }
    return header
  }

  /**
   * Read the MPQ user data header, used by `readHeader()`
   */
  _readMPQUserDataHeader () {
    let header = {
      magic: this.file.slice(this.readOffset, 4).toString(),
      userDataSize: this.file.readUInt32LE(this.readOffset + 4),
      mpqHeaderOffset: this.file.readUInt32LE(this.readOffset + 8),
      userDataHeaderSize: this.file.readUInt32LE(this.readOffset + 12)
    }
    this.readOffset += 16
    header.content = this.file.slice(this.readOffset, this.readOffset + header.userDataHeaderSize)
    return header
  }

  /**
   * Hash a string using MPQ's hash function
   */
  _hash (string, type) {
    let seed1 = toUInt64(0x7FED7FED)
    let seed2 = toUInt64(0xEEEEEEEE)

    string = string.toUpperCase()
    for (let i = 0, len = string.length; i < len; ++i) {
      let ch = string.charCodeAt(i)
      let value = encryptionTable[(hashTypes[type] << 8) + ch]
      seed1 = value.xor(seed1.add(seed2)).and(toUInt64(0xFFFFFFFF))
      seed2 = toUInt64(ch).add(seed1).add(seed2).add(seed2.shiftLeft(5)).add(toUInt64(3)).and(toUInt64(0xFFFFFFFF))
    }

    return seed1
  }

  /**
   * Decrypt hash, block table or a sector
   */
  _decrypt (data, key) {
    let seed1 = toUInt64(key)
    let seed2 = toUInt64(0xEEEEEEEE)

    let length = data.length
    let result = Buffer.alloc(length)

    for (let i = 0, len = Math.floor(length / 4); i < len; ++i) {
      seed2 = seed2.add(
        encryptionTable[seed1.and(toUInt64(0xFF)).add(toUInt64(0x400)).toString(10)]
      )
      seed2 = seed2.and(toUInt64(0xFFFFFFFF))
      let value = toUInt64(data.slice(i * 4, i * 4 + 4).readUInt32LE())
      value = value.xor(seed1.add(seed2)).and(toUInt64(0xFFFFFFFF))

      seed1 = uint64BitwiseNot(seed1).shiftLeft(0x15).add(toUInt64(0x11111111))
                        .or(seed1.shiftRight(0x0B))
      seed1 = seed1.and(toUInt64(0xFFFFFFFF))
      seed2 = value.add(seed2).add(seed2.shiftLeft(5))
                   .add(toUInt64(3)).and(toUInt64(0xFFFFFFFF))

      result.writeUInt32LE(value.toBuffer().readUInt32BE(4), i * 4)
    }

    return result
  }
}

export default MPQArchive

// Usage Example
// import fs from 'fs'
// import path from 'path'

// let rawMPQ = fs.readFileSync(path.resolve("./assets/data/ARC.SC2Mod"))

// const mpq = new MPQArchive(rawMPQ,"ARC")
// let filesList = mpq.files 
// let filedataRaw = mpq.readFile(mpq.files[1])
// const fileText = filedataRaw.toString(); // Default is 'utf8'
// fileText