

import fs from 'fs';
// import {NodeSCComponentReader} from './../src/readers/scmod-reader-fs.js'
import SC2XMLJSON from '../src/converter/scjson.js';
import {SC2JSONDebugger} from '../src/converter/debugger.js';
import {SCSchema} from '../src/schema/all.js';


// import { convertXMLtoJSON, stringifyWithInlineArrays, getDebugData ,loadDebugData, saveDebugData} from '../src/convert/convertXMLtoJSON.js';

//-----LOAD MOD Test --------------------------------------
// await loadDebugData();
// const reader = new NodeSCComponentReader({debug: true});
// let data = await reader.load("./test/mods/Factions.sc2mod")
// let data = await reader.load("./test/mods/Scion.sc2mod")
// let data = await reader.load("./test/mods/VoidCoop.sc2mod")
// await saveDebugData()
// fs.writeFileSync('./test/mod.test.json', stringifyWithInlineArrays(data), 'utf-8');

//-----YAML/ZIP Test --------------------------------------
// import YAML from './../src/lib/js-yaml.js'
// import {compressJSON} from './../src/lib/json-zipkey.js'
// let originalLength = JSON.stringify(data).length
// let compressedJSON = compressJSON(data)
// let compresedLength  = JSON.stringify(compressedJSON).length
// fs.writeFileSync('./test/mod.test.zip.json', JSON.stringify(compressedJSON, null, 1), 'utf-8');
// console.log(`compressed ${originalLength} ${compresedLength}`)
// fs.writeFileSync('./test/mod.test.yaml', YAML.dump(data, {flowLevel: -1,styles: {'!!int'  : 'hexadecimal', '!!null' : 'camelcase'}}), 'utf-8');
// fs.writeFileSync('./test/mod.test.zip.yaml', YAML.dump(compressedJSON, {flowLevel: -1,styles: {'!!int'  : 'hexadecimal', '!!null' : 'camelcase'}}), 'utf-8');

//-----JSON to XML and Back --------------------------------------


const cdebugger = new SC2JSONDebugger( {file: './debug.json'});
// const converter = new SC2JSON({debugger: cdebugger})
import NodeSCComponentReader from '../src/readers/scmod-reader-node.js';
const modReader = new NodeSCComponentReader({debugger:  cdebugger });
let mod = await modReader.load("./test/data/input/mods/Liberty.sc2mod");



let xmlText = `<Catalog>
    <CActorUnit id="GenericUnitMinimal">
      <StatusColors index="Shields">
        <ColorArray value="255,0,0,255"/>
      </StatusColors>
    </CActorUnit>
</Catalog>`


const json = converter.toJSON(xmlText);
console.log(JSON.stringify(json,null,1))
console.log(cdebugger.performace());

let xml = converter.toXML(json)
console.log(xml)

console.log("Finished")
