import Reader from "./reader.js";

export default class VFS extends Reader {
    constructor(options) {
        super(options)
        this._readers = [];
        this.readers = {}
    }

    reader(name){
        return this._readers.find(r => r.name === name)
    }
 
    addReaders(...readerConfigs){
        for(let readerConfig of readerConfigs){
            this.addReader(readerConfig)
        }
    }

    /**
     * Add a reader to this VFS instance.
     * @param {Object} reader - Reader instance with get, set, list methods.
     * @param {Object} options
     * @param {string} [options.prefix] - Optional path prefix.
     * @param {Function} [options.canHandle] - Optional fn(path) => boolean for custom routing.
     */
    addReader(readerConfig) {
        let _config = readerConfig.defult ? this._readers.find(r => r.default) : this._readers.find(r => r.prefix === readerConfig.prefix);
        if(_config){
            this.removeReader(_config)
        }
        this._readers.push(readerConfig);
        this.readers[readerConfig.name] = readerConfig
    }


    /**
     * Remove a reader from this VFS instance.
     * @param {Object} reader - Reader instance to remove.
     */
    removeReader(reader) {
        this._readers = this._readers.filter(r => r !== reader);
        delete this.readers[readerConfig.name] 
    }

    /**
     * Find the appropriate reader for a given path.
     * Checks instance readers first
     * @param {string} path
     * @returns {Object|null}
     */
    _getReaderConfig(path, method) {
        let result
        for (const readerConfig of this._readers) {
            if (typeof readerConfig.canHandle === "function" && readerConfig.canHandle(path)) {
                result = readerConfig;
            }
            if (readerConfig.prefix){
                if(readerConfig.prefix.constructor === RegExp){
                    if(readerConfig.prefix.test(path)){
                        result = readerConfig;
                        break;
                    }
                }
                else if(path.startsWith(readerConfig.prefix)) {
                    result = readerConfig;
                    break;
                }
            }
        }
        if(!result){
            result = this._readers.find(r => r.default);
        }

        if (!result) {
            throw new Error(`VFS: No reader found for path '${path}'`);
        }
        if (method && result.reader.constructor === Object) {
            throw new Error(`VFS: Reader for path '${path}' is not initialized`);
        }
        if (method && !result.reader[method]) {
            throw new Error(`VFS: Reader for path '${path}' does not support ${method}()`);
        }
        return result
    }

    /**
     * Normalize path by removing the prefix for the matched reader.
     * @param {string} path
     * @param {Object} reader
     * @returns {string}
     */
    _normalizePath(path, reader) {
        if (reader.prefix && path.startsWith(reader.prefix)) {
            return path.slice(reader.prefix.length);
        }
        return path;
    }


    _getReader(path) {
        return this._getReaderConfig(path).reader
    }

    async init(path) {
        const config = this._getReaderConfig(path);
        if(config.reader.constructor === Object){
            let extraOptions ={...config.reader.options,...config}
            delete extraOptions.reader
            delete extraOptions.prefix
            delete extraOptions.default
            if(Reader.readers[config.reader]){
                config.reader = new Reader.readers[config.reader](extraOptions)
            }
            else{
                //lazy load module dinamically
                const { default: ReaderClass } = await import(config.reader.path);
                config.reader = new ReaderClass(extraOptions);
            }
        }
        await config.reader.init(this._normalizePath(path, config));
        return config.reader
    }


    async list(path = "",options) {
        const config = this._getReaderConfig(path,'list');
        return config.reader.list(this._normalizePath(path, config), options);
    }

    async get(path, options) {
        const config = this._getReaderConfig(path);
        return config.reader.get(this._normalizePath(path, config), options);
    }

    async set(path, content, options) {
        const config = this._getReaderConfig(path);
        return config.reader.set(this._normalizePath(path, config), content, options);
    }
}
