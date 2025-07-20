
let bzip = (() => {
    
  var Stream = function() {
      /* ABSTRACT */
  };

  {
    var EOF = -1;

    // you must define one of read / readByte for a readable stream
    Stream.prototype.readByte = function() {
        var buf = [ 0 ];
        var len = this.read(buf, 0, 1);
        if (len===0) { this._eof = true; return EOF; }
        return buf[0];
    };
    Stream.prototype.read = function(buf, bufOffset, length) {
        var ch, bytesRead = 0;
        while (bytesRead < length) {
            ch = this.readByte();
            if (ch === EOF) { this._eof = true; break; }
            buf[bufOffset+(bytesRead++)] = ch;
        }
        return bytesRead;
    };
    // reasonable default implementation of 'eof'
    Stream.prototype.eof = function() { return !!this._eof; };
    // not all readable streams are seekable
    Stream.prototype.seek = function(pos) {
        throw new Error('Stream is not seekable.');
    };
    Stream.prototype.tell = function() {
        throw new Error('Stream is not seekable.');
    };
    // you must define one of write / writeByte for a writable stream
    Stream.prototype.writeByte = function(_byte) {
        var buf = [ _byte ];
        this.write(buf, 0, 1);
    };
    Stream.prototype.write = function(buf, bufOffset, length) {
        var i;
        for (i=0; i<length; i++) {
            this.writeByte(buf[bufOffset + i]);
        }
        return length;
    };
    // flush will happily do nothing if you don't override it.
    Stream.prototype.flush = function() { };

    // export EOF as a constant.
    Stream.EOF = EOF;
  }



  var Util = Object.create(null);

  {

    var EOF = Stream.EOF;

    /* Take a buffer, array, or stream, and return an input stream. */
    Util.coerceInputStream = function(input, forceRead) {
        if (!('readByte' in input)) {
            var buffer = input;
            input = new Stream();
            input.size = buffer.length;
            input.pos = 0;
            input.readByte = function() {
                if (this.pos >= this.size) { return EOF; }
                return buffer[this.pos++];
            };
            input.read = function(buf, bufOffset, length) {
                var bytesRead = 0;
                while (bytesRead < length && this.pos < buffer.length) {
                    buf[bufOffset++] = buffer[this.pos++];
                    bytesRead++;
                }
                return bytesRead;
            };
            input.seek = function(pos) { this.pos = pos; };
            input.tell = function() { return this.pos; };
            input.eof = function() { return this.pos >= buffer.length; };
        } else if (forceRead && !('read' in input)) {
            // wrap input if it doesn't implement read
            var s = input;
            input = new Stream();
            input.readByte = function() {
                var ch = s.readByte();
                if (ch === EOF) { this._eof = true; }
                return ch;
            };
            if ('size' in s) { input.size = s.size; }
            if ('seek' in s) {
                input.seek = function(pos) {
                    s.seek(pos); // may throw if s doesn't implement seek
                    this._eof = false;
                };
            }
            if ('tell' in s) {
                input.tell = s.tell.bind(s);
            }
        }
        return input;
    };

    var BufferStream = function(buffer, resizeOk) {
        this.buffer = buffer;
        this.resizeOk = resizeOk;
        this.pos = 0;
    };
    BufferStream.prototype = Object.create(Stream.prototype);
    BufferStream.prototype.writeByte = function(_byte) {
        if (this.resizeOk && this.pos >= this.buffer.length) {
            var newBuffer = Util.makeU8Buffer(this.buffer.length * 2);
            newBuffer.set(this.buffer);
            this.buffer = newBuffer;
        }
        this.buffer[this.pos++] = _byte;
    };
    BufferStream.prototype.getBuffer = function() {
        // trim buffer if needed
        if (this.pos !== this.buffer.length) {
            if (!this.resizeOk)
                throw new TypeError('outputsize does not match decoded input');
            var newBuffer = Util.makeU8Buffer(this.pos);
            newBuffer.set(this.buffer.subarray(0, this.pos));
            this.buffer = newBuffer;
        }
        return this.buffer;
    };

    /* Take a stream (or not) and an (optional) size, and return an
     * output stream.  Return an object with a 'retval' field equal to
     * the output stream (if that was given) or else a pointer at the
     * internal Uint8Array/buffer/array; and a 'stream' field equal to
     * an output stream to use.
     */
    Util.coerceOutputStream = function(output, size) {
        var r = { stream: output, retval: output };
        if (output) {
            if (typeof(output)==='object' && 'writeByte' in output) {
                return r; /* leave output alone */
            } else if (typeof(size) === 'number') {
                console.assert(size >= 0);
                r.stream = new BufferStream(Util.makeU8Buffer(size), false);
            } else { // output is a buffer
                r.stream = new BufferStream(output, false);
            }
        } else {
            r.stream = new BufferStream(Util.makeU8Buffer(16384), true);
        }
        Object.defineProperty(r, 'retval', {
            get: r.stream.getBuffer.bind(r.stream)
        });
        return r;
    };

    Util.compressFileHelper = function(magic, guts, suppressFinalByte) {
        return function(inStream, outStream, props) {
            inStream = Util.coerceInputStream(inStream);
            var o = Util.coerceOutputStream(outStream, outStream);
            outStream = o.stream;

            // write the magic number to identify this file type
            // (it better be ASCII, we're not doing utf-8 conversion)
            var i;
            for (i=0; i<magic.length; i++) {
                outStream.writeByte(magic.charCodeAt(i));
            }

            // if we know the size, write it
            var fileSize;
            if ('size' in inStream && inStream.size >= 0) {
                fileSize = inStream.size;
            } else {
                fileSize = -1; // size unknown
            }
            if (suppressFinalByte) {
                var tmpOutput = Util.coerceOutputStream([]);
                Util.writeUnsignedNumber(tmpOutput.stream, fileSize + 1);
                tmpOutput = tmpOutput.retval;
                for (i=0; i<tmpOutput.length-1; i++) {
                    outStream.writeByte(tmpOutput[i]);
                }
                suppressFinalByte = tmpOutput[tmpOutput.length-1];
            } else {
                Util.writeUnsignedNumber(outStream, fileSize + 1);
            }

            // call the guts to do the real compression
            guts(inStream, outStream, fileSize, props, suppressFinalByte);

            return o.retval;
        };
    };
    Util.decompressFileHelper = function(magic, guts) {
        return function(inStream, outStream) {
            inStream = Util.coerceInputStream(inStream);

            // read the magic number to confirm this file type
            // (it better be ASCII, we're not doing utf-8 conversion)
            var i;
            for (i=0; i<magic.length; i++) {
                if (magic.charCodeAt(i) !== inStream.readByte()) {
                    throw new Error("Bad magic");
                }
            }

            // read the file size & create an appropriate output stream/buffer
            var fileSize = Util.readUnsignedNumber(inStream) - 1;
            var o = Util.coerceOutputStream(outStream, fileSize);
            outStream = o.stream;

            // call the guts to do the real decompression
            guts(inStream, outStream, fileSize);

            return o.retval;
        };
    };
    // a helper for simple self-test of model encode
    Util.compressWithModel = function(inStream, fileSize, model) {
        var inSize = 0;
        while (inSize !== fileSize) {
            var ch = inStream.readByte();
            if (ch === EOF) {
                model.encode(256); // end of stream;
                break;
            }
            model.encode(ch);
            inSize++;
        }
    };
    // a helper for simple self-test of model decode
    Util.decompressWithModel = function(outStream, fileSize, model) {
        var outSize = 0;
        while (outSize !== fileSize) {
            var ch = model.decode();
            if (ch === 256) {
                break; // end of stream;
            }
            outStream.writeByte(ch);
            outSize++;
        }
    };

    /** Write a number using a self-delimiting big-endian encoding. */
    Util.writeUnsignedNumber = function(output, n) {
        console.assert(n >= 0);
        var bytes = [], i;
        do {
            bytes.push(n & 0x7F);
            // use division instead of shift to allow encoding numbers up to
            // 2^53
            n = Math.floor( n / 128 );
        } while (n !== 0);
        bytes[0] |= 0x80; // mark end of encoding.
        for (i=bytes.length-1; i>=0; i--) {
            output.writeByte(bytes[i]); // write in big-endian order
        }
        return output;
    };

    /** Read a number using a self-delimiting big-endian encoding. */
    Util.readUnsignedNumber = function(input) {
        var n = 0, c;
        while (true) {
            c = input.readByte();
            if (c&0x80) { n += (c&0x7F); break; }
            // using + and * instead of << allows decoding numbers up to 2^53
            n = (n + c) * 128;
        }
        return n;
    };

    // Compatibility thunks for Buffer/TypedArray constructors.

    var zerofill = function(a) {
        for (var i = 0, len = a.length; i < len; i++) {
            a[i] = 0;
        }
        return a;
    };

    var fallbackarray = function(size) {
        return zerofill(new Array(size));
    };

    // Node 0.11.6 - 0.11.10ish don't properly zero fill typed arrays.
    // See https://github.com/joyent/node/issues/6664
    // Try to detect and workaround the bug.
    var ensureZeroed = function id(a) { return a; };
    if ((typeof(process) !== 'undefined') &&
        Array.prototype.some.call(new Uint32Array(128), function(x) {
            return x !== 0;
        })) {
        //console.warn('Working around broken TypedArray');
        ensureZeroed = zerofill;
    }

    /** Portable 8-bit unsigned buffer. */
    Util.makeU8Buffer = (typeof(Uint8Array) !== 'undefined') ? function(size) {
        // Uint8Array ought to be  automatically zero-filled
        return ensureZeroed(new Uint8Array(size));
    } : (typeof(Buffer) !== 'undefined') ? function(size) {
        var b = new Buffer(size);
        b.fill(0);
        return b;
    } : fallbackarray;

    /** Portable 16-bit unsigned buffer. */
    Util.makeU16Buffer = (typeof(Uint16Array) !== 'undefined') ? function(size) {
        // Uint16Array ought to be  automatically zero-filled
        return ensureZeroed(new Uint16Array(size));
    } : fallbackarray;

    /** Portable 32-bit unsigned buffer. */
    Util.makeU32Buffer = (typeof(Uint32Array) !== 'undefined') ? function(size) {
        // Uint32Array ought to be  automatically zero-filled
        return ensureZeroed(new Uint32Array(size));
    } : fallbackarray;

    /** Portable 32-bit signed buffer. */
    Util.makeS32Buffer = (typeof(Int32Array) !== 'undefined') ? function(size) {
        // Int32Array ought to be  automatically zero-filled
        return ensureZeroed(new Int32Array(size));
    } : fallbackarray;

    Util.arraycopy = function(dst, src) {
        console.assert(dst.length >= src.length);
        for (var i = 0, len = src.length; i < len ; i++) {
            dst[i] = src[i];
        }
        return dst;
    };

    /** Highest bit set in a byte. */
    var bytemsb = [
        0, 1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
        6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7,
        7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
        7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
        7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8 /* 256 */
    ];
    console.assert(bytemsb.length===0x100);
    /** Find last set (most significant bit).
     *  @return the last bit set in the argument.
     *          <code>fls(0)==0</code> and <code>fls(1)==1</code>. */
    var fls = Util.fls = function(v) {
        console.assert(v>=0);
        if (v > 0xFFFFFFFF) { // use floating-point mojo
            return 32 + fls(Math.floor(v / 0x100000000));
        }
        if ( (v & 0xFFFF0000) !== 0) {
            if ( (v & 0xFF000000) !== 0) {
                return 24 + bytemsb[(v>>>24) & 0xFF];
            } else {
                return 16 + bytemsb[v>>>16];
            }
        } else if ( (v & 0x0000FF00) !== 0) {
            return 8 + bytemsb[v>>>8];
        } else {
            return bytemsb[v];
        }
    };
    /** Returns ceil(log2(n)) */
    Util.log2c = function(v) {
        return (v===0)?-1:fls(v-1);
    };

    }




  /**
   * FIRST() function
   * @param array The code length array
   * @param i The input position
   * @param nodesToMove The number of internal nodes to be relocated
   * @return The smallest {@code k} such that {@code nodesToMove <= k <= i} and
   *         {@code i <= (array[k] % array.length)}
   */
  var first = function(array, i, nodesToMove) {
    var length = array.length;
    var limit = i;
    var k = array.length - 2;

    while ((i >= nodesToMove) && ((array[i] % length) > limit)) {
      k = i;
      i -= (limit - i + 1);
    }
    i = Math.max (nodesToMove - 1, i);

    while (k > (i + 1)) {
      var temp = (i + k) >> 1;
      if ((array[temp] % length) > limit) {
        k = temp;
      } else {
        i = temp;
      }
    }

    return k;
  };

  /**
   * Fills the code array with extended parent pointers
   * @param array The code length array
   */
  var setExtendedParentPointers = function(array) {
    var length = array.length;

    array[0] += array[1];

    var headNode, tailNode, topNode, temp;
    for (headNode = 0, tailNode = 1, topNode = 2;
         tailNode < (length - 1);
         tailNode++) {
      if ((topNode >= length) || (array[headNode] < array[topNode])) {
        temp = array[headNode];
        array[headNode++] = tailNode;
      } else {
        temp = array[topNode++];
      }

      if ((topNode >= length) ||
          ((headNode < tailNode) && (array[headNode] < array[topNode]))) {
        temp += array[headNode];
        array[headNode++] = tailNode + length;
      } else {
        temp += array[topNode++];
      }

      array[tailNode] = temp;
    }
  };

  /**
   * Finds the number of nodes to relocate in order to achieve a given code
   * length limit
   * @param array The code length array
   * @param maximumLength The maximum bit length for the generated codes
   * @return The number of nodes to relocate
   */
  var findNodesToRelocate = function(array, maximumLength) {
    var currentNode = array.length - 2;
    var currentDepth;
    for (currentDepth = 1;
         (currentDepth < (maximumLength - 1)) && (currentNode > 1);
         currentDepth++) {
      currentNode =  first (array, currentNode - 1, 0);
    }

    return currentNode;
  };


  /**
   * A final allocation pass with no code length limit
   * @param array The code length array
   */
  var allocateNodeLengths = function(array) {
    var firstNode = array.length - 2;
    var nextNode = array.length - 1;
    var currentDepth, availableNodes, lastNode, i;

    for (currentDepth = 1, availableNodes = 2;
         availableNodes > 0;
         currentDepth++) {
      lastNode = firstNode;
      firstNode = first (array, lastNode - 1, 0);

      for (i = availableNodes - (lastNode - firstNode); i > 0; i--) {
        array[nextNode--] = currentDepth;
      }

      availableNodes = (lastNode - firstNode) << 1;
    }
  };

  /**
   * A final allocation pass that relocates nodes in order to achieve a
   * maximum code length limit
   * @param array The code length array
   * @param nodesToMove The number of internal nodes to be relocated
   * @param insertDepth The depth at which to insert relocated nodes
   */
  var allocateNodeLengthsWithRelocation = function(array, nodesToMove,
                                                   insertDepth) {
    var firstNode = array.length - 2;
    var nextNode = array.length - 1;
    var currentDepth = (insertDepth == 1) ? 2 : 1;
    var nodesLeftToMove = (insertDepth == 1) ? nodesToMove - 2 : nodesToMove;
    var availableNodes, lastNode, offset, i;

    for (availableNodes = currentDepth << 1;
         availableNodes > 0;
         currentDepth++) {
      lastNode = firstNode;
      firstNode = (firstNode <= nodesToMove) ? firstNode : first (array, lastNode - 1, nodesToMove);

      offset = 0;
      if (currentDepth >= insertDepth) {
        offset = Math.min (nodesLeftToMove, 1 << (currentDepth - insertDepth));
      } else if (currentDepth == (insertDepth - 1)) {
        offset = 1;
        if ((array[firstNode]) == lastNode) {
          firstNode++;
        }
      }

      for (i = availableNodes - (lastNode - firstNode + offset); i > 0; i--) {
        array[nextNode--] = currentDepth;
      }

      nodesLeftToMove -= offset;
      availableNodes = (lastNode - firstNode + offset) << 1;
    }
  };

  /**
   * Allocates Canonical Huffman code lengths in place based on a sorted
   * frequency array
   * @param array On input, a sorted array of symbol frequencies; On output,
   *              an array of Canonical Huffman code lengths
   * @param maximumLength The maximum code length. Must be at least
   *                      {@code ceil(log2(array.length))}
   */
  // public
  var allocateHuffmanCodeLengths = function(array, maximumLength) {
    switch (array.length) {
    case 2:
      array[1] = 1;
    case 1:
      array[0] = 1;
      return;
    }

    /* Pass 1 : Set extended parent pointers */
    setExtendedParentPointers (array);

    /* Pass 2 : Find number of nodes to relocate in order to achieve
     *          maximum code length */
    var nodesToRelocate = findNodesToRelocate (array, maximumLength);

    /* Pass 3 : Generate code lengths */
    if ((array[0] % array.length) >= nodesToRelocate) {
      allocateNodeLengths (array);
    } else {
      var insertDepth = maximumLength - (Util.fls(nodesToRelocate - 1));
      allocateNodeLengthsWithRelocation (array, nodesToRelocate, insertDepth);
    }
  };






  /**
   * A static CRC lookup table
   */
    var crc32Lookup = Util.arraycopy(Util.makeU32Buffer(256), [
    0x00000000, 0x04c11db7, 0x09823b6e, 0x0d4326d9, 0x130476dc, 0x17c56b6b, 0x1a864db2, 0x1e475005,
    0x2608edb8, 0x22c9f00f, 0x2f8ad6d6, 0x2b4bcb61, 0x350c9b64, 0x31cd86d3, 0x3c8ea00a, 0x384fbdbd,
    0x4c11db70, 0x48d0c6c7, 0x4593e01e, 0x4152fda9, 0x5f15adac, 0x5bd4b01b, 0x569796c2, 0x52568b75,
    0x6a1936c8, 0x6ed82b7f, 0x639b0da6, 0x675a1011, 0x791d4014, 0x7ddc5da3, 0x709f7b7a, 0x745e66cd,
    0x9823b6e0, 0x9ce2ab57, 0x91a18d8e, 0x95609039, 0x8b27c03c, 0x8fe6dd8b, 0x82a5fb52, 0x8664e6e5,
    0xbe2b5b58, 0xbaea46ef, 0xb7a96036, 0xb3687d81, 0xad2f2d84, 0xa9ee3033, 0xa4ad16ea, 0xa06c0b5d,
    0xd4326d90, 0xd0f37027, 0xddb056fe, 0xd9714b49, 0xc7361b4c, 0xc3f706fb, 0xceb42022, 0xca753d95,
    0xf23a8028, 0xf6fb9d9f, 0xfbb8bb46, 0xff79a6f1, 0xe13ef6f4, 0xe5ffeb43, 0xe8bccd9a, 0xec7dd02d,
    0x34867077, 0x30476dc0, 0x3d044b19, 0x39c556ae, 0x278206ab, 0x23431b1c, 0x2e003dc5, 0x2ac12072,
    0x128e9dcf, 0x164f8078, 0x1b0ca6a1, 0x1fcdbb16, 0x018aeb13, 0x054bf6a4, 0x0808d07d, 0x0cc9cdca,
    0x7897ab07, 0x7c56b6b0, 0x71159069, 0x75d48dde, 0x6b93dddb, 0x6f52c06c, 0x6211e6b5, 0x66d0fb02,
    0x5e9f46bf, 0x5a5e5b08, 0x571d7dd1, 0x53dc6066, 0x4d9b3063, 0x495a2dd4, 0x44190b0d, 0x40d816ba,
    0xaca5c697, 0xa864db20, 0xa527fdf9, 0xa1e6e04e, 0xbfa1b04b, 0xbb60adfc, 0xb6238b25, 0xb2e29692,
    0x8aad2b2f, 0x8e6c3698, 0x832f1041, 0x87ee0df6, 0x99a95df3, 0x9d684044, 0x902b669d, 0x94ea7b2a,
    0xe0b41de7, 0xe4750050, 0xe9362689, 0xedf73b3e, 0xf3b06b3b, 0xf771768c, 0xfa325055, 0xfef34de2,
    0xc6bcf05f, 0xc27dede8, 0xcf3ecb31, 0xcbffd686, 0xd5b88683, 0xd1799b34, 0xdc3abded, 0xd8fba05a,
    0x690ce0ee, 0x6dcdfd59, 0x608edb80, 0x644fc637, 0x7a089632, 0x7ec98b85, 0x738aad5c, 0x774bb0eb,
    0x4f040d56, 0x4bc510e1, 0x46863638, 0x42472b8f, 0x5c007b8a, 0x58c1663d, 0x558240e4, 0x51435d53,
    0x251d3b9e, 0x21dc2629, 0x2c9f00f0, 0x285e1d47, 0x36194d42, 0x32d850f5, 0x3f9b762c, 0x3b5a6b9b,
    0x0315d626, 0x07d4cb91, 0x0a97ed48, 0x0e56f0ff, 0x1011a0fa, 0x14d0bd4d, 0x19939b94, 0x1d528623,
    0xf12f560e, 0xf5ee4bb9, 0xf8ad6d60, 0xfc6c70d7, 0xe22b20d2, 0xe6ea3d65, 0xeba91bbc, 0xef68060b,
    0xd727bbb6, 0xd3e6a601, 0xdea580d8, 0xda649d6f, 0xc423cd6a, 0xc0e2d0dd, 0xcda1f604, 0xc960ebb3,
    0xbd3e8d7e, 0xb9ff90c9, 0xb4bcb610, 0xb07daba7, 0xae3afba2, 0xaafbe615, 0xa7b8c0cc, 0xa379dd7b,
    0x9b3660c6, 0x9ff77d71, 0x92b45ba8, 0x9675461f, 0x8832161a, 0x8cf30bad, 0x81b02d74, 0x857130c3,
    0x5d8a9099, 0x594b8d2e, 0x5408abf7, 0x50c9b640, 0x4e8ee645, 0x4a4ffbf2, 0x470cdd2b, 0x43cdc09c,
    0x7b827d21, 0x7f436096, 0x7200464f, 0x76c15bf8, 0x68860bfd, 0x6c47164a, 0x61043093, 0x65c52d24,
    0x119b4be9, 0x155a565e, 0x18197087, 0x1cd86d30, 0x029f3d35, 0x065e2082, 0x0b1d065b, 0x0fdc1bec,
    0x3793a651, 0x3352bbe6, 0x3e119d3f, 0x3ad08088, 0x2497d08d, 0x2056cd3a, 0x2d15ebe3, 0x29d4f654,
    0xc5a92679, 0xc1683bce, 0xcc2b1d17, 0xc8ea00a0, 0xd6ad50a5, 0xd26c4d12, 0xdf2f6bcb, 0xdbee767c,
    0xe3a1cbc1, 0xe760d676, 0xea23f0af, 0xeee2ed18, 0xf0a5bd1d, 0xf464a0aa, 0xf9278673, 0xfde69bc4,
    0x89b8fd09, 0x8d79e0be, 0x803ac667, 0x84fbdbd0, 0x9abc8bd5, 0x9e7d9662, 0x933eb0bb, 0x97ffad0c,
    0xafb010b1, 0xab710d06, 0xa6322bdf, 0xa2f33668, 0xbcb4666d, 0xb8757bda, 0xb5365d03, 0xb1f740b4
  ]);

  var CRC32 = function() {
    /**
     * The current CRC
     */
    var crc = 0xffffffff;

    /**
     * @return The current CRC
     */
    this.getCRC = function() {
      return (~crc) >>> 0; // return an unsigned value
    };

    /**
     * Update the CRC with a single byte
     * @param value The value to update the CRC with
     */
    this.updateCRC = function(value) {
      crc = (crc << 8) ^ crc32Lookup[((crc >>> 24) ^ value) & 0xff];
    };

    /**
     * Update the CRC with a sequence of identical bytes
     * @param value The value to update the CRC with
     * @param count The number of bytes
     */
    this.updateCRCRun = function(value, count) {
      while (count-- > 0) {
        crc = (crc << 8) ^ crc32Lookup[((crc >>> 24) ^ value) & 0xff];
      }
    };
  };


var ASSERT = console.assert.bind(console);

// we're dispensing with the "arbitrary alphabet" stuff of the source
// and just using Uint8Arrays.

/** Find the start or end of each bucket. */
var getCounts = function(T, C, n, k) {
    var i;
    for (i = 0; i < k; i++) { C[i] = 0; }
    for (i = 0; i < n; i++) { C[T[i]]++; }
};
var getBuckets = function(C, B, k, end) {
    var i, sum = 0;
    if (end) {
        for (i = 0; i < k; i++) { sum += C[i]; B[i] = sum; }
    } else {
        for (i = 0; i < k; i++) { sum += C[i]; B[i] = sum - C[i]; }
    }
};

/** Sort all type LMS suffixes */
var LMSsort = function(T, SA, C, B, n, k) {
    var b, i, j;
    var c0, c1;
    /* compute SAl */
    if (C === B) { getCounts(T, C, n, k); }
    getBuckets(C, B, k, false); /* find starts of buckets */
    j = n - 1;
    b = B[c1 = T[j]];
    j--;
    SA[b++] = (T[j] < c1) ? ~j : j;
    for (i = 0; i < n; i++) {
        if ((j = SA[i]) > 0) {
            ASSERT(T[j] >= T[j+1]);
            if ((c0 = T[j]) !== c1) { B[c1] = b; b = B[c1 = c0]; }
            ASSERT(i < b);
            j--;
            SA[b++] = (T[j] < c1) ? ~j : j;
            SA[i] = 0;
        } else if (j < 0) {
            SA[i] = ~j;
        }
    }
    /* compute SAs */
    if (C === B) { getCounts(T, C, n, k); }
    getBuckets(C, B, k, 1); /* find ends of buckets */
    for (i = n-1, b = B[c1 = 0]; i >= 0; i--) {
        if ((j = SA[i]) > 0) {
            ASSERT(T[j] <= T[j+1]);
            if ((c0 = T[j]) !== c1) { B[c1] = b; b = B[c1 = c0]; }
            ASSERT(b <= i);
            j--;
            SA[--b] = (T[j] > c1) ? ~(j+1) : j;
            SA[i] = 0;
        }
    }
};

var LMSpostproc = function(T, SA, n, m) {
    var i, j, p, q, plen, qlen, name;
    var c0, c1;
    var diff;

    /* compact all the sorted substrings into the first m items of SA
        * 2*m must not be larger than n (provable) */
    ASSERT(n > 0);
    for (i = 0; (p = SA[i]) < 0; i++) { SA[i] = ~p; ASSERT((i+1) < n); }
    if (i < m) {
        for (j = i, i++; ; i++) {
            ASSERT(i < n);
            if ((p = SA[i]) < 0) {
                SA[j++] = ~p; SA[i] = 0;
                if (j === m) { break; }
            }
        }
    }

    /* store the length of all substrings */
    c0 = T[i = j = n - 1];
    do { c1 = c0; } while ( ((--i) >= 0 ) && ((c0=T[i]) >= c1) );
    for (; i >= 0; ) {
        do { c1 = c0; } while ( ((--i) >= 0 ) && ((c0=T[i]) <= c1) );
        if (i >= 0) {
            SA[m + ((i + 1) >>> 1)] = j - i; j = i + 1;
            do { c1 = c0; } while ( ((--i) >= 0 ) && ((c0=T[i]) >= c1) );
        }
    }

    /* find the lexicographic names of all substrings */
    for (i = 0, name = 0, q = n, qlen = 0; i < m; i++) {
        p = SA[i]; plen = SA[m + (p >>> 1)]; diff = true;
        if ((plen === qlen) && ((q + plen) < n)) {
            for (j = 0; (j < plen) && (T[p + j] === T[q + j]); ) { j++; }
            if (j === plen) { diff = false; }
        }
        if (diff) { name++; q = p; qlen = plen; }
        SA[m + (p >>> 1)] = name;
    }

    return name;
};

/* compute SA and BWT */
var induceSA = function(T, SA, C, B, n, k) {
    var b, i, j;
    var c0, c1;
    /* compute SAl */
    if (C === B) { getCounts(T, C, n, k); }
    getBuckets(C, B, k, false); /* find starts of buckets */
    j = n - 1;
    b = B[c1 = T[j]];
    SA[b++] = ((j > 0) && (T[j-1] < c1)) ? ~j : j;
    for (i = 0; i < n; i++) {
        j = SA[i]; SA[i] = ~j;
        if (j > 0) {
            j--;
            ASSERT( T[j] >= T[j + 1] );
            if ((c0 = T[j]) !== c1) { B[c1]  = b; b = B[c1=c0]; }
            ASSERT( i < b );
            SA[b++] = ((j > 0) && (T[j-1] < c1)) ? ~j : j;
        }
    }
    /* compute SAs */
    if (C === B) { getCounts(T, C, n, k); }
    getBuckets(C, B, k, true); /* find ends of buckets */
    for (i = n-1, b = B[c1 = 0]; i >= 0; i--) {
        if ((j = SA[i]) > 0) {
            j--;
            ASSERT( T[j] <= T[j + 1] );
            if ((c0 = T[j]) !== c1) { B[c1] = b; b = B[c1 = c0]; }
            ASSERT( b <= i );
            SA[--b] = ((j === 0) || (T[j - 1] > c1)) ? ~j : j;
        } else {
            SA[i] = ~j;
        }
    }
};

var computeBWT = function(T, SA, C, B, n, k) {
    var b, i, j, pidx = -1;
    var c0, c1;
    /* compute SAl */
    if (C === B) { getCounts(T, C, n, k); }
    getBuckets(C, B, k, false); /* find starts of buckets */
    j = n - 1;
    b = B[c1 = T[j]];
    SA[b++] = ((j > 0) && (T[j - 1] < c1)) ? ~j : j;
    for (i = 0; i < n; i++) {
        if ((j=SA[i]) > 0) {
            j--;
            ASSERT( T[j] >= T[j+1] );
            SA[i] = ~(c0 = T[j]);
            if (c0 !== c1) { B[c1] = b; b = B[c1 = c0]; }
            ASSERT( i < b );
            SA[b++] = ((j > 0) && (T[j - 1] < c1)) ? ~j : j;
        } else if (j !== 0) {
            SA[i] = ~j;
        }
    }
    /* compute SAs */
    if (C === B) { getCounts(T, C, n, k); }
    getBuckets(C, B, k, true); /* find ends of buckets */
    for (i = n-1, b = B[c1 = 0]; i >= 0; i--) {
        if ((j = SA[i]) > 0) {
            j--;
            ASSERT( T[j] <= T[j+1] );
            SA[i] = c0 = T[j];
            if (c0 !== c1) { B[c1] = b; b = B[c1 = c0]; }
            ASSERT( b <= i );
            SA[--b] = ((j > 0) && (T[j-1] > c1)) ? (~T[j-1]) : j;
        } else if (j !== 0) {
            SA[i] = ~j;
        } else {
            pidx = i;
        }
    }
    return pidx;
};

/* find the suffix array SA of T[0..n-1] in {0..k-1}^n
    use a working space (excluding T and SA) of at most 2n+O(1) for a
    constant alphabet */
var SA_IS = function(T, SA, fs, n, k, isbwt) {
    var C, B, RA;
    var i, j, b, c, m, p, q, name, pidx = 0, newfs;
    var c0, c1;
    var flags = 0;

    // allocate temporary storage [CSA]
    if (k <= 256) {
        C = Util.makeS32Buffer(k);
        if (k <= fs) { B = SA.subarray(n + fs - k); flags = 1; }
        else { B = Util.makeS32Buffer(k); flags = 3; }
    } else if (k <= fs) {
        C = SA.subarray(n + fs - k);
        if (k <= (fs - k)) { B = SA.subarray(n + fs - k * 2); flags = 0; }
        else if (k <= 1024) { B = Util.makeS32Buffer(k); flags = 2; }
        else { B = C; flags = 8; }
    } else {
        C = B = Util.makeS32Buffer(k);
        flags = 4 | 8;
    }

    /* stage 1: reduce the problem by at least 1/2
        sort all the LMS-substrings */
    getCounts(T, C, n, k);
    getBuckets(C, B, k, true); /* find ends of buckets */
    for (i = 0; i < n; i++) { SA[i] = 0; }
    b = -1; i = n - 1; j = n; m = 0; c0 = T[n - 1];
    do { c1 = c0; } while ((--i >= 0) && ((c0 = T[i]) >= c1));
    for (; i >= 0 ;) {
        do { c1 = c0; } while ((--i >= 0) && ((c0 = T[i]) <= c1));
        if ( i >= 0 ) {
            if ( b >= 0 ) { SA[b] = j; }
            b = --B[c1];
            j = i;
            ++m;
            do { c1 = c0; } while ((--i >= 0) && ((c0 = T[i]) >= c1));
        }
    }

    if (m > 1) {
        LMSsort(T, SA, C, B, n, k);
        name = LMSpostproc(T, SA, n, m);
    } else if (m === 1) {
        SA[b] = j + 1;
        name = 1;
    } else {
        name = 0;
    }

    /* stage 2: solve the reduced problem
        recurse if names are not yet unique */
    if(name < m) {
        if((flags & 4) !== 0) { C = null; B = null; }
        if((flags & 2) !== 0) { B = null; }
        newfs = (n + fs) - (m * 2);
        if((flags & (1 | 4 | 8)) === 0) {
            if((k + name) <= newfs) { newfs -= k; }
            else { flags |= 8; }
        }
        ASSERT( (n >>> 1) <= (newfs + m) );
        for (i = m + (n >>> 1) - 1, j = m * 2 + newfs - 1; m <= i; i--) {
            if(SA[i] !== 0) { SA[j--] = SA[i] - 1; }
        }
        RA = SA.subarray(m + newfs);
        SA_IS(RA, SA, newfs, m, name, false);
        RA = null;

        i = n - 1; j = m * 2 - 1; c0 = T[n - 1];
        do { c1 = c0; } while ((--i >= 0) && ((c0 = T[i]) >= c1));
        for (; i >= 0 ;) {
            do { c1 = c0; } while ((--i >= 0) && ((c0 = T[i]) <= c1));
            if ( i >= 0 ) {
                SA[j--] = i + 1;
                do { c1 = c0; } while ((--i >= 0) && ((c0 = T[i]) >= c1));
            }
        }

        for (i = 0; i < m; i++) { SA[i] = SA[m + SA[i]]; }
        if((flags & 4) !== 0) { C = B = Util.makeS32Buffer(k); }
        if((flags & 2) !== 0) { B = Util.makeS32Buffer(k); }
    }

    /* stage 3: induce the result for the original problem */
    if((flags & 8) !== 0) { getCounts(T, C, n, k); }
    /* put all left-most S characters into their buckets */
    if (m > 1) {
        getBuckets(C, B, k, true); /* find ends of buckets */
        i = m - 1; j = n; p = SA[m - 1]; c1 = T[p];
        do {
            q = B[c0 = c1];
            while (q < j) { SA[--j] = 0; }
            do {
                SA[--j] = p;
                if(--i < 0) { break; }
                p = SA[i];
            } while((c1 = T[p]) === c0);
        } while (i >= 0 );
        while ( j > 0 ) { SA[--j] = 0; }
    }
    if (!isbwt) { induceSA(T, SA, C, B, n, k); }
    else { pidx = computeBWT(T, SA, C, B, n, k); }
    C = null; B = null;
    return pidx;
};

var BWT = Object.create(null);
/** SA should be a Int32Array (signed!); T can be any typed array.
 *  alphabetSize is optional if T is an Uint8Array or Uint16Array. */
BWT.suffixsort = function(T, SA, n, alphabetSize) {
    ASSERT( T && SA && T.length >= n && SA.length >= n );
    if (n <= 1) {
        if (n === 1) { SA[0] = 0; }
        return 0;
    }
    if (!alphabetSize) {
        if (T.BYTES_PER_ELEMENT === 1) { alphabetSize = 256; }
        else if (T.BYTES_PER_ELEMENT === 2) { alphabetSize = 65536; }
        else throw new Error('Need to specify alphabetSize');
    }
    ASSERT( alphabetSize > 0 );
    if (T.BYTES_PER_ELEMENT) {
        ASSERT( alphabetSize <= (1 << (T.BYTES_PER_ELEMENT*8) ) );
    }
    return SA_IS(T, SA, 0, n, alphabetSize, false);
};
/** Burrows-Wheeler Transform.
    A should be Int32Array (signed!); T can be any typed array.
    U is the same type as T (it is used for output).
    alphabetSize is optional if T is an Uint8Array or Uint16Array.
    ASSUMES STRING IS TERMINATED WITH AN EOF CHARACTER.
*/
BWT.bwtransform = function(T, U, A, n, alphabetSize) {
    var i, pidx;
    ASSERT( T && U && A );
    ASSERT( T.length >= n && U.length >= n && A.length >= n );
    if (n <= 1) {
        if (n === 1) { U[0] = T[0]; }
        return n;
    }
    if (!alphabetSize) {
        if (T.BYTES_PER_ELEMENT === 1) { alphabetSize = 256; }
        else if (T.BYTES_PER_ELEMENT === 2) { alphabetSize = 65536; }
        else throw new Error('Need to specify alphabetSize');
    }
    ASSERT( alphabetSize > 0 );
    if (T.BYTES_PER_ELEMENT) {
        ASSERT( alphabetSize <= (1 << (T.BYTES_PER_ELEMENT*8) ) );
    }
    pidx = SA_IS(T, A, 0, n, alphabetSize, true);
    U[0] = T[n - 1];
    for (i = 0; i < pidx ; i++) { U[i + 1] = A[i]; }
    for (i += 1; i < n; i++) { U[i] = A[i]; }
    return pidx + 1;
};
/** Reverses transform above. (ASSUMED STRING IS TERMINATED WITH EOF.) */
BWT.unbwtransform = function(T, U, LF, n, pidx) {
    var C = Util.makeU32Buffer(256);
    var i, t;
    for (i=0; i<256; i++) { C[i] = 0; }
    for (i=0; i<n; i++) { LF[i] = C[T[i]]++; }
    for (i=0, t=0; i<256; i++) { t += C[i]; C[i] = t - C[i]; }
    for (i=n-1, t=0; i>=0; i--) {
        t = LF[t] + C[U[i]=T[t]];
        t += (t<pidx) ? 1 : 0;
    }
    C = null;
};

/** Burrows-Wheeler Transform.
    A should be Int32Array (signed!); T can be any typed array.
    U is the same type as T (it is used for output).
    alphabetSize is optional if T is an Uint8Array or Uint16Array.
    ASSUMES STRING IS CYCLIC.
    (XXX: this is twice as inefficient as I'd like! [CSA])
*/
BWT.bwtransform2 = function(T, U, n, alphabetSize) {
    var i, j, pidx = 0;
    ASSERT( T && U );
    ASSERT( T.length >= n && U.length >= n );
    if (n <= 1) {
        if (n === 1) { U[0] = T[0]; }
        return 0;
    }
    if (!alphabetSize) {
        if (T.BYTES_PER_ELEMENT === 1) { alphabetSize = 256; }
        else if (T.BYTES_PER_ELEMENT === 2) { alphabetSize = 65536; }
        else throw new Error('Need to specify alphabetSize');
    }
    ASSERT( alphabetSize > 0 );
    if (T.BYTES_PER_ELEMENT) {
        ASSERT( alphabetSize <= (1 << (T.BYTES_PER_ELEMENT*8) ) );
    }
    // double length of T
    var TT;
    if (T.length >= n*2) {
        TT = T; // do it in place if possible
    } else if (alphabetSize <= 256) {
        TT = Util.makeU8Buffer(n*2);
    } else if (alphabetSize <= 65536) {
        TT = Util.makeU16Buffer(n*2);
    } else {
        TT = Util.makeU32Buffer(n*2);
    }
    if (TT!==T) {
        for (i=0; i<n; i++) { TT[i] = T[i]; }
    }
    for (i=0; i<n; i++) { TT[n+i] = TT[i]; }
    // sort doubled string
    var A = Util.makeS32Buffer(n*2);
    SA_IS(TT, A, 0, n*2, alphabetSize, false);
    for (i=0, j=0; i<2*n; i++) {
        var s = A[i];
        if (s < n) {
            if (s === 0) { pidx = j; }
            if (--s < 0) { s = n-1; }
            U[j++] = T[s];
        }
    }
    ASSERT(j===n);
    return pidx;
};




var BitStream = function(stream) {
    (function() {
        var bufferByte = 0x100; // private var for readers
        this.readBit = function() {
            if ((bufferByte & 0xFF) === 0) {
                var ch = stream.readByte();
                if (ch === Stream.EOF) {
                    this._eof = true;
                    return ch; /* !!! */
                }
                bufferByte = (ch << 1) | 1;
            }
            var bit = (bufferByte & 0x100) ? 1 : 0;
            bufferByte <<= 1;
            return bit;
        };
        // seekable iff the provided stream is
        this.seekBit = function(pos) {
            var n_byte = pos >>> 3;
            var n_bit = pos - (n_byte*8);
            this.seek(n_byte);
            this._eof = false;
            this.readBits(n_bit);
        };
        this.tellBit = function() {
            var pos = stream.tell() * 8;
            var b = bufferByte;
            while ((b & 0xFF) !== 0) {
                pos--;
                b <<= 1;
            }
            return pos;
        };
        // implement byte stream interface as well.
        this.readByte = function() {
            if ((bufferByte & 0xFF) === 0) {
                return stream.readByte();
            }
            return this.readBits(8);
        };
        this.seek = function(pos) {
            stream.seek(pos);
            bufferByte = 0x100;
        };
    }).call(this);
    (function() {
        var bufferByte = 1; // private var for writers
        this.writeBit = function(b) {
            bufferByte <<= 1;
            if (b) { bufferByte |= 1; }
            if (bufferByte & 0x100) {
                stream.writeByte(bufferByte & 0xFF);
                bufferByte = 1;
            }
        };
        // implement byte stream interface as well
        this.writeByte = function(_byte) {
            if (bufferByte===1) {
                stream.writeByte(_byte);
            } else {
                stream.writeBits(8, _byte);
            }
        };
        this.flush = function() {
            while (bufferByte !== 1) {
                this.writeBit(0);
            }
            if (stream.flush) { stream.flush(); }
        };
    }).call(this);
};
// inherit read/write methods from Stream.
BitStream.EOF = Stream.EOF;
BitStream.prototype = Object.create(Stream.prototype);
// bit chunk read/write
BitStream.prototype.readBits = function(n) {
    var i, r = 0, b;
    if (n > 31) {
        r = this.readBits(n-16)*0x10000; // fp multiply, not shift
        return r + this.readBits(16);
    }
    for (i = 0; i < n; i++) {
        r <<= 1; // this could make a negative value if n>31
        // bits read past EOF are all zeros!
        if (this.readBit() > 0) { r++; }
    }
    return r;
};
BitStream.prototype.writeBits = function(n, value) {
    if (n > 32) {
        var low = (value & 0xFFFF);
        var high = (value - low) / (0x10000); // fp division, not shift
        this.writeBits(n-16, high);
        this.writeBits(16, low);
        return;
    }
    var i;
    for (i = n-1; i >= 0; i--) {
        this.writeBit( (value >>> i) & 1 );
    }
};



var MAX_HUFCODE_BITS = 20;
var MAX_SYMBOLS = 258;
var SYMBOL_RUNA = 0;
var SYMBOL_RUNB = 1;
var MIN_GROUPS = 2;
var MAX_GROUPS = 6;
var GROUP_SIZE = 50;

var WHOLEPI = 0x314159265359; // 48-bit integer
var SQRTPI =  0x177245385090; // 48-bit integer

var EOF = Stream.EOF;

var mtf = function(array, index) {
  var src = array[index], i;
  for (i = index; i > 0; i--) {
    array[i] = array[i-1];
  }
  array[0] = src;
  return src;
};

var Err = {
  OK: 0,
  LAST_BLOCK: -1,
  NOT_BZIP_DATA: -2,
  UNEXPECTED_INPUT_EOF: -3,
  UNEXPECTED_OUTPUT_EOF: -4,
  DATA_ERROR: -5,
  OUT_OF_MEMORY: -6,
  OBSOLETE_INPUT: -7,
  END_OF_BLOCK: -8
};
var ErrorMessages = {};
ErrorMessages[Err.LAST_BLOCK] =            "Bad file checksum";
ErrorMessages[Err.NOT_BZIP_DATA] =         "Not bzip data";
ErrorMessages[Err.UNEXPECTED_INPUT_EOF] =  "Unexpected input EOF";
ErrorMessages[Err.UNEXPECTED_OUTPUT_EOF] = "Unexpected output EOF";
ErrorMessages[Err.DATA_ERROR] =            "Data error";
ErrorMessages[Err.OUT_OF_MEMORY] =         "Out of memory";
ErrorMessages[Err.OBSOLETE_INPUT] = "Obsolete (pre 0.9.5) bzip format not supported.";

var _throw = function(status, optDetail) {
  var msg = ErrorMessages[status] || 'unknown error';
  if (optDetail) { msg += ': '+optDetail; }
  var e = new TypeError(msg);
  e.errorCode = status;
  throw e;
};

var Bunzip = function(inputStream, outputStream) {
  this.writePos = this.writeCurrent = this.writeCount = 0;

  this._start_bunzip(inputStream, outputStream);
};
Bunzip.prototype._init_block = function() {
  var moreBlocks = this._get_next_block();
  if ( !moreBlocks ) {
    this.writeCount = -1;
    return false; /* no more blocks */
  }
  this.blockCRC = new CRC32();
  return true;
};
/* XXX micro-bunzip uses (inputStream, inputBuffer, len) as arguments */
Bunzip.prototype._start_bunzip = function(inputStream, outputStream) {
  /* Ensure that file starts with "BZh['1'-'9']." */
  var buf = Util.makeU8Buffer(4);
  if (inputStream.read(buf, 0, 4) !== 4 ||
      String.fromCharCode(buf[0], buf[1], buf[2]) !== 'BZh')
    _throw(Err.NOT_BZIP_DATA, 'bad magic');

  var level = buf[3] - 0x30;
  if (level < 1 || level > 9)
    _throw(Err.NOT_BZIP_DATA, 'level out of range');

  this.reader = new BitStream(inputStream);

  /* Fourth byte (ascii '1'-'9'), indicates block size in units of 100k of
     uncompressed data.  Allocate intermediate buffer for block. */
  this.dbufSize = 100000 * level;
  this.nextoutput = 0;
  this.outputStream = outputStream;
  this.streamCRC = 0;
};
Bunzip.prototype._get_next_block = function() {
  var i, j, k;
  var reader = this.reader;
  // this is get_next_block() function from micro-bunzip:
  /* Read in header signature and CRC, then validate signature.
     (last block signature means CRC is for whole file, return now) */
  var h = reader.readBits(48);
  if (h === SQRTPI) { // last block
    return false; /* no more blocks */
  }
  if (h !== WHOLEPI)
    _throw(Err.NOT_BZIP_DATA);
  this.targetBlockCRC = reader.readBits(32);
  this.streamCRC = (this.targetBlockCRC ^
                    ((this.streamCRC << 1) | (this.streamCRC>>>31))) >>> 0;
  /* We can add support for blockRandomised if anybody complains.  There was
     some code for this in busybox 1.0.0-pre3, but nobody ever noticed that
     it didn't actually work. */
  if (reader.readBits(1))
    _throw(Err.OBSOLETE_INPUT);
  var origPointer = reader.readBits(24);
  if (origPointer > this.dbufSize)
    _throw(Err.DATA_ERROR, 'initial position out of bounds');
  /* mapping table: if some byte values are never used (encoding things
     like ASCII text), the compression code removes the gaps to have fewer
     symbols to deal with, and writes a sparse bitfield indicating which
     values were present.  We make a translation table to convert the symbols
     back to the corresponding bytes. */
  var t = reader.readBits(16);
  var symToByte = Util.makeU8Buffer(256), symTotal = 0;
  for (i = 0; i < 16; i++) {
    if (t & (1 << (0xF - i))) {
      var o = i * 16;
      k = reader.readBits(16);
      for (j = 0; j < 16; j++)
        if (k & (1 << (0xF - j)))
          symToByte[symTotal++] = o + j;
    }
  }

  /* How many different Huffman coding groups does this block use? */
  var groupCount = reader.readBits(3);
  if (groupCount < MIN_GROUPS || groupCount > MAX_GROUPS)
    _throw(Err.DATA_ERROR);
  /* nSelectors: Every GROUP_SIZE many symbols we select a new Huffman coding
     group.  Read in the group selector list, which is stored as MTF encoded
     bit runs.  (MTF=Move To Front, as each value is used it's moved to the
     start of the list.) */
  var nSelectors = reader.readBits(15);
  if (nSelectors === 0)
    _throw(Err.DATA_ERROR);

  var mtfSymbol = Util.makeU8Buffer(256);
  for (i = 0; i < groupCount; i++)
    mtfSymbol[i] = i;

  var selectors = Util.makeU8Buffer(nSelectors); // was 32768...

  for (i = 0; i < nSelectors; i++) {
    /* Get next value */
    for (j = 0; reader.readBits(1); j++)
      if (j >= groupCount) _throw(Err.DATA_ERROR);
    /* Decode MTF to get the next selector */
    selectors[i] = mtf(mtfSymbol, j);
  }

  /* Read the Huffman coding tables for each group, which code for symTotal
     literal symbols, plus two run symbols (RUNA, RUNB) */
  var symCount = symTotal + 2;
  var groups = [], hufGroup;
  for (j = 0; j < groupCount; j++) {
    var length = Util.makeU8Buffer(symCount), temp = Util.makeU16Buffer(MAX_HUFCODE_BITS + 1);
    /* Read Huffman code lengths for each symbol.  They're stored in
       a way similar to MTF; record a starting value for the first symbol,
       and an offset from the previous value for every symbol after that. */
    t = reader.readBits(5); // lengths
    for (i = 0; i < symCount; i++) {
      for (;;) {
        if (t < 1 || t > MAX_HUFCODE_BITS) _throw(Err.DATA_ERROR);
        /* If first bit is 0, stop.  Else second bit indicates whether
           to increment or decrement the value. */
        if(!reader.readBits(1))
          break;
        if(!reader.readBits(1))
          t++;
        else
          t--;
      }
      length[i] = t;
    }

    /* Find largest and smallest lengths in this group */
    var minLen,  maxLen;
    minLen = maxLen = length[0];
    for (i = 1; i < symCount; i++) {
      if (length[i] > maxLen)
        maxLen = length[i];
      else if (length[i] < minLen)
        minLen = length[i];
    }

    /* Calculate permute[], base[], and limit[] tables from length[].
     *
     * permute[] is the lookup table for converting Huffman coded symbols
     * into decoded symbols.  base[] is the amount to subtract from the
     * value of a Huffman symbol of a given length when using permute[].
     *
     * limit[] indicates the largest numerical value a symbol with a given
     * number of bits can have.  This is how the Huffman codes can vary in
     * length: each code with a value>limit[length] needs another bit.
     */
    hufGroup = {};
    groups.push(hufGroup);
    hufGroup.permute = Util.makeU16Buffer(MAX_SYMBOLS);
    hufGroup.limit = Util.makeU32Buffer(MAX_HUFCODE_BITS + 2);
    hufGroup.base = Util.makeU32Buffer(MAX_HUFCODE_BITS + 1);
    hufGroup.minLen = minLen;
    hufGroup.maxLen = maxLen;
    /* Calculate permute[].  Concurrently, initialize temp[] and limit[]. */
    var pp = 0;
    for (i = minLen; i <= maxLen; i++) {
      temp[i] = hufGroup.limit[i] = 0;
      for (t = 0; t < symCount; t++)
        if (length[t] === i)
          hufGroup.permute[pp++] = t;
    }
    /* Count symbols coded for at each bit length */
    for (i = 0; i < symCount; i++)
      temp[length[i]]++;
    /* Calculate limit[] (the largest symbol-coding value at each bit
     * length, which is (previous limit<<1)+symbols at this level), and
     * base[] (number of symbols to ignore at each bit length, which is
     * limit minus the cumulative count of symbols coded for already). */
    pp = t = 0;
    for (i = minLen; i < maxLen; i++) {
      pp += temp[i];
      /* We read the largest possible symbol size and then unget bits
         after determining how many we need, and those extra bits could
         be set to anything.  (They're noise from future symbols.)  At
         each level we're really only interested in the first few bits,
         so here we set all the trailing to-be-ignored bits to 1 so they
         don't affect the value>limit[length] comparison. */
      hufGroup.limit[i] = pp - 1;
      pp <<= 1;
      t += temp[i];
      hufGroup.base[i + 1] = pp - t;
    }
    hufGroup.limit[maxLen + 1] = Number.MAX_VALUE; /* Sentinel value for reading next sym. */
    hufGroup.limit[maxLen] = pp + temp[maxLen] - 1;
    hufGroup.base[minLen] = 0;
  }
  /* We've finished reading and digesting the block header.  Now read this
     block's Huffman coded symbols from the file and undo the Huffman coding
     and run length encoding, saving the result into dbuf[dbufCount++]=uc */

  /* Initialize symbol occurrence counters and symbol Move To Front table */
  var byteCount = Util.makeU32Buffer(256);
  for (i = 0; i < 256; i++)
    mtfSymbol[i] = i;
  /* Loop through compressed symbols. */
  var runPos = 0, dbufCount = 0, selector = 0, uc;
  var dbuf = this.dbuf = Util.makeU32Buffer(this.dbufSize);
  symCount = 0;
  for (;;) {
    /* Determine which Huffman coding group to use. */
    if (!(symCount--)) {
      symCount = GROUP_SIZE - 1;
      if (selector >= nSelectors) { _throw(Err.DATA_ERROR); }
      hufGroup = groups[selectors[selector++]];
    }
    /* Read next Huffman-coded symbol. */
    i = hufGroup.minLen;
    j = reader.readBits(i);
    for (;;i++) {
      if (i > hufGroup.maxLen) { _throw(Err.DATA_ERROR); }
      if (j <= hufGroup.limit[i])
        break;
      j = (j << 1) | reader.readBits(1);
    }
    /* Huffman decode value to get nextSym (with bounds checking) */
    j -= hufGroup.base[i];
    if (j < 0 || j >= MAX_SYMBOLS) { _throw(Err.DATA_ERROR); }
    var nextSym = hufGroup.permute[j];
    /* We have now decoded the symbol, which indicates either a new literal
       byte, or a repeated run of the most recent literal byte.  First,
       check if nextSym indicates a repeated run, and if so loop collecting
       how many times to repeat the last literal. */
    if (nextSym === SYMBOL_RUNA || nextSym === SYMBOL_RUNB) {
      /* If this is the start of a new run, zero out counter */
      if (!runPos){
        runPos = 1;
        t = 0;
      }
      /* Neat trick that saves 1 symbol: instead of or-ing 0 or 1 at
         each bit position, add 1 or 2 instead.  For example,
         1011 is 1<<0 + 1<<1 + 2<<2.  1010 is 2<<0 + 2<<1 + 1<<2.
         You can make any bit pattern that way using 1 less symbol than
         the basic or 0/1 method (except all bits 0, which would use no
         symbols, but a run of length 0 doesn't mean anything in this
         context).  Thus space is saved. */
      if (nextSym === SYMBOL_RUNA)
        t += runPos;
      else
        t += 2 * runPos;
      runPos <<= 1;
      continue;
    }
    /* When we hit the first non-run symbol after a run, we now know
       how many times to repeat the last literal, so append that many
       copies to our buffer of decoded symbols (dbuf) now.  (The last
       literal used is the one at the head of the mtfSymbol array.) */
    if (runPos){
      runPos = 0;
      if (dbufCount + t > this.dbufSize) { _throw(Err.DATA_ERROR); }
      uc = symToByte[mtfSymbol[0]];
      byteCount[uc] += t;
      while (t--)
        dbuf[dbufCount++] = uc;
    }
    /* Is this the terminating symbol? */
    if (nextSym > symTotal)
      break;
    /* At this point, nextSym indicates a new literal character.  Subtract
       one to get the position in the MTF array at which this literal is
       currently to be found.  (Note that the result can't be -1 or 0,
       because 0 and 1 are RUNA and RUNB.  But another instance of the
       first symbol in the MTF array, position 0, would have been handled
       as part of a run above.  Therefore 1 unused MTF position minus
       2 non-literal nextSym values equals -1.) */
    if (dbufCount >= this.dbufSize) { _throw(Err.DATA_ERROR); }
    i = nextSym - 1;
    uc = mtf(mtfSymbol, i);
    uc = symToByte[uc];
    /* We have our literal byte.  Save it into dbuf. */
    byteCount[uc]++;
    dbuf[dbufCount++] = uc;
  }
  /* At this point, we've read all the Huffman-coded symbols (and repeated
     runs) for this block from the input stream, and decoded them into the
     intermediate buffer.  There are dbufCount many decoded bytes in dbuf[].
     Now undo the Burrows-Wheeler transform on dbuf.
     See http://dogma.net/markn/articles/bwt/bwt.htm
  */
  if (origPointer < 0 || origPointer >= dbufCount) { _throw(Err.DATA_ERROR); }
  /* Turn byteCount into cumulative occurrence counts of 0 to n-1. */
  j = 0;
  for (i = 0; i < 256; i++) {
    k = j + byteCount[i];
    byteCount[i] = j;
    j = k;
  }
  /* Figure out what order dbuf would be in if we sorted it. */
  for (i = 0; i < dbufCount; i++) {
    uc = dbuf[i] & 0xff;
    dbuf[byteCount[uc]] |= (i << 8);
    byteCount[uc]++;
  }
  /* Decode first byte by hand to initialize "previous" byte.  Note that it
     doesn't get output, and if the first three characters are identical
     it doesn't qualify as a run (hence writeRunCountdown=5). */
  var pos = 0, current = 0, run = 0;
  if (dbufCount) {
    pos = dbuf[origPointer];
    current = (pos & 0xff);
    pos >>= 8;
    run = -1;
  }
  this.writePos = pos;
  this.writeCurrent = current;
  this.writeCount = dbufCount;
  this.writeRun = run;

  return true; /* more blocks to come */
};
/* Undo burrows-wheeler transform on intermediate buffer to produce output.
   If start_bunzip was initialized with out_fd=-1, then up to len bytes of
   data are written to outbuf.  Return value is number of bytes written or
   error (all errors are negative numbers).  If out_fd!=-1, outbuf and len
   are ignored, data is written to out_fd and return is RETVAL_OK or error.
*/
Bunzip.prototype._read_bunzip = function(outputBuffer, len) {
    var copies, previous, outbyte;
    /* james@jamestaylor.org: writeCount goes to -1 when the buffer is fully
       decoded, which results in this returning RETVAL_LAST_BLOCK, also
       equal to -1... Confusing, I'm returning 0 here to indicate no
       bytes written into the buffer */
  if (this.writeCount < 0) { return 0; }

  var gotcount = 0;
  var dbuf = this.dbuf, pos = this.writePos, current = this.writeCurrent;
  var dbufCount = this.writeCount, outputsize = this.outputsize;
  var run = this.writeRun;

  while (dbufCount) {
    dbufCount--;
    previous = current;
    pos = dbuf[pos];
    current = pos & 0xff;
    pos >>= 8;
    if (run++ === 3){
      copies = current;
      outbyte = previous;
      current = -1;
    } else {
      copies = 1;
      outbyte = current;
    }
    this.blockCRC.updateCRCRun(outbyte, copies);
    while (copies--) {
      this.outputStream.writeByte(outbyte);
      this.nextoutput++;
    }
    if (current != previous)
      run = 0;
  }
  this.writeCount = dbufCount;
  // check CRC
  if (this.blockCRC.getCRC() !== this.targetBlockCRC) {
    _throw(Err.DATA_ERROR, "Bad block CRC "+
           "(got "+this.blockCRC.getCRC().toString(16)+
           " expected "+this.targetBlockCRC.toString(16)+")");
  }
  return this.nextoutput;
};

/* Static helper functions */
Bunzip.Err = Err;
// 'input' can be a stream or a buffer
// 'output' can be a stream or a buffer or a number (buffer size)
Bunzip.decode = function(input, output, multistream) {
  // make a stream from a buffer, if necessary
  var inputStream = Util.coerceInputStream(input);
  var o = Util.coerceOutputStream(output, output);
  var outputStream = o.stream;

  var bz = new Bunzip(inputStream, outputStream);
  while (true) {
    if ('eof' in inputStream && inputStream.eof()) break;
    if (bz._init_block()) {
      bz._read_bunzip();
    } else {
      var targetStreamCRC = bz.reader.readBits(32);
      if (targetStreamCRC !== bz.streamCRC) {
        _throw(Err.DATA_ERROR, "Bad stream CRC "+
               "(got "+bz.streamCRC.toString(16)+
               " expected "+targetStreamCRC.toString(16)+")");
      }
      if (multistream &&
          'eof' in inputStream &&
          !inputStream.eof()) {
        // note that start_bunzip will also resync the bit reader to next byte
        bz._start_bunzip(inputStream, outputStream);
      } else break;
    }
  }
  return o.retval;
};
Bunzip.decodeBlock = function(input, pos, output) {
  // make a stream from a buffer, if necessary
  var inputStream = Util.coerceInputStream(input);
  var o = Util.coerceOutputStream(output, output);
  var outputStream = o.stream;
  var bz = new Bunzip(inputStream, outputStream);
  bz.reader.seekBit(pos);
  /* Fill the decode buffer for the block */
  var moreBlocks = bz._get_next_block();
  if (moreBlocks) {
    /* Init the CRC for writing */
    bz.blockCRC = new CRC32();

    /* Zero this so the current byte from before the seek is not written */
    bz.writeCopies = 0;

    /* Decompress the block and write to stdout */
    bz._read_bunzip();
    // XXX keep writing?
  }
  return o.retval;
};
/* Reads bzip2 file from stream or buffer `input`, and invoke
 * `callback(position, size)` once for each bzip2 block,
 * where position gives the starting position (in *bits*)
 * and size gives uncompressed size of the block (in *bytes*). */
Bunzip.table = function(input, callback, multistream) {
  // make a stream from a buffer, if necessary
  var inputStream = new Stream();
  inputStream.delegate = Util.coerceInputStream(input);
  inputStream.pos = 0;
  inputStream.readByte = function() {
    this.pos++;
    return this.delegate.readByte();
  };
  inputStream.tell = function() { return this.pos; };
  if (inputStream.delegate.eof) {
    inputStream.eof = inputStream.delegate.eof.bind(inputStream.delegate);
  }
  var outputStream = new Stream();
  outputStream.pos = 0;
  outputStream.writeByte = function() { this.pos++; };

  var bz = new Bunzip(inputStream, outputStream);
  var blockSize = bz.dbufSize;
  while (true) {
    if ('eof' in inputStream && inputStream.eof()) break;

    var position = bz.reader.tellBit();

    if (bz._init_block()) {
      var start = outputStream.pos;
      bz._read_bunzip();
      callback(position, outputStream.pos - start);
    } else {
      var crc = bz.reader.readBits(32); // (but we ignore the crc)
      if (multistream &&
          'eof' in inputStream &&
          !inputStream.eof()) {
        // note that start_bunzip will also resync the bit reader to next byte
        bz._start_bunzip(inputStream, outputStream);
        console.assert(bz.dbufSize === blockSize,
                       "shouldn't change block size within multistream file");
      } else break;
    }
  }
};

// create a Huffman tree from the table of frequencies
var StaticHuffman = function(freq, alphabetSize) {
  // As in BZip2HuffmanStageEncoder.java (from jbzip2):
  // The Huffman allocator needs its input symbol frequencies to be
  // sorted, but we need to return code lengths in the same order as
  // the corresponding frequencies are passed in.
  // The symbol frequency and index are merged into a single array of
  // integers - frequency in the high 23 bits, index in the low 9
  // bits.
  //     2^23 = 8,388,608 which is higher than the maximum possible
  //            frequency for one symbol in a block
  //     2^9 = 512 which is higher than the maximum possible
  //            alphabet size (== 258)
  // Sorting this array simultaneously sorts the frequencies and
  // leaves a lookup that can be used to cheaply invert the sort
  var i, mergedFreq = [];
  for (i=0; i<alphabetSize; i++) {
    mergedFreq[i] = (freq[i] << 9) | i;
  }
  mergedFreq.sort(function(a,b) { return a-b; });
  var sortedFreq = mergedFreq.map(function(v) { return v>>>9; });
  // allocate code lengths in place. (result in sortedFreq array)
  HuffmanAllocator.allocateHuffmanCodeLengths(sortedFreq, MAX_HUFCODE_BITS);
  // reverse the sort to put codes & code lengths in order of input symbols
  this.codeLengths = Util.makeU8Buffer(alphabetSize);
  for (i=0; i<alphabetSize; i++) {
    var sym = mergedFreq[i] & 0x1FF;
    this.codeLengths[sym] = sortedFreq[i];
  }
};
// compute canonical Huffman codes, given code lengths
StaticHuffman.prototype.computeCanonical = function() {
  var alphabetSize = this.codeLengths.length;
  // merge arrays; sort first by length then by symbol.
  var i, merged = [];
  for (i=0; i<alphabetSize; i++) {
    merged[i] = (this.codeLengths[i] << 9) | i;
  }
  merged.sort(function(a,b) { return a-b; });
  // use sorted lengths to assign codes
  this.code = Util.makeU32Buffer(alphabetSize);
  var code = 0, prevLen = 0;
  for (i=0; i<alphabetSize; i++) {
    var curLen = merged[i] >>> 9;
    var sym = merged[i] & 0x1FF;
    console.assert(prevLen <= curLen);
    code <<= (curLen - prevLen);
    this.code[sym] = code++;
    prevLen = curLen;
  }
};
// compute the cost of encoding the given range of symbols w/ this Huffman code
StaticHuffman.prototype.cost = function(array, offset, length) {
  var i, cost = 0;
  for (i=0; i<length; i++) {
    cost += this.codeLengths[array[offset+i]];
  }
  return cost;
};
// emit the bit lengths used by this Huffman code
StaticHuffman.prototype.emit = function(outStream) {
  // write the starting length
  var i, currentLength = this.codeLengths[0];
  outStream.writeBits(5, currentLength);
  for (i=0; i<this.codeLengths.length; i++) {
    var codeLength = this.codeLengths[i];
    var value, delta;
    console.assert(codeLength > 0 && codeLength <= MAX_HUFCODE_BITS);
    if (currentLength < codeLength) {
      value = 2; delta = codeLength - currentLength;
    } else {
      value = 3; delta = currentLength - codeLength;
    }
    while (delta-- > 0) {
      outStream.writeBits(2, value);
    }
    outStream.writeBit(0);
    currentLength = codeLength;
  }
};
// encode the given symbol with this Huffman code
StaticHuffman.prototype.encode = function(outStream, symbol) {
  outStream.writeBits(this.codeLengths[symbol], this.code[symbol]);
};

// read a block for bzip2 compression.
var readBlock = function(inStream, block, length, crc) {
  var pos = 0;
  var lastChar = -1;
  var runLength = 0;
  while (pos < length) {
    if (runLength===4) {
      block[pos++] = 0;
      if (pos >= length) { break; }
    }
    var ch = inStream.readByte();
    if (ch === EOF) {
      break;
    }
    crc.updateCRC(ch);
    if (ch !== lastChar) {
      lastChar = ch;
      runLength = 1;
    } else {
      runLength++;
      if (runLength > 4) {
        if (runLength < 256) {
          block[pos-1]++;
          continue;
        } else {
          runLength = 1;
        }
      }
    }
    block[pos++] = ch;
  }
  return pos;
};

// divide the input into groups at most GROUP_SIZE symbols long.
// assign each group to the Huffman table which compresses it best.
var assignSelectors = function(selectors, groups, input) {
  var i, j, k;
  for (i=0, k=0; i<input.length; i+=GROUP_SIZE) {
    var groupSize = Math.min(GROUP_SIZE, input.length - i);
    var best = 0, bestCost = groups[0].cost(input, i, groupSize);
    for (j=1; j<groups.length; j++) {
      var groupCost = groups[j].cost(input, i, groupSize);
      if (groupCost < bestCost) {
        best = j; bestCost = groupCost;
      }
    }
    selectors[k++] = best;
  }
};
var optimizeHuffmanGroups = function(groups, targetGroups, input,
                                     selectors, alphabetSize) {
  // until we've got "targetGroups" Huffman codes, pick the Huffman code which
  // matches the largest # of groups and split it by picking the groups
  // which require more than the median number of bits to encode.
  // then recompute frequencies and reassign Huffman codes.
  var i, j, k, groupCounts = [];
  while (groups.length < targetGroups) {
    assignSelectors(selectors, groups, input);
    // which code gets used the most?
    for (i=0; i<groups.length; i++) { groupCounts[i] = 0; }
    for (i=0; i<selectors.length; i++) {
      groupCounts[selectors[i]]++;
    }
    var which = groupCounts.indexOf(Math.max.apply(Math, groupCounts));
    // ok, let's look at the size of those blocks
    var splits = [];
    for (i=0, j=0; i<selectors.length; i++) {
      if (selectors[i] !== which) { continue; }
      var start = i*GROUP_SIZE;
      var end = Math.min(start + GROUP_SIZE, input.length);
      splits.push({index: i, cost:groups[which].cost(input, start, end-start)});
    }
    // find the median.  there are O(n) algorithms to do this, but we'll
    // be lazy and use a full O(n ln n) sort.
    splits.sort(function(s1, s2) { return s1.cost - s2.cost; });
    // assign the groups in the top half to the "new" selector
    for (i=(splits.length>>>1); i<splits.length; i++) {
      selectors[splits[i].index] = groups.length;
    }
    groups.push(null);
    // recompute frequencies
    var freq = [], f;
    for (i=0; i<groups.length; i++) {
      f = freq[i] = [];
      for (j=0; j<alphabetSize; j++) { f[j] = 0; }
    }
    for (i=0, j=0; i<input.length; ) {
      f = freq[selectors[j++]];
      for (k=0; k<GROUP_SIZE && i<input.length; k++) {
        f[input[i++]]++;
      }
    }
    // reconstruct Huffman codes
    for (i=0; i<groups.length; i++) {
      groups[i] = new StaticHuffman(freq[i], alphabetSize);
    }
  }
};

var compressBlock = function(block, length, outStream) {
  var c, i, j, k;
  // do BWT transform
  var U = Util.makeU8Buffer(length);
  var pidx = BWT.bwtransform2(block, U, length, 256);
  outStream.writeBit(0); // not randomized
  outStream.writeBits(24, pidx);
  // track values used; write bitmap
  var used = [], compact = [];
  for (i=0; i<length; i++) {
    c = block[i];
    used[c] = true;
    compact[c>>>4] = true;
  }
  for (i=0; i<16; i++) {
    outStream.writeBit(!!compact[i]);
  }
  for (i=0; i<16; i++) {
    if (compact[i]) {
      for (j=0; j<16; j++) {
        outStream.writeBit(!!used[(i<<4)|j]);
      }
    }
  }
  var alphabetSize = 0;
  for (i=0; i<256; i++) {
    if (used[i]) {
      alphabetSize++;
    }
  }
  // now MTF and RLE/2 encoding, while tracking symbol statistics.
  // output can be one longer than length, because we include the
  // end-of-block character at the end. Similarly, we need a U16
  // array because the end-of-block character can be 256.
  var A = Util.makeU16Buffer(length+1);
  var endOfBlock = alphabetSize + 1;
  var freq = [];
  for (i=0; i<=endOfBlock; i++) { freq[i] = 0; }
  var M = Util.makeU8Buffer(alphabetSize);
  for (i=0, j=0; i<256; i++) {
    if (used[i]) { M[j++] = i; }
  }
  used = null; compact = null;
  var pos = 0, runLength = 0;
  var emit = function(c) {
    A[pos++] = c;
    freq[c]++;
  };
  var emitLastRun = function() {
    while (runLength !== 0) {
      if (runLength & 1) {
        emit(0); // RUNA
        runLength -= 1;
      } else {
        emit(1); // RUNB
        runLength -= 2;
      }
      runLength >>>= 1;
    }
  };
  for (i=0; i<U.length; i++) {
    c = U[i];
    // look for C in M
    for (j=0; j<alphabetSize; j++) {
      if (M[j]===c) { break; }
    }
    console.assert(j!==alphabetSize);
    // shift MTF array
    mtf(M, j);
    // emit j
    if (j===0) {
      runLength++;
    } else {
      emitLastRun();
      emit(j+1);
      runLength = 0;
    }
  }
  emitLastRun();
  emit(endOfBlock); // end of block symbol
  A = A.subarray(0, pos);
  // now A[0...pos) has the encoded output, and freq[0-alphabetSize] has the
  // frequencies.  Use these to construct Huffman tables.
  // the canonical bzip2 encoder does some complicated optimization
  // to attempt to select the best tables.  We're going to simplify things:
  // (unless the block is very short) we're always going to create MAX_GROUPS
  // tables; 1 based on global frequencies, and the rest based on dividing the
  // block into MAX_GROUPS-1 pieces.
  var groups = [];
  var targetGroups; // how many Huffman groups should we create?
  // look at length of MTF-encoded block to pick a good number of groups
  if (pos >= 2400) { targetGroups = 6; }
  else if (pos >= 1200) { targetGroups = 5; }
  else if (pos >= 600) { targetGroups = 4; }
  else if (pos >= 200) { targetGroups = 3; }
  else { targetGroups = 2; }
  // start with two Huffman groups: one with the global frequencies, and
  // a second with a flat frequency distribution (which is also the smallest
  // possible Huffman table to encode, which is handy to prevent excessive
  // bloat if the input file size is very small)
  groups.push(new StaticHuffman(freq, endOfBlock+1));
  for (i=0; i<=endOfBlock; i++) { freq[i] = 1; }
  groups.push(new StaticHuffman(freq, endOfBlock+1));
  freq = null;
  // Now optimize the Huffman groups!  this is a black art.
  // we probably don't want to waste too much time on it, though.
  var selectors = Util.makeU8Buffer(Math.ceil(pos / GROUP_SIZE));
  optimizeHuffmanGroups(groups, targetGroups, A, selectors, endOfBlock+1);
  assignSelectors(selectors, groups, A);

  // okay, let's start writing out our Huffman tables
  console.assert(groups.length >= MIN_GROUPS && groups.length <= MAX_GROUPS);
  outStream.writeBits(3, groups.length);
  // and write out the best selector for each group
  outStream.writeBits(15, selectors.length);
  for (i=0; i<groups.length; i++) { M[i] = i; } // initialize MTF table.
  for (i=0; i<selectors.length; i++) {
    var s = selectors[i];
    // find selector in MTF list
    for (j=0; j<groups.length; j++) { if (M[j]===s) { break; } }
    console.assert(j<groups.length);
    mtf(M, j);
    // emit 'j' as a unary number
    for (;j>0; j--) {
      outStream.writeBit(1);
    }
    outStream.writeBit(0);
  }
  // okay, now emit the Huffman tables in order.
  for (i=0; i<groups.length; i++) {
    groups[i].emit(outStream);
    groups[i].computeCanonical(); // get ready for next step while we're at it
  }
  // okay, now (finally!) emit the actual data!
  for (i=0, k=0; i<pos; ) {
    var huff = groups[selectors[k++]];
    for (j=0; j<GROUP_SIZE && i<pos; j++) {
      huff.encode(outStream, A[i++]);
    }
  }
  // done.
};

var Bzip2 = Object.create(null);
Bzip2.compressFile = function(inStream, outStream, props) {
  inStream = Util.coerceInputStream(inStream);
  var o = Util.coerceOutputStream(outStream, outStream);
  outStream = new BitStream(o.stream);

  var blockSizeMultiplier = 9;
  if (typeof(props)==='number') {
    blockSizeMultiplier = props;
  }
  if (blockSizeMultiplier < 1 || blockSizeMultiplier > 9) {
    throw new Error('Invalid block size multiplier');
  }

  var blockSize = blockSizeMultiplier * 100000;
  // the C implementation always writes at least length-19 characters,
  // but it reads ahead enough that if the last character written was part
  // of a run, it writes out the full run.
  // That's really annoying to implement.
  // So instead just subtract 19 from the blockSize; in most cases (unless
  // there's a run at the end of the block) this will yield block divisions
  // matching the C implementation.
  blockSize -= 19;

  // write file magic
  outStream.writeByte('B'.charCodeAt(0));
  outStream.writeByte('Z'.charCodeAt(0));
  outStream.writeByte('h'.charCodeAt(0)); // Huffman-coded bzip
  outStream.writeByte('0'.charCodeAt(0) + blockSizeMultiplier);

  // allocate a buffer for the block
  var block = Util.makeU8Buffer(blockSize);
  var streamCRC = 0;
  var length;

  do {
    var crc = new CRC32();
    length = readBlock(inStream, block, blockSize, crc);
    if (length > 0) {
      streamCRC = (((streamCRC << 1) | (streamCRC>>>31)) ^ crc.getCRC()) >>> 0;
      outStream.writeBits(48, WHOLEPI);
      outStream.writeBits(32, crc.getCRC());
      compressBlock(block, length, outStream);
    }
  } while (length === blockSize);

  // finish up
  outStream.writeBits(48, SQRTPI);
  outStream.writeBits(32, streamCRC);
  outStream.flush(); // get the last bits flushed out
  return o.retval;
};

Bzip2.decompressFile = Bunzip.decode;
Bzip2.decompressBlock = Bunzip.decodeBlock;
Bzip2.table = Bunzip.table;

return Bzip2;
})()
export default bzip