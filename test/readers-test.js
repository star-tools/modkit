import { GitReader } from "../src/readers/git-reader.js";
import { IDBReader } from "../src/readers/idb-reader.js";
import { NodeReader, isNode } from "../src/readers/node-reader.js";
import { URLReader } from "../src/readers/url-reader.js";
import VFS from "../src/readers/vfs.js";
import { WebReader }  from "../src/readers/web-reader.js";
import ZipReader from "../src/readers/zip-reader.js";

const vfs = new VFS();

if (isNode) {
    vfs.addReader(new NodeReader('./data'), { prefix: 'file:/' });
    vfs.addReader(new LevelDBReader('./mydb'), { prefix: 'db:/' });
} else {
    const dirHandle = await window.showDirectoryPicker();
    vfs.addReader(new WebReader(dirHandle), { prefix: 'file:/' });
    vfs.addReader(new IDBReader('storage'), { prefix: "db:/" });
}

// Add WebAPIReader with prefix "https://"
vfs.addReader(new URLReader("https://api.example.com/"), { prefix: "https://" });

// Add GitReader with prefix "git:"
vfs.addReader(new GitReader(gitRepo), { prefix: "git:" });

vfs.addReader(new ZipReader(buffer), { prefix: 'zip:/' });


const files = await vfs.list('zip:/assets/');
// console.log(files);

await vfs.set("db:/myfile.txt", "Hello IndexedDB!");
const content = await vfs.get("db://myfile.txt");
// console.log(content);

// const files = await vfs.list("idb:/");
// console.log(files);


// Usage
// (async () => {
//     const text = await vfs.get("file:/config.json");
//     console.log(text);

//     const apiData = await vfs.get("https://api.example.com/data.json");
//     console.log(apiData);

//     await vfs.set("file:/output.txt", "Hello from VFS!");

//     const files = await vfs.list("file:/");
//     console.log(files);
// })();
