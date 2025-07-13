

import SC2JSONDebugger from '../src/converter/debugger.js';
import NodeReader from '../src/readers/node-reader.js';
import {SCMod, readModData} from '../src/converter/scmod.js';


const reader = new NodeReader("./assets/data/");
const cdebugger = new SC2JSONDebugger( {file: './debug.json'});
let data = await readModData(reader,"bundles/VoidMulti5013.sc2mod",{debugger: cdebugger});


let mod = new SCMod({...data})

mod.setEntitiesRelations()
console.log("fnished")