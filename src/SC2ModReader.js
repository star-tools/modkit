//improt parsers
import SC2TextureMap from './parsers/sc2texturemap.js';
import SC2XML from './parsers/sc2xml.js';
import SC2ENV from './parsers/sc2env.js';
import SC2Script from './parsers/sc2script.js';
import SC2INI from './parsers/sc2ini.js';
//improt readers
import VFS from './readers/vfs.js';
//other imports
import SC2Mod from './SC2Mod.js';
import { SMod } from './schema/SC2Mod.js';
import { isNode } from './util/js-util.js';
import { SCatalog } from './schema/SC2Catalog.js';
import { C_NAMESPACES, GAME_NAMESPACES } from './types/shared.js';
import { getSchema } from './util/schema.js';
import { SCTypes } from './types/types.js';
import { objectsDeepMerge } from './util/obj-util.js';


/**
 * SC2ModReader
 * 
 * An advanced StarCraft II Mod Reader and Writer system, extending `VFS` for flexible file I/O.
 * 
 * **Features:**
 * - Supports multiple backends (Node.js FS, Web Fetch, LevelDB, IndexedDB, Git, Zip, URL, etc.)
 * - Automatically parses StarCraft II mod formats: XML, INI, ENV, SC2Script, binary files, textures, media.
 * - Unified interface to read, write, and merge `.SC2Mod` data.
 * - Customizable readers per environment or prefix (e.g., "file:", "zip:", "git:").
 * 
 * **Usage Example:**
 * ```js
 * import SC2ModReader from './SC2ModReader.js';
 * 
 * const reader = new SC2ModReader({base: '/Applications/Star Craft II/Mods'})
 * 
 * const reader = new SC2ModReader({
 *   base: './mods/',
 *   readers: [{ default: true, class: "Node" }],
 *   directories: { mods: './mods/', custom: './custom/' }
 * });
 * 
 * // Get SC2Mod instance
 * const mod = await reader.read('MyModName');
 * 
 * 
 * // Write mod data back
 * await reader.write('MyModName', mod);
 * 
 * // Merge multiple mods into one SC2Mod instance
 * const mergedMod = await reader.merge(['CoreMod', 'GameplayMod']);
 * ```
 */
export default class SC2ModReader extends VFS {
    configs = {
        Node:  { name: "Node", path: "./nfs.js"},
        Web: {name: "Web",path: "./wfs.js" },
        LevelDB: {name: "LevelDB", path: "./ldb.js"},
        IndexedDB: { name: "IndexedDB", path: "./idb.js"},
        Git: { name: "Git", path: "./git.js" },
        URL: { name: "URL", path: "./url.js" },
        
        MPQ: { name: "MPQ", path: "./../extractors/mpq.js"  },
        ZIP: { name: "ZIP", path: "./../extractors/zip.js"  },
        JSON:{ name:"JSON", path: "./../extractors/json.js" },
    }
    constructor(options = {}){
        if(options.constructor === String){
            options = {base: options}
        }
        super(options)

        let cs = this.configs;
        if(options.readers){
            for(let readerConfig of options.readers){
                if(readerConfig.reader.contructor === String)readerConfig.reader = cs[readerConfig.reader]
            }
            this.addReaders(options.readers)
        }
        else{
            let extension = "sc2mod|sc2map|sc2replay"
            isNode && this.addReaders(
                {prefix: "file", class: cs.Node, name: "file" , extension, base: this.basePath},
                {prefix: "http|https", class:cs.URL, name: "url"},
                {prefix: "db|ldb", class: cs.LevelDB, name: "db", dbPath: "./sc2mods.db"}
            )
            !isNode && this.addReaders(
                {prefix: "file",class: cs.Web, name: "file"  , extension },
                {prefix: "http|https",  class: cs.URL, name: "url" , base: this.basePath},
                {prefix: "db|idb",class: cs.IndexedDB, name: "db", dbName: "starcraft2" , storeName: "mods"}
            )
            this.addReaders(
                {prefix: "git", class: cs.Git, name: "git"}
            );

            this.addExtractors(
                {extension: "json", class:cs.JSON, name: "json"},
                {extension: "zip", class:cs.ZIP, name: "zip"},
                {extension, class:cs.MPQ, name: "mpq"}
            )
        }

        if(options.directories){
            let readers = []
            for(let prefix in options.directories){
                let base = options.directories[prefix]
                if(base.startsWith("./"))base = base.replace("./",this.basePath)
                else if(base.startsWith(".")) base = base.replace(".",this.basePath)
                readers.push({prefix: prefix, class: this.readers[this.defaultProtocol].class , base })
            }
            this.addReaders(...readers)
        }
        
    }

    _get_base_path() {
        if (typeof process !== 'undefined' && process.cwd) {
            // Node.js environment
            return process.cwd();
        }

        if (typeof window !== 'undefined' && window.location) {
            // Browser environment
            const { origin, pathname } = window.location;

            // Remove filename if present (e.g., "index.html")
            const basePath = pathname.endsWith('/') ? pathname : pathname.substring(0, pathname.lastIndexOf('/') + 1);

            return origin + basePath;
        }

        // Fallback for other JS runtimes
        throw new Error('Unknown environment: Cannot determine base path');
    }
    /**
     * Maps a list of files into an object or array using a handler function.
     *
     * @param {Array<string>} files - List of file names.
     * @param {Function} handler - Function to load and parse each file.
     * @param {boolean} [asArray=false] - If true, returns array with namespace field.
     * @returns {Promise<Object|Array>}
     */
    async mapToObject(files, handler, asArray = false) {
        const entries = await Promise.all(
            files.map(async (file) => [file, await handler(file)])
        );

        if (asArray) {
            return entries.map(([namespace, catalog]) => ({
            ...catalog,
            namespace: namespace.replace('base.sc2data/', '').replace(".xml", '')
            }));
        }

        return Object.fromEntries(entries);
    }

    // Unified file parser helper
    async _parse_file( reader , file, parser,schema) {
        const raw = await reader.get(file);
        if (!raw) return null;
         return parser.parse(raw, schema, this.log);
    }

    /**
     * Reads and parses mod data using different parsers for different file types.
     * 
     * Supports multiple scopes (catalogs, strings, assets, layouts, triggers, scripts, media, etc.).
     * Automatically selects parsers based on file type and file name.
     * 
     * @param {string} modName - Name of the mod to load.
     * @param {Object} options - Options with scope filters.
     * @returns {Object} Parsed mod data.
     */
    async _readModData( modName, options = {}) {
        this.log = {}
        const defaultScope = {
            catalogs: true,
            strings: true,
            locales: true,
            components: true,
            binary: true,
            assets: true,
            info: true,
            styles: true,
            triggers: true,
            banklist: true,
            regions: true,
            objects: true,
            preload: true,
            terrain: true,
            texturereduction: true,
            layouts: true,
            scripts: true,
            editorcategories: true,
            cutscenes: true,
            media: true,
            includes: true
        };


        const scope = options.scope || defaultScope;
        let reader = await this.init(modName);
        if(reader.type === null){
            //no file
            return null
        }
        //for json reader
        if(reader.data){
            return reader.data
        }

        let files = (await reader.list()).map(f => f.toLowerCase());
        if(scope.catalogs && scope.includes !== false) scope.includes = true

        // Parsers per type
        const Parsers = {
            cat: async (file,schema) => files.includes(file.toLowerCase()) && this._parse_file(reader, file, SC2XML,schema, true),
            xml: async (file,schema) => files.includes(file.toLowerCase()) && this._parse_file(reader, file, SC2XML,schema),
            env: async (file,schema)  => files.includes(file.toLowerCase()) && this._parse_file(reader, file, SC2ENV),
            ini: async (file,schema)  => files.includes(file.toLowerCase()) && this._parse_file(reader, file, SC2INI),
            scTextureMap: async (file,schema)  => files.includes(file.toLowerCase()) && this._parse_file( reader, file, SC2TextureMap),
            sc2script: async (file,schema)  => files.includes(file.toLowerCase()) && this._parse_file( reader, file, SC2Script),
            bin: async (file,schema)  => {
                return files.includes(file.toLowerCase()) ? ["//",reader.name,reader.modpath,file].join(":") : null
            }
        };

        // Map of file tasks
        const dataFiles = {
            components: { parser: 'xml', files: "ComponentList.SC2Components", scope: 'components' },
            assets: { parser: 'env', files: "Base.SC2Data/GameData/Assets.txt", scope: 'assets' },
            info: { parser: 'xml', files: "DocumentInfo", scope: 'info' },
            styles: { parser: 'xml', files: "Base.SC2Data/UI/FontStyles.SC2Style", scope: 'styles' },
            triggers: { parser: 'xml', files: "Triggers", scope: 'triggers' },
            banklist: { parser: 'xml', files: "BankList.xml", scope: 'banklist' },
            regions: { parser: 'xml', files: "Regions", scope: 'regions' },
            objects: { parser: 'xml', files: "Objects", scope: 'objects' },
            preload: { parser: 'xml', files: ["Preload.xml", "Base.SC2Data/Preload.xml"], scope: 'preload' },
            terrain: { parser: 'xml', files: "t3Terrain.xml", scope: 'terrain' },
            includes: { parser: 'xml', files: "Base.SC2Data/GameData.xml", scope: 'includes' },
            texturereduction: { parser: 'scTextureMap', files: "Base.SC2Data/texturereduction/texturereductionvalues.txt", scope: 'texturereduction' },
            preloadassetdb: { parser: 'ini', files: "Base.SC2Data/preloadassetdb.txt", scope: 'preload' },
            standardinfo: { parser: 'xml', files: "Base.SC2Data/standardinfo.xml", scope: 'info' },
            descindex: { parser: 'xml', files: "Base.SC2Data/UI/Layout/DescIndex.SC2Layout", scope: 'layouts' },
            librarylist: { parser: 'xml', files: "Base.SC2Data/triggerlibs/librarylist.xml", scope: 'triggers' },
            cutscenes: { parser: 'xml', files: "Base.SC2Data/cutscenes/index", scope: 'cutscenes' },
            editorcategories: { parser: 'xml', files: "Base.SC2Data/EditorData/EditorCategories.xml", scope: 'editorcategories' },
            // sc2locale: { parser: 'xml', files: "base.sc2data/index.sc2locale", scope: 'sc2locale' },
            // excludefromplay :  { parser: 'ini', files: "base.sc2data/ui/excludefromplay.txt"}
            // assets/data/mods/core.sc2mod/base.sc2data/animpriorities.txt
            // assets/data/mods/core.sc2mod/base.sc2data/buildid.txt
            // assets/data/mods/core.sc2mod/base.sc2data/components.txt
            // assets/data/mods/core.sc2mod/base.sc2data/databuildid.txt 
            // assets/data/mods/core.sc2mod/base.sc2data/gamedata.xml 
            // assets/data/mods/core.sc2mod/base.sc2data/gpuqualitylevels.txt
            // assets/data/mods/core.sc2mod/base.sc2data/productlocale.txt
            // assets/data/mods/core.sc2mod/base.sc2data/sc2_regions.xml
            // assets/data/mods/core.sc2mod/base.sc2data/gamedata/assetsproduct.txt
            // base.sc2data/gamedata/stableid.json 
            // base.sc2data/gamedata/guids/achievement.txt
            // base.sc2data/gamedata/guids/achievementterm.txt

            // CellAttribute_Cda   //binary
            // CellAttribute_Pnp   //binary
            // CustomAI   //xml
            // CustomAI.version
            // MapInfo
            // MapScript.galaxy
            // Minimap.tga
            // Objects.version
            // Regions.version 
            // t3CellFlags 
            // t3FluffDoodad 
            // t3HardTile 
            // t3HeightMap 
            // t3SyncCliffLevel 
            // t3SyncHeightMap 
            // t3SyncTextureInfo 
            // t3Terrain.version 
            // t3Terrain.xml 
            // t3TextureMasks 
            // t3VertCol 
            // t3Water




            // localizeddata/editor/editorlayout.xml 
                    
            // localizeddata/editor/spellchecker/blizzard-words.txt
            // localizeddata/editor/editorcatalogstrings.txt 
            // localizeddata/editor/editorcatalogstringssc2.txt 
            // localizeddata/editor/editorcategorystrings.txt 
            // localizeddata/editor/editorstrings.txt 
            // localizeddata/editor/editorstringssc2.txt 
            // localizeddata/abilhints.txt 
            // localizeddata/accumulatorhints.txt 
            // localizeddata/achievementhints.txt 
            // localizeddata/achievementtermhints.txt 
            // localizeddata/actorhints.txt 
            // localizeddata/actorsupporthints.txt 
            // localizeddata/alerthints.txt 
            // localizeddata/armycategoryhints.txt 
            // localizeddata/armyunithints.txt 
            // localizeddata/armyupgradehints.txt 
            // localizeddata/artifacthints.txt 
            // localizeddata/artifactslothints.txt 
            // localizeddata/attachmethodhints.txt 
            // localizeddata/bankconditionhints.txt 
            // localizeddata/beamhints.txt 
            // localizeddata/behaviorhints.txt 
            // localizeddata/boosthints.txt 
            // localizeddata/bundlehints.txt 
            // localizeddata/buttonhints.txt 
            // localizeddata/camerahints.txt 
            // localizeddata/campaignhints.txt 
            // localizeddata/characterhints.txt 
            // localizeddata/cliffhints.txt 
            // localizeddata/cliffmeshhints.txt 
            // localizeddata/colorstylehints.txt 
            // localizeddata/commanderhints.txt 
            // localizeddata/confighints.txt 
            // localizeddata/consoleskinhints.txt 
            // localizeddata/conversationhints.txt 
            // localizeddata/conversationstatehints.txt 
            // localizeddata/conversationstrings.txt 
            // localizeddata/cursorhints.txt 
            // localizeddata/datacollectionhints.txt 
            // localizeddata/datacollectionpatternhints.txt 
            // localizeddata/decalpackhints.txt 
            // localizeddata/dsphints.txt 
            // localizeddata/effecthints.txt 
            // localizeddata/emoticonhints.txt 
            // localizeddata/emoticonpackhints.txt 
            // localizeddata/errorhints.txt 
            // localizeddata/errors.txt 
            // localizeddata/fontstyles.sc2style 
            // localizeddata/footprinthints.txt 
            // localizeddata/fowhints.txt 
            // localizeddata/gamehints.txt 
            // localizeddata/gamehotkeys.txt 
            // localizeddata/gamehotkeysproduct.txt 
            // localizeddata/gamestrings.txt 
            // localizeddata/gamestringsproduct.txt 
            // localizeddata/gameuihints.txt 
            // localizeddata/herdhints.txt 
            // localizeddata/herdnodehints.txt 
            // localizeddata/heroabilhints.txt 
            // localizeddata/herohints.txt 
            // localizeddata/herostathints.txt 
            // localizeddata/itemclasshints.txt 
            // localizeddata/itemcontainerhints.txt 
            // localizeddata/itemhints.txt 
            // localizeddata/kinetichints.txt 
            // localizeddata/lensflaresethints.txt 
            // localizeddata/lighthints.txt 
            // localizeddata/locationhints.txt 
            // localizeddata/loothints.txt 
            // localizeddata/maphints.txt 
            // localizeddata/modelhints.txt 
            // localizeddata/mounthints.txt 
            // localizeddata/moverhints.txt 
            // localizeddata/objectivehints.txt 
            // localizeddata/objectstrings.txt 
            // localizeddata/objectstringsproduct.txt 
            // localizeddata/physicsmaterialhints.txt 
            // localizeddata/pinghints.txt 
            // localizeddata/playerresponsehints.txt 
            // localizeddata/portraitpackhints.txt 
            // localizeddata/preloadhints.txt 
            // localizeddata/premiummaphints.txt 
            // localizeddata/racebannerpackhints.txt 
            // localizeddata/racehints.txt 
            // localizeddata/requirementhints.txt 
            // localizeddata/requirementnodehints.txt 
            // localizeddata/reverbhints.txt 
            // localizeddata/rewardhints.txt 
            // localizeddata/scoreresulthints.txt 
            // localizeddata/scorevaluehints.txt 
            // localizeddata/shapehints.txt 
            // localizeddata/skinhints.txt 
            // localizeddata/skinpackhints.txt 
            // localizeddata/soundexclusivityhints.txt 
            // localizeddata/soundhints.txt 
            // localizeddata/soundmixsnapshothints.txt 
            // localizeddata/soundtrackhints.txt 
            // localizeddata/sprayhints.txt 
            // localizeddata/spraypackhints.txt 
            // localizeddata/stimpackhints.txt 
            // localizeddata/taccooldownhints.txt 
            // localizeddata/tacticalhints.txt 
            // localizeddata/talenthints.txt 
            // localizeddata/talentprofilehints.txt 
            // localizeddata/targetfindhints.txt 
            // localizeddata/targetsorthints.txt 
            // localizeddata/terrainhints.txt 
            // localizeddata/terrainobjecthints.txt 
            // localizeddata/terraintexhints.txt 
            // localizeddata/texturehints.txt 
            // localizeddata/texturesheethints.txt 
            // localizeddata/tilehints.txt 
            // localizeddata/triggerstrings.txt 
            // localizeddata/trophyhints.txt 
            // localizeddata/turrethints.txt 
            // localizeddata/unithints.txt 
            // localizeddata/upgradehints.txt 
            // localizeddata/userhints.txt 
            // localizeddata/validatorhints.txt 
            // localizeddata/voiceoverhints.txt 
            // localizeddata/voicepackhints.txt 
            // localizeddata/warchesthints.txt 
            // localizeddata/warchestseasonhints.txt 
            // localizeddata/waterhints.txt 
            // localizeddata/weaponhints.txt
        };

        // Load base data
        const loadedData = {};
        for (const [key, { parser, files: fileList, scope: section }] of Object.entries(dataFiles)) {
            if (!scope[section]) continue;

            const parserFunc = Parsers[parser];
            const filenames = Array.isArray(fileList) ? fileList : [fileList];
            let result = null;

            for (const file of filenames) {
                result = await parserFunc(file,SMod[key]);
                if (result) break;
            }

            if (result) loadedData[key] = result;
        }

        // Parse catalogs
        if (scope.catalogs) {
            const baseCatalogs = GAME_NAMESPACES.map(f => "gamedata/" + f.toLowerCase() + "data.xml");
            const includes = loadedData.includes?.Catalog?.map(c => c.path.toLowerCase()) || [];
            const allCatalogs = [...baseCatalogs, ...includes].map(f => "base.sc2data/" + f).filter(f => files.includes(f))
            

            //option 1 - use schema with xml
            //eay way, but do not support tokens schema
            let loadedCatalogs = await this.mapToObject (allCatalogs ,file => Parsers.xml(file,SCatalog));
            
            loadedData.catalogs = allCatalogs.map(catalogPath => ({
                data: loadedCatalogs[catalogPath].data,
                mod: modName,
                namespace: GAME_NAMESPACES.find(ns => ns.toLowerCase() === catalogPath.split("/").pop().toLowerCase().replace("data.xml","")) || "Includes",
                path: catalogPath,
            }))
            
            loadedData.catalogs
            //attempt to load with tokens -aware schemas
            // let loadedCatalogs = await this.mapToObject (allCatalogs.filter(f => files.includes(f)) ,file => Parsers.xml(file));
            // let resultCatalogs = []
            // for(let catalogPath in loadedCatalogs){
            //     let catalog = loadedCatalogs[catalogPath]


            //     let catalognamespace = GAME_NAMESPACES.find(ns => ns.toLowerCase() === catalogPath.split("/").pop().toLowerCase().replace("data.xml","")) || "Includes"
            //     let resultCatalog = {
            //         data: [],
            //         mod: modName,
            //         namespace: catalognamespace,
            //         path: catalogPath,
            //     }
            //     if(catalog.children){
            //         //skip catalogs
            //         if(scope.catalogs.length && catalognamespace && !scope.catalogs.includes(catalog)){
            //             continue
            //         }
            //         for(let entity of catalog.children){
            //             let childSchema = getSchema(entity.tag,SCatalog)
            //             childSchema = childSchema[0] || childSchema
                        
            //             let isClass  = entity.tag[0] === "C"
            //             let tokensData = null;


            //             // if(isClass){
            //             //     let _c = entity.tag
            //             //     let ns =   C_NAMESPACES[_c] 
            //             //     if(entity.attributes?.parent)_c += "." + entity.attributes?.parent
            //             //     if(tokensCache[_c]){
            //             //         let parentSchema = tokensCache[_c]
            //             //         tokensData = parentSchema
            //             //     }
            //             //     //parent classes
            //             //     else if( "C" + ns !== _c){
            //             //         let parentSchema = tokensCache[ns]
            //             //         tokensData = parentSchema
            //             //     }
            //             //     if(entity.directives){
            //             //         let newTokenData = {...tokensData}
            //             //         for(let directive of entity.directives){
            //             //             newTokenData[directive.id] = directive.type ? SCTypes[directive.type] : String
            //             //         }
            //             //         tokensData = newTokenData
            //             //     }

            //             //     let _id =  entity.attributes?.id ? ns : entity.tag
            //             //     if(entity.attributes?.id)_id += "." + entity.attributes?.id
            //             //     tokensCache[_id] = tokensData
            //             // }

            //             SC2XML.applySchema(entity, childSchema , [], this.log, tokensData);
            //             resultCatalog.data.push(entity)
            //         }
            //     }
            //     resultCatalogs.push(resultCatalog)
            // }

        }

        // Parse localized strings
        if (scope.strings) {

            const textFileMap = {
                objectstrings: "objectstrings",
                gamestrings: "gamestrings",
                triggerstrings: "triggerstrings",
                gamehotkeys: "gamehotkeys",
                conversationstrings: "conversationstrings",
                // Hotkeys: "gamehotkeys",
                // Game: "gamestrings",
                // Objects: "objectstrings",
                // Trigger: "triggerstrings",
                // Conversation: "conversationstrings",

                spellchecker: "editor/spellchecker/blizzard-words",
                editorcatalogstrings: "editor/editorcatalogstrings",
                editorcatalogstringssc2: "editor/editorcatalogstringssc2",
                editorcategorystrings: "editor/editorcategorystrings",
                editorstrings: "editor/editorstrings",
                editorstringssc2: "editor/editorstringssc2",

                abilhints: "abilhints",
                accumulatorhints: "accumulatorhints",
                achievementhints: "achievementhints",
                achievementtermhints: "achievementtermhints",
                actorhints: "actorhints",
                actorsupporthints: "actorsupporthints",
                alerthints: "alerthints",
                armycategoryhints: "armycategoryhints",
                armyunithints: "armyunithints",
                armyupgradehints: "armyupgradehints",
                artifacthints: "artifacthints",
                artifactslothints: "artifactslothints",
                attachmethodhints: "attachmethodhints",
                bankconditionhints: "bankconditionhints",
                beamhints: "beamhints",
                behaviorhints: "behaviorhints",
                boosthints: "boosthints",
                bundlehints: "bundlehints",
                buttonhints: "buttonhints",
                camerahints: "camerahints",
                campaignhints: "campaignhints",
                characterhints: "characterhints",
                cliffhints: "cliffhints",
                cliffmeshhints: "cliffmeshhints",
                colorstylehints: "colorstylehints",
                commanderhints: "commanderhints",
                confighints: "confighints",
                consoleskinhints: "consoleskinhints",
                conversationhints: "conversationhints",
                conversationstatehints: "conversationstatehints",
                cursorhints: "cursorhints",
                datacollectionhints: "datacollectionhints",
                datacollectionpatternhints: "datacollectionpatternhints",
                decalpackhints: "decalpackhints",
                dsphints: "dsphints",
                effecthints: "effecthints",
                emoticonhints: "emoticonhints",
                emoticonpackhints: "emoticonpackhints",
                errorhints: "errorhints",
                errors: "errors",
                fontstyles: "fontstyles",
                footprinthints: "footprinthints",
                fowhints: "fowhints",
                gamehints: "gamehints",
                gamehotkeysproduct: "gamehotkeysproduct",
                gamestringsproduct: "gamestringsproduct",
                gameuihints: "gameuihints",
                herdhints: "herdhints",
                herdnodehints: "herdnodehints",
                heroabilhints: "heroabilhints",
                herohints: "herohints",
                herostathints: "herostathints",
                itemclasshints: "itemclasshints",
                itemcontainerhints: "itemcontainerhints",
                itemhints: "itemhints",
                kinetichints: "kinetichints",
                lensflaresethints: "lensflaresethints",
                lighthints: "lighthints",
                locationhints: "locationhints",
                loothints: "loothints",
                maphints: "maphints",
                modelhints: "modelhints",
                mounthints: "mounthints",
                moverhints: "moverhints",
                objectivehints: "objectivehints",
                objectstringsproduct: "objectstringsproduct",
                physicsmaterialhints: "physicsmaterialhints",
                pinghints: "pinghints",
                playerresponsehints: "playerresponsehints",
                portraitpackhints: "portraitpackhints",
                preloadhints: "preloadhints",
                premiummaphints: "premiummaphints",
                racebannerpackhints: "racebannerpackhints",
                racehints: "racehints",
                requirementhints: "requirementhints",
                requirementnodehints: "requirementnodehints",
                reverbhints: "reverbhints",
                rewardhints: "rewardhints",
                scoreresulthints: "scoreresulthints",
                scorevaluehints: "scorevaluehints",
                shapehints: "shapehints",
                skinhints: "skinhints",
                skinpackhints: "skinpackhints",
                soundexclusivityhints: "soundexclusivityhints",
                soundhints: "soundhints",
                soundmixsnapshothints: "soundmixsnapshothints",
                soundtrackhints: "soundtrackhints",
                sprayhints: "sprayhints",
                spraypackhints: "spraypackhints",
                stimpackhints: "stimpackhints",
                taccooldownhints: "taccooldownhints",
                tacticalhints: "tacticalhints",
                talenthints: "talenthints",
                talentprofilehints: "talentprofilehints",
                targetfindhints: "targetfindhints",
                targetsorthints: "targetsorthints",
                terrainhints: "terrainhints",
                terrainobjecthints: "terrainobjecthints",
                terraintexhints: "terraintexhints",
                texturehints: "texturehints",
                texturesheethints: "texturesheethints",
                tilehints: "tilehints",
                trophyhints: "trophyhints",
                turrethints: "turrethints",
                unithints: "unithints",
                upgradehints: "upgradehints",
                userhints: "userhints",
                validatorhints: "validatorhints",
                voiceoverhints: "voiceoverhints",
                voicepackhints: "voicepackhints",
                warchesthints: "warchesthints",
                warchestseasonhints: "warchestseasonhints",
                waterhints: "waterhints",
                weaponhints: "weaponhints",
            };

            const requestedTexts = scope.strings === true
                ? Object.values(textFileMap)
                : Object.entries(textFileMap)
                    .filter(([key]) => scope.strings.includes(key))
                    .map(([_, val]) => val);

            const availableLocales = loadedData.components?.DataComponent?.filter(c => c.Type.toLowerCase() === "text").map(c => c.Locale) || ['frFR', 'deDE', 'esES', 'esMX', 'ruRU', 'koKR', 'zhCN', 'zhTW', 'plPL', 'itIT', 'ptBR']

            const locales = scope.locales?.length
                ? availableLocales.filter(l => scope.locales.includes(l))
                : availableLocales;

            const regexp = new RegExp(`(${locales.join("|")}).sc2data/localizeddata/`, "i");

            const textFiles = files.filter(f =>
                regexp.test(f) &&
                f.endsWith(".txt") &&
                requestedTexts.includes(f.replace(regexp, '').replace(".txt", ''))
            );

            const stringsRaw = await this.mapToObject(textFiles, Parsers.env);

            // Merge by locale and catalog
            const result = {};

            for (const [file, data] of Object.entries(stringsRaw)) {
                const namespace = file.replace('.sc2data/localizeddata', '').replace(".txt", '');
                const [locale, catalog] = namespace.split("/");
                let localeID = availableLocales.find(l => l.toLowerCase() === locale)
                if (!result[catalog]) result[catalog] = {};

                for (const [key, value] of Object.entries(data)) {
                if (!result[catalog][key]) result[catalog][key] = {};
                result[catalog][key][localeID] = value;
                }
            }

            // Map to expected structure
            const mapped = {};
            if (result.gamehotkeys) mapped.Hotkeys = result.gamehotkeys;
            if (result.gamestrings) mapped.Game = result.gamestrings;
            if (result.objectstrings) mapped.Object = result.objectstrings;
            if (result.triggerstrings) mapped.Trigger = result.triggerstrings;
            if (result.conversationstrings) mapped.Conversation = result.conversationstrings;

            loadedData.strings = mapped
        }

        // Layouts
        if (scope.layouts) {
            const descIndexIncludes = loadedData.descindex?.Include?.map(i => i.path) || [];
            const layoutsRaw = await this.mapToObject(descIndexIncludes.map(f => "Base.SC2Data/" + f), file => Parsers.sc2script(file,SMod.layouts[0] ), true);
            loadedData.layouts = Object.fromEntries(
                Object.entries(layoutsRaw).map(([f, content]) => [
                    f.toLowerCase().replace("base.sc2data/", '').replace(".sc2layout", ''),
                    content
                ])
            );
        }

        // Triggers
        if (scope.triggers) {
            loadedData.sc2lib = await this.mapToObject(files.filter(f => /\.(sc2lib|triggerlib)$/i.test(f)), file => Parsers.xml(file,SMod.triggers ), true);
        }

        // Scripts
        if (scope.scripts) {
            loadedData.galaxy = await this.mapToObject(files.filter(f => /\.galaxy$/i.test(f)), Parsers.sc2script);
        }

        // Cutscenes
        if (scope.cutscenes) {
            loadedData.cutscenes = await this.mapToObject( files.filter(f => /\.(sc2cutscene|stormcutscene)$/i.test(f)), file => Parsers.sc2script(file,SMod.cutscenes[0] ), true);
        }
        
        // .sc2scene
        if (scope.scenes) {
            loadedData.scenes = await this.mapToObject( files.filter(f => /\.(sc2scene)$/i.test(f)), file => Parsers.xml(file,SMod.scenes[0] ), true);
        }

        // .SC2Hotkeys //only Core
        // if (scope.hotkeys) {
        //     //file example:
        //     // [Settings]
        //     // Grid=1
        //     // Suffix=_GRS
        //     loadedData.hotkeys = await this.mapToObject( files.filter(f => /\.(sc2hotkeys)$/i.test(f)), Parsers.ini,SMod.cutscenes[0]);
        // }





        // Binary
        if (scope.binary) {
            loadedData.binary = {
                version: await this.mapToObject(files.filter(f => /\.version$/i.test(f)), Parsers.bin),
                header: await this.mapToObject(files.filter(f => /^documentheader$/i.test(f)), Parsers.bin)
            };
        }

        // Media files
        if (scope.media) {
            loadedData.media = {
                model: Object.fromEntries(files.filter(f => /\.m3$/i.test(f)).map(f => [f, Parsers.bin(f)])),
                modela: Object.fromEntries(files.filter(f => /\.m3a$/i.test(f)).map(f => [f, Parsers.bin(f)])),
                modelh: Object.fromEntries(files.filter(f => /\.m3h$/i.test(f)).map(f => [f, Parsers.bin(f)])),
                audio: Object.fromEntries(files.filter(f => /\.(ogg|mp3|wav)$/i.test(f)).map(f => [f, Parsers.bin(f)])),
                image: Object.fromEntries(files.filter(f => /\.(dds|tga|jpg|png)$/i.test(f)).map(f => [f, Parsers.bin(f)])),
                video: Object.fromEntries(files.filter(f => /\.ogv$/i.test(f)).map(f => [f, Parsers.bin(f)])),
                fonts: Object.fromEntries(files.filter(f => /\.(otf|ttf)$/i.test(f)).map(f => [f, Parsers.bin(f)])),
                facial: Object.fromEntries(files.filter(f => /\.fx2$/i.test(f)).map(f => [f, Parsers.bin(f)])),
                flash: Object.fromEntries(files.filter(f => /\.fla|swf$/i.test(f)).map(f => [f, Parsers.bin(f)])),
                shaders: Object.fromEntries(files.filter(f => /\.fx$/i.test(f)).map(f => [f, Parsers.bin(f)])),
                // hash: Object.fromEntries(files.filter(f => /\.hash$/i.test(f)).map(f => [f, Parsers.bin(f)])),
            };
        }



        if(Object.keys(this.log).length){
            this.log
        }


        // Filter out nulls and empty data
        let result = Object.fromEntries(
            Object.entries(loadedData).filter(([_, v]) =>
            v != null &&
            !(Array.isArray(v) && v.length === 0) &&
            !(typeof v === "object" && Object.keys(v).length === 0)
            )
        );

        return result
    }

    async _writeModData( modName, obj , options) {

        let reader = await this.init(modName);

        function xml(content,schema){
            return SC2XML.stringify(content,schema);
        }
        function env(content){
            return SC2ENV.stringify(content)  
        }
        function ini(content){
            return SC2INI.stringify(content)
        }
        function scTextureMap(content){
            return SC2TextureMap.stringify(content)
        }
        function sc2script(content){
            return SC2Script.stringify(content)
        }
        function bin(content){
            return content
        }

        function fromDataArray(data,fn,schema,pathtemplate){
            if(!data)return null
            return Object.fromEntries(
            Object.entries(data).map(
            ([path, data]) => [pathtemplate?.replace("*",path) || path, fn(data,schema,path)]
            )
            );
        }

        function reverseLocales(strings){
            let result = {}
            for(let category in strings){
            for(let entity in strings[category]){
            for(let locale in strings[category][entity]){
            let filename = `${locale}.sc2data/localizeddata/${category}.txt`
            if(!result[filename])result[filename] = {}
            result[filename][entity] = obj.strings[category][entity][locale]
            }
            }
            }
            return result
        }

        function getOutputLayouts(layouts){
            let result = {}
            for(let layout in layouts){
            result[layout + ".sc2layout"] = layouts[layout]
            }
            return result
        }

        function getOutputCatalogs(catalogs){
            let outputCatalogs = {}
            for(let catalog of catalogs){
                outputCatalogs[catalog.path] = {...catalog}
                delete outputCatalogs[catalog.path].path
            }
            return outputCatalogs
        }

        let filesData = {
            "ComponentList.SC2Components": xml(obj.components,SMod.components),
            "Base.SC2Data/GameData/Assets.txt": env(obj.assets),
            "DocumentInfo": xml(obj.info,SMod.info),
            "Base.SC2Data/UI/FontStyles.SC2Style": xml(obj.styles,SMod.styles),
            "Triggers": xml(obj.triggers,SMod.triggers),
            "BankList.xml": xml(obj.banklist,SMod.banklist),
            "Regions": xml(obj.regions,SMod.regions),
            "Objects": xml(obj.objects,SMod.objects),
            "Preload.xml": xml(obj.preload,SMod.preload),
            "t3Terrain.xml": xml(obj.terrain,SMod.terrain),
            "Base.SC2Data/GameData.xml": xml(obj.includes,SMod.includes),
            "Base.SC2Data/texturereduction/texturereductionvalues.txt": scTextureMap(obj.texturereduction),
            "Base.SC2Data/preloadassetdb.txt": ini(obj.preloadassetdb),
            "Base.SC2Data/standardinfo.xml": xml(obj.standardinfo,SMod.standardinfo),
            "Base.SC2Data/UI/Layout/DescIndex.SC2Layout": xml(obj.descindex,SMod.descindex),
            "Base.SC2Data/triggerlibs/librarylist.xml": xml(obj.librarylist,SMod.librarylist),
            "Base.SC2Data/EditorData/EditorCategories.xml": xml(obj.editorcategories,SMod.editorcategories),
            ...fromDataArray(obj.sc2lib, xml,SMod.sc2lib[0]),
            ...fromDataArray(getOutputLayouts(obj.layouts), xml,SMod.layouts[0]),
            ...fromDataArray(getOutputCatalogs(obj.catalogs), xml,SMod.catalogs[0],`Base.SC2Data/*.xml`),
            ...fromDataArray(obj.galaxy, sc2script),
            ...fromDataArray(reverseLocales(obj.strings), env),
            ...fromDataArray(obj.cutscenes,xml,SMod.cutscenes[0])
        }

        let binary = {
            ...fromDataArray(obj.binary.header, bin),
            ...fromDataArray(obj.binary.version, bin),
            ...fromDataArray(obj.binary.model, bin),
            ...fromDataArray(obj.binary.modela, bin),
            ...fromDataArray(obj.binary.modelh, bin),
            ...fromDataArray(obj.binary.audio, bin),
            ...fromDataArray(obj.binary.image, bin),
            ...fromDataArray(obj.binary.video, bin),
        }

        for(let file in filesData){
            if(filesData[file] === undefined || filesData[file] === null){
            delete filesData[file] 
            }
        }

        for(let file in filesData){
            await reader.set(file,filesData[file])
        }

        for(let file in binary){
            await reader.set(file,filesData[file],{file: true})
        }
    }


    async write(modName, mod, options){                                                              
        await this._writeModData(modName,mod.data,options);
    }

    async read(mod, options){
        let data = await this._readModData(mod,options);
        if(!data) return null

        let modOptions = {data}
        if(options?.dependencies){
            modOptions.dependencies = options.dependencies
        }
        return new SC2Mod(modOptions)
    }

    async merge( mods, options ){
        let data = {}
        for(let mod of mods){
            let modData = await this._readModData(mod,options);
            // merged.merge(modData)

            objectsDeepMerge(data, modData);
        }

        let modOptions = {data}
        if(options?.dependencies){
            modOptions.dependencies = options.dependencies
        }
        let merged = new SC2Mod(modOptions)
        merged.buildCatalogs();
        
        return merged
    }

}
