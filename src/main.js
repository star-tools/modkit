
// if (require.main === module) {
//     (function () {
//         const yargs = require('yargs')
//                         .usage('usage: scmodreader.js [-h] [-I] [-H] [-b] [-s] [-t] [-x] file\n\nscmodreader.js reads and extracts MPQ archives')
//                         .demand(1)
//                         .alias('h', 'help').boolean('h').describe('h', 'show this help message and exit')
//                         .alias('I', 'headers').boolean('I').describe('I', 'print header information from the archive')
//                         .alias('H', 'hash-table').boolean('H').describe('H', 'print hash table')
//                         .alias('b', 'block-table').boolean('b').describe('b', 'print block table')
//                         .alias('s', 'skip-listfile').boolean('s').describe('s', 'skip reading(listfile)')
//                         .alias('t', 'list-file').boolean('t').describe('t', 'list files inside the archive')
//                         .alias('x', 'extract').boolean('x').describe('x', 'extract files from the archive');

//         const args = yargs.argv, filename = process.cwd() + path.sep + args._[0];
        
//         var archive = null;
        
//         if (!args.skipListfile) archive = new MPQArchive(filename);
//         else archive = new MPQArchive(filename, false);
        
//     if (args.help) {
//       yargs.showHelp();
//       process.exit();
//     }
//         if (args.headers) archive.printHeaders();
//         if (args.hashTable) archive.printHashTable();
//         if (args.blockTable) archive.printBlockTable();
//         if (args.listFile) archive.printFiles();
//         if (args.extract) archive.extractToDisk();
    
//     })();
// }



