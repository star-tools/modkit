import SC2Mod from './SC2Mod.js';
import SC2ModReader from './SC2ModReader.js';

import Reader from './readers/reader.js';
import WebReader from './readers/bfs.js';
import GITReader from './readers/git.js';
import IDBReader from './readers/idb.js';
import NodeReader from './readers/nfs.js';
import URLReader from './readers/url.js';
import VFS from './readers/vfs.js';
import LevelDBReader from './readers/ldb.js';
import MPQReader from './extractors/mpq.js';
import ZIPReader from './extractors/zip.js';

import SC2ENV from './parsers/sc2env.js';
import SC2INI from './parsers/sc2ini.js';
import SC2Script from './parsers/sc2script.js';
import SC2TextureMap from './parsers/sc2texturemap.js';
import SC2XML from './parsers/sc2xml.js';

import SC2Schema from './schema/SC2.js';
import { SCTypes } from './types/types.js';

export default {
    //readers
    Reader,
    WebReader,
    GITReader,
    IDBReader,
    MPQReader,
    NodeReader,
    URLReader,
    ZIPReader,
    LevelDBReader,
    //vfs
    VFS,
    // parsers
    SC2ENV,
    SC2INI,
    SC2Script,
    SC2TextureMap,
    SC2XML,
    //schema
    SC2Schema,
    SC2Types: SCTypes,
    //main
    SC2Mod, 
    SC2ModReader
}
export { SC2Mod, SC2ModReader};