

export default class SCComponentWriter{
    constructor (parser,options){
        this.parser = parser
        this.config = {
            debug: false,
            scopes: {
                "components": true,
                "assets": true,
                "documentinfo": true,
                "styles": true,
                "text": true,
                "triggers": true,
                "layouts": true,
                "files": true,
                "banklist": true,
                "mapdata": true,
                "data": true,
            }
        }
        if(options){
            Object.assign(this.config,options)
        }
    }
}


   function write (destpath,{text = {}, outputFn = null, formatFn = null,catalogs= 'all',resolve = false, format = 'auto', structure = 'auto', scopes = 'all', core = false} = {}){

        if(this.locales){
            // set mod name
            for(let locale in this.locales){
                this.locales[locale].GameStrings["DocInfo/Website"] = text.Website
                this.locales[locale].GameStrings["DocInfo/Name"] = text.Name
                if(text.DescLong){
                    this.locales[locale].GameStrings["DocInfo/DescLong"] = `${text.DescLong}${text.Signature || ''}`
                }
                if(text.DescShort){
                    this.locales[locale].GameStrings["DocInfo/DescShort"] = text.DescShort
                }
            }
        }
        if(this.text){
            // set mod name
            for(let locale in this.locales){
                this.text.GameStrings["DocInfo/Website"].Value[locale] = text.Website
                this.locales[locale].GameStrings["DocInfo/Name"].Value[locale]  = text.Name
                if(text.DescLong){
                    this.locales[locale].GameStrings["DocInfo/DescLong"].Value[locale]  = `${text.DescLong}${text.Signature || ''}`
                }
                if(text.DescShort){
                    this.locales[locale].GameStrings["DocInfo/DescShort"].Value[locale]  = text.DescShort
                }
            }
        }

        destpath = this.resolvePath(destpath)

        if(scopes.constructor === String){
            scopes = [scopes]
        }
        if(scopes.includes('all')){
            scopes = [
                'media',
                'assets',
                'triggers',
                'locales',
                'styles',
                'layouts',
                'data',
                'components',
                'binary',
                'documentinfo'
            ]
        }
        if(structure === 'auto'){
            structure = /.*\.[A-Za-z]+$/.test(destpath) ? 'file' : 'components'
        }
        if(format === 'auto'){
            format = /.*\.([A-Za-z]+)$/.exec(destpath)?.[1] || 'auto'
        }

        if(structure === 'file'){
            let output = {}
            for(let scope of scopes){
                output[scope] = this[scope]
            }
            if(scopes.includes('data') && !scopes.includes('catalogs') && !scopes.includes('cache')){
                output['entities'] = this['entities']
            }

            fs.writeFileSync(destpath, formatData(output, format))
            return this
        }

        if(!destpath.endsWith("/"))destpath += "/"

        let output = {}

        let extension, formatting;

        console.log(`Writing: ${destpath.replace(/.*StarCraft II/,'$')}`)

        fs.mkdirSync(destpath, {recursive: true});

        if(scopes.includes('components')){
            extension = format === 'auto' ? 'SC2Components' : format
            formatting = format === 'auto' ? 'xml' : format;
            let components = [
                {_: 'DocumentInfo', $: {Type: "info"}}
            ]
            if(this.entities) {
                components.push({_: 'GameData', $: {Type: "gada"}})
            }
            if(this.layouts) {
                components.push({_: 'UI/Layout/DescIndex.SC2Layout', $: {Type: "uiui"}})
            }
            if(this.styles) {
                components.push({_: 'UI/FontStyles.SC2Style', $: {Type: "font"}})
            }
            if(this.triggers) {
                components.push({_: 'Triggers', $: {Type: "trig"}})
            }
            if(this.locales) {
                for(let locale in this.locales){
                    components.push({_: 'GameText', $: {Type: "text", Locale: locale}})
                }
            }
            output[`ComponentList.${extension}`] = formatData({Components: {DataComponent: components}}, formatting)
        }
        if(scopes.includes('documentinfo')){
            let deps = []
            let voidCampaign = "bnet:Void (Campaign)/0.0/999,file:Campaigns/Void.SC2Campaign"
            let voidMod = "bnet:Void (Mod)/0.0/999,file:Mods/Void.SC2Mod"

            let includeCampaign = false;
            let includeVoid = false;

            // if(this.dependencies?.find(d => d.endsWith('file:Campaigns/Void.SC2Campaign'))){
            //     deps.push({_: voidCampaign})
            //     includeCampaign = true;
            // }
            // else if(this.dependencies?.find(d => d.endsWith('file:Mods/Void.SC2Mod'))){
            //     deps.push({_: voidMod})
            //     includeVoid = true;
            // }



            let info = {
                DocInfo: {
                    ModType: {
                        Value: {
                            _: 'Interface'
                        }
                    },
                }
            }
            if(this.dependencies?.length){
                Object.assign(info.DocInfo,{
                    Dependencies: {
                        Value: this.dependencies.map(dep => ({_: dep})),
                        // Value: [{_: 'bnet:Void (Mod)/0.0/999,file:Mods/Void.SC2Mod'}]
                        // Value: deps
                    }
                })
            }
            output[`DocumentInfo`] = formatData(info , 'xml')

            if(scopes.includes('binary') && format === 'auto'){
                fs.copyFileSync(path.resolve(__dirname ,config.binaryFolder+  '/DocumentInfo.version'), destpath + `DocumentInfo.version`)
            }

            if(scopes.includes('binary')){
                if(includeVoid){
                    fs.copyFileSync(path.resolve(__dirname ,config.binaryFolder+ '/DocumentHeader VOID'), destpath + `DocumentHeader`)
                }
                if(includeCampaign) {
                    fs.copyFileSync(path.resolve(__dirname ,config.binaryFolder+ '/DocumentHeader VOID CAMPAIGN'), destpath + `DocumentHeader`)
                }
            }
        }
        if(scopes.includes('preload')){
            output[`Preload.xml`] = formatData({Preload: {}} , 'xml')
            output[`PreloadAssetDB.txt`] = ''
        }
        if(scopes.includes('assets') && this.assets){
            extension = format === 'auto' ? 'txt' : format
            formatting = format === 'auto' ? 'ini' : format;
            output[`Base.SC2Data/GameData/Assets.${extension}`] = formatData(this.assets, formatting)
        }

        let locales = this.locales
        if(this.text) {
            locales = {}
            for (let locale in this.locales) {
                locales[locale] = {}
            }

            for (let type in this.text) {
                for (let locale in this.locales) {
                    locales[locale][type] = {}
                }
            }

            for (let type in this.text) {
                for (let textKey in this.text[type]) {
                    let textEntity = this.text[type][textKey]
                    for (let locale in this.locales) {
                        if (textEntity.Value[locale].hasOwnProperty(textKey)) {
                            locales[locale][type][textKey] = textEntity.Value[locale]
                        } else {
                            locales[locale][type][textKey] = textEntity.Value[baseLocale]
                        }

                    }
                }
            }
        }

        if(scopes.includes('locales') && locales){
            extension = format === 'auto' ? 'txt' : format
            formatting = format === 'auto' ? 'ini' : format;
            let baseLocale = locales['enUS'] && 'enUS'

            for (let locale in locales) {

                for (let type in locales[baseLocale || locale]) {
                    let localeData
                    if (locale !== baseLocale && locales[baseLocale]) {
                        localeData = {}
                        deep(localeData, locales[baseLocale][type])
                        deep(localeData, locales[locale][type])
                    } else {
                        localeData = locales[locale][type]
                    }

                    output[`${locale}.SC2Data/LocalizedData/${type}.${extension}`] = formatData(localeData, formatting)
                }
            }

            if(scopes.includes('binary') && format === 'auto'){
                fs.copyFileSync(path.resolve(__dirname ,config.binaryFolder+ '/GameText.version'), destpath + `GameText.version`)
            }
        }
        if(scopes.includes('styles') && this.styles){
            extension = format === 'auto' ? 'SC2Style' : format
            formatting = format === 'auto' ? 'xml' : format;
            output[`Base.SC2Data/UI/FontStyles.${extension}`] = formatData(this.styles, formatting)
            if(scopes.includes('binary') && format === 'auto'){
                fs.mkdirSync(destpath+  `Base.SC2Data/UI/`, {recursive: true});
                fs.copyFileSync(path.resolve(__dirname ,config.binaryFolder+ '/FontStyles.version'), destpath + `Base.SC2Data/UI/FontStyles.version`)
            }
        }
        if(scopes.includes('layouts') && this.layouts){
            extension = format === 'auto' ? 'SC2Layout' : format
            formatting = format === 'auto' ? 'xml' : format;
            output[`Base.SC2Data/UI/Layout/DescIndex.${extension}`] = formatData({Desc: {Include: this.layouts }}, formatting)

            for(let layout in this.layoutFilesData){
                if(layout.toLowerCase() === "base.sc2data/ui/layout/descindex.sc2layout"){
                    continue
                }
                output[layout] = this.layoutFilesData[layout]
            }
        }
        if(scopes.includes('data') && this.banklist){
            formatting = format === 'auto' ? 'xml' : 'xml';

            if(formatting === "xml") {
                let catalogXML = buildXMLObject(this.banklist)
                output[`BankList.xml`] = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n${catalogXML}\n`
            }
        }


        // entityData = JSON.parse(JSON.stringify(entityData))
        if(this.objects) {
            let objectsData = JSON.parse(JSON.stringify(this.objects))
            optimiseForXML(objectsData, SCSchema.Objects)
            output[`Objects`] = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n${buildXMLObject({PlacedObjects: objectsData})}\n`
        }
        if(this.preload) {
            let preloadData = JSON.parse(JSON.stringify(this.preload))
            optimiseForXML(preloadData, SCSchema.Preload,['Preload'])
            output[`Preload.xml`] = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n${buildXMLObject({Preload: preloadData})}\n`
        }
        if(this.terrain) {
            let terrainData = JSON.parse(JSON.stringify(this.terrain))
            optimiseForXML(terrainData, SCSchema.Terrain)
            output[`t3Terrain.xml`] = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n${buildXMLObject({terrain: terrainData})}\n`
        }
        if(this.regions) {
        //     optimiseForXML(this.regions, SCSchema.Regions)
        //     output[`Regions`] = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n${buildXMLObject(this.regions)}\n`
        }



        if(scopes.includes('data') && this.entities){
            extension = format === 'auto' ? 'xml' : format
            formatting = format === 'auto' ? 'xml' : format;
            let data = (structure === 'compact') ? {mod: this.entities} : this.catalogs
            for (let cat in data) {
                if(cat === "abilcmd")continue
                if(catalogs === 'all' || catalogs.includes(cat)){

                    let outputCatalogData

                    let entities = data[cat];//.filter(entity => !entity.$overriden)

                    if(!core){
                        entities = entities.filter(entity => !entity.__core)
                    }

                    if(formatting === "xml") {
                        // let catalogXMLObjectData = data.map(entity => entity.getXMLObject())
                        // output[`Base.SC2Data/GameData/${capitalize(cat)}Data.xml`] = formatData({Catalog: catalogXMLObjectData}, 'xml')
                        let catalogXML = entities.reduce((acc, entity) => {
                            let entityData
                            if(formatFn){
                                entityData = formatFn(entity)
                            }
                            else{
                                entityData = {...(resolve ? entity.$$resolved : entity)}
                            }
                            return acc + entity.getXML(entityData)
                        }, '')

                        catalogXML = catalogXML.replace(/<__token__ (.*)\/>/g,`<?token $1?>`)
                        outputCatalogData = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Catalog>\n${catalogXML}\n</Catalog>`
                    }
                    else {
                        let catalogCache = {}
                        for(let entity of entities){
                            let entityData
                            if(formatFn){
                                entityData = formatFn(entity)
                            }
                            else{
                                entityData = {...(resolve ? entity.$$resolved : entity)}
                            }
                            catalogCache[entityData.id] = entityData
                            delete entityData.id;
                        }
                        outputCatalogData = formatData(catalogCache, formatting)
                    }
                    output[`Base.SC2Data/GameData/${capitalize(cat)}Data.${extension}`] = outputCatalogData
                    if(scopes.includes('binary') && format === 'auto'){
                        fs.copyFileSync(path.resolve(__dirname ,config.binaryFolder+ '/GameData.version'), destpath + `GameData.version`)
                    }
                }

            }
        }
        if(scopes.includes('triggers') && this.triggers){

            // output[`Triggers`]  = `<?xml version="1.0" encoding="utf-8"?>\n<TriggerData>\n${this.triggers}\n</TriggerData>`

            //todo parsed triggers
            let libraries = this.triggers.map(lib => optimiseForXML(JSON.parse(JSON.stringify(lib)), LibrarySchema))
            let triggersString = formatData({TriggerData: {Library: libraries}}, format === 'auto' ? 'xml' : format)

            function fixTriggers(text){
                let chunks = []

                let tagBodyStart = -1, tagBodyEnd = -1;
                let openerTag = false
                let closingTag = false
                let tagBody = false
                let lastChunkEnd = 0
                for(let i =0 ; i < text.length; i++){
                    if(text[i] === '<'){
                        if(text[i+1] === '/'){
                            closingTag = true
                            tagBodyEnd = i
                            if(tagBodyStart !== -1 && tagBodyStart !== tagBodyEnd){
                                let original = text.substring(tagBodyStart, tagBodyEnd)
                                let replacement = original
                                    .replace(/&#xD;/g,'')
                                    .replace(/"/g,'&quot;')
                                    .replace(/'/g,'&apos;')

                                if(replacement !== original){
                                    // let l1 = tagBodyEnd - tagBodyStart
                                    // let l2 = replacement.length

                                    chunks.push(text.substring(lastChunkEnd,tagBodyStart),replacement)
                                    lastChunkEnd = i
                                    // text = text.substring(0,tagBodyStart) + replacement + text.substring(tagBodyEnd)
                                    // i+= l2 - l1
                                }
                            }
                            tagBodyStart = -1
                            tagBodyEnd = -1
                        }
                        else{
                            openerTag = true
                            tagBodyStart = -1
                            tagBodyEnd = -1
                        }
                    }
                    else if(text[i] === '>'){
                        if(openerTag){
                            if(text[i -1] !== '/'){
                                tagBody = true
                                tagBodyStart = i + 1
                            }
                            openerTag = false
                        }
                        else{
                            closingTag = false
                        }
                    }
                }
                chunks.push(text.substring(lastChunkEnd))
                return chunks.join("")
            }

            output[`Triggers`] = fixTriggers(triggersString)

            if(scopes.includes('binary') && format === 'auto'){
                fs.copyFileSync(path.resolve(__dirname ,config.binaryFolder+ '/Triggers.version'), destpath + `Triggers.version`)
            }
        }

        if(outputFn){
            outputFn(this, output, {scopes})
        }
        
        //writing process
        for (let file in this.files) {
            if(scopes.includes(this.files[file].scope)){
                let foutput = destpath + file.replace(/\\/g, "\/")
                let finput = this.files[file].path.replace(/\\/g, "\/")
                if(this.files[file].scope === 'media'){
                    if(fs.existsSync(foutput)){
                        let stats1 = fs.statSync(finput)
                        let stats2 = fs.statSync(foutput)
                        if(stats1.size === stats2.size){
                            continue;
                        }
                    }
                }
                fs.mkdirSync(foutput.substring(0, foutput.lastIndexOf("/")), {recursive: true});
                if(fs.existsSync(finput)) {
                    fs.copyFileSync(finput, foutput)
                }
                else{
                    console.warn("File not exist: " + finput)
                }
            }
        }

        for(let file in output){
            let foutput = destpath + file.replace(/\\/g, "\/")
            fs.mkdirSync(foutput.substring(0, foutput.lastIndexOf("/")), {recursive: true});
            fs.writeFileSync(foutput, output[file])
        }

        this.debug()

        return this

        // if(combo.dependenciesFiles.length) saveXMLData({Includes: {Path: combo.dependenciesFiles.map(dep => ({ $: {value: dep}}))}}, output + "Base.SC2Data/Includes.xml")
    }