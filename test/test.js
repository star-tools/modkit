



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


import {SCSchema} from '../src/schema/all.js';
import SC2JSON,{cleanXML} from '../src/converter/sc2xml.js';

const xmlInput = `
<Includes>
    <Catalog path="GameData/CollectionSkin.xml"/>
    <Catalog path="GameData/SC2Events.xml"/>
    <Catalog path="GameData/WarChestSeason5.xml"/>
    <Catalog path="GameData/WarChestSeason6.xml"/>
</Includes>
`

const converter = new SC2JSON()
const json = converter.toJSON(xmlInput);
const xmlOutput = converter.toXML(json,SCSchema.Includes)


if(cleanXML(xmlInput) === cleanXML(xmlOutput)){
  console.log("done!")
}
console.log("Finished")
