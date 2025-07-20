import { isNode } from "../util/js-util.js";
import Reader from "./reader.js";

export default class VFS extends Reader {
    constructor(options = {}) {
        super(options)
        this._readers = [];
        this._extractors = []
        this.readers = {}
        this.extractors = {}


        if(options.base){
            this.basePath = options.base
        }
        else{
            this.basePath = this._get_base_path()
        }
        this.defaultProtocol = options.defaultProtocol || isNode ? "file" : "http"
    }
    reader(name){
        return this._readers.find(r => r.name === name)
    }
    addReaders(...readerConfigs){
        for(let readerConfig of readerConfigs){
            this.addReader(readerConfig)
        }
    }
    extractor(name){
        return this._extractors.find(r => r.name === name)
    }
    addExtractors(...readerConfigs){
        for(let readerConfig of readerConfigs){
            this.addExtractor(readerConfig)
        }
    }
    /**
     * Add a reader to this VFS instance.
     * @param {Object} reader - Reader instance with get, set, list methods.
     * @param {Object} options
     * @param {string} [options.prefix] - Optional path prefix.
     * @param {Function} [options.canHandle] - Optional fn(path) => boolean for custom routing.
     */
    addExtractor(readerConfig) {
        if(!readerConfig.name)readerConfig.name = readerConfig.prefix || readerConfig.extension || "default"
        let _config = readerConfig.default ? this._extractors.find(r => r.default) : this._extractors.find(r => r.extension === readerConfig.extension);
        if(_config){
            this.removeExtractor(_config)
        }
        this._extractors.push(readerConfig);
        this.readers[readerConfig.name] = readerConfig
    }

    /**
     * Remove a reader from this VFS instance.
     * @param {Object} reader - Reader instance to remove.
     */
    removeExtractor(readerConfig) {
        this._extractors = this._extractors.filter(r => r !== readerConfig);
        delete this.readers[readerConfig.name] 
    }

    /**
     * Add a reader to this VFS instance.
     * @param {Object} reader - Reader instance with get, set, list methods.
     * @param {Object} options
     * @param {string} [options.prefix] - Optional path prefix.
     * @param {Function} [options.canHandle] - Optional fn(path) => boolean for custom routing.
     */
    addReader(readerConfig) {
        if(!readerConfig.name)readerConfig.name = readerConfig.prefix || readerConfig.extension || "default"
        let _config = readerConfig.default ? this._readers.find(r => r.default) : this._readers.find(r => r.prefix === readerConfig.prefix);
        if(_config){
            this.removeReader(_config)
        }
        this._readers.push(readerConfig);
        this.readers[readerConfig.name] = readerConfig
        if(readerConfig.default){
            this.readers.default = readerConfig
        }
    }


    /**
     * Remove a reader from this VFS instance.
     * @param {Object} reader - Reader instance to remove.
     */
    removeReader(readerConfig) {
        this._readers = this._readers.filter(r => r !== readerConfig);
        delete this.readers[readerConfig.name] 
    }
    _has_protocol(path) {
        return /^[a-z0-9]{1,10}:/i.test(path);
    }

    /**
     * Find the appropriate reader for a given path.
     * Checks instance readers first
     * @param {string} path
     * @param {string} method search for reader with specified method
     * @returns {Object|null}
     */
    _getReaderConfig(path, method) {
        let results = []
        for (const readerConfig of this._readers) {
            if(readerConfig.prefix.includes(":")){
                if(path.startsWith(readerConfig.prefix)){
                    results.push(readerConfig)
                }
            }
            else if(readerConfig.prefix.split("|").includes(path.split(":")[0])){
                results.push(readerConfig)
            }
        }

        if (!results.length) {
            throw new Error(`VFS: No reader found for path '${path}'`);
        }

        let result
        if (method){
            result = results.find(r => r.reader[method] )
            if(!result){
                if(results.find(result.reader.constructor === Object )){
                    throw new Error(`VFS: Reader for path '${path}' is not initialized`);
                }
                else {
                    throw new Error(`VFS: Reader for path '${path}' does not support ${method}()`);
                }
            }
        }
        else{
            result = results[0]
        }
        return result
    }



    /**
     * Find the appropriate reader for a given path.
     * Checks instance readers first
     * @param {string} path
     * @returns {Object|null}
     */
    _getExtractorConfig(path, method) {
        let result
        let ext = path.split(":")[0].split(".").pop().toLowerCase()
        for (const extractorConfig of this._extractors) {


            if(extractorConfig.extension.toLowerCase().split("|").includes(ext)){
                result = extractorConfig;
                break;
            }
        }
        if(!result){
            result = this._extractors.find(r => r.default);
        }

        if (!result) {
            throw new Error(`VFS: No extractor found for path '${path}'`);
        }
        if (method && result.extractor.constructor === Object) {
            throw new Error(`VFS: extractor for path '${path}' is not initialized`);
        }
        if (method && !result.extractor[method]) {
            throw new Error(`VFS: extractor for path '${path}' does not support ${method}()`);
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
            path = path.slice(reader.prefix.length + 1);
        }
        return path;
    }

    _getExtractor(path) {
        return this._getExtractorConfig(path).extractor
    }

    _getReader(path) {
        return this._getReaderConfig(path).reader
    }

    _get_file_extension(filename) {
        const parts = filename.split('.');
        return parts.length > 1 ? parts.pop().toLowerCase() : '';
    }

    //lazy load module dinamically
    async _lazy_load_reader(config){
        if(config.class?.constructor === Object){
            if(Reader.readers[config.class.name]){
                config.class = Reader.readers[config.class.name]
            }
            else{
                const { default: readerClass } = await import(config.class.path);
                Reader.readers[config.class.name] = config.class = readerClass
            }
        }
    }

    async init(path) {
        if(!this._has_protocol(path)){
            path = this.defaultProtocol + ":" + path
        }
        const config = this._getReaderConfig(path);
        let pathNormalized = this._normalizePath(path, config)
        let readerPath =pathNormalized.split(":")[0]
        let pathTail = pathNormalized.split(":")[1]
        if(!config.reader){
            const { class: _c , prefix: _p, default: _d, ...options } = config;
            await this._lazy_load_reader(config)
            config.reader = new config.class(options)
            delete config.class
        }
        let reader = config.reader;
        await reader.init(readerPath);

        let extension = this._get_file_extension(reader.modpath);
        if(extension && reader.type === "file"){
            let file = await reader.get('',{binary: true});

            const eConfig = {...this._getExtractorConfig(reader.modpath)}
            let name = config.prefix + ":" + readerPath
            if(!eConfig.reader){
                await this._lazy_load_reader(eConfig)
                eConfig.reader = new eConfig.class({file,name})
            }
            
            let extractor = eConfig.reader
            // await extractor.init(pathreaderTail);
            this._readers.unshift({prefix: name , reader: extractor , name})

            return this.init(path)
        }

        return reader
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


    //read all files from from reader and write it using writer, to copy mods
    // async transfer( writer){
    //     const files = await this.list();
    //     for (const file of files) {
    //         if(file.endsWith("/"))continue;
    //         const content = await this.get(file);
    //         await writer.set(file,content);
    //     }
    // }
}
