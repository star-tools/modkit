


export default class SC2ModReader extends VFS {
    configs: { [name: string]: ReaderConfig };

    /**
     * @param options.base - Base path for file readers (default: `process.cwd()` or `window.location`)
     * @param options.readers - Custom readers per prefix/extension (optional)
     * @param options.directories - Directory mappings for custom prefixes (e.g., `{ mods: './mods/' }`. uses default reader, usually Node FS or URL for Browser)
     */
    constructor(options: {
        base?: string;
        readers?: Array<{
            default?: boolean;
            prefix?: string;
            reader: string | ReaderConfig;
            base?: string;
            name?: string;
        }>;
        directories?: Record<string, string>;
    });

     /**
     * Writes structured mod data back to disk or storage.
     * 
     * @param modName - Mod name or target location.
     * @param modData - Data to write (typically returned from `readModData` or `SC2Mod`).
     * @param options - Optional writer options.
     */
    write(
        modName: string,
        modData: SC2Mod,
        options?: ReadOptions
    ): Promise<void>;

   
    /**
     * Reads and parses the raw data of a `.SC2Mod` package into structured objects.
     * Supports fine-grained `scope` control to load specific parts only.
     * 
     * @param modName - Name of the mod to read.
     * @param options - Optional scope to filter what to load.
     * @returns Parsed mod data object (plain JS object, not SC2Mod class).
     */
    read(
        modName: string,
        options?: ReadOptions
    ): Promise<SC2Mod>;

    /**
     * Merges multiple mods together into one `SC2Mod` instance.
     * 
     * @param mods - Array of mod names to merge.
     * @param options - Optional scope filters.
     * @returns `SC2Mod` with merged data.
     */
    merge(
        mods: string[],
        options?: ReadOptions
    ): Promise<SC2Mod>;
}

/**
 * ReaderConfig describes a storage backend (Node, Web, Zip, etc.).
 */
interface ReaderConfig {
    name: string;
    path: string;
    options: Record<string, any>;
}

interface ReadOptions {
    scope?: Partial<{
        catalogs: boolean;
        strings: boolean | string[];
        locales: string[];
        components: boolean;
        binary: boolean;
        assets: boolean;
        info: boolean;
        styles: boolean;
        triggers: boolean;
        banklist: boolean;
        regions: boolean;
        objects: boolean;
        preload: boolean;
        terrain: boolean;
        texturereduction: boolean;
        layouts: boolean;
        scripts: boolean;
        editorcategories: boolean;
        cutscenes: boolean;
        media: boolean;
    }>;
}