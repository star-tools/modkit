import SC2Mod from './SC2Mod';
import SC2ModReader from './SC2ModReader';

import Reader from './readers/reader';
import WebReader from './readers/bfs';
import GITReader from './readers/git';
import IDBReader from './readers/idb';
import MPQReader from './readers/mpq';
import NodeReader from './readers/nfs';
import URLReader from './readers/url';
import ZIPReader from './readers/zip';
import LevelDBReader from './readers/ldb';
import VFS from './readers/vfs';

import SC2ENV from './parsers/sc2env';
import SC2INI from './parsers/sc2ini';
import SC2Script from './parsers/sc2script';
import SC2TextureMap from './parsers/sc2texturemap';
import SC2XML from './parsers/sc2xml';

import {CDataType} from './types/CDataType';
import { SchemaDefinition } from './schema/SchemaDefinition';


declare const _default: {
    Reader:         Reader;
    WebReader:      WebReader;
    GITReader:      GITReader;
    IDBReader:      IDBReader;
    MPQReader:      MPQReader;
    NodeReader:     NodeReader;
    URLReader:      URLReader;
    ZIPReader:      ZIPReader;
    LevelDBReader:  LevelDBReader;
    VFS:            VFS;
    SC2ENV:         SC2ENV;
    SC2INI:         SC2INI;
    SC2Script:      SC2Script;
    SC2TextureMap:  SC2TextureMap;
    SC2XML:         SC2XML;
    SC2Schema:      {[key:string]: SchemaDefinition};
    SC2Types:       {[key:string]: CDataType};
    SC2Mod:         SC2Mod;
    SC2ModReader:   SC2ModReader;
}

export default _default;
