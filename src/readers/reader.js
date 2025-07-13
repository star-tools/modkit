
// IndexedDB-backed storage class
export default class Reader {
    constructor(options) {
        this.options = options || {}
    }

    async init() {
    }
    
    async list( prefix = '') {
    }

    async set(key, value) {
    }

    async get(key) {
    }

    
    async delete(key) {
    }

    async clear() {
    }
    async transfer( writer){
        const files = await this.list();
        for (const file of files) {
            if(file.endsWith("/"))continue;
            const content = await this.get(file);
            await writer.set(file,content);
        }
    }


    IGNORED_PATTERNS = [
        /^__macosx\//i,
        /\.ds_store$/i,
        /^\.git(?:\/|$)/i,
        /^\.gitignore$/i,
        /^thumbs\.db$/i,
        /\/$/, // directory placeholder ending with slash
        // Add more as needed:
        // /\.tmp$/i,
    ];

    ignored(filename) {
        const lower = filename.toLowerCase();
        return this.IGNORED_PATTERNS.some(pattern => pattern.test(lower));
    }
    
}

