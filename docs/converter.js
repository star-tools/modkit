/* ===== Full JS Implementation with IndexedDB-based Multi-ZIP Mod Support and ZIP Export ===== */

// Use custom version of JSZip (do not replace with default)
import SC2JSON from '../src/converter/scjson.js';
import ZipReader from '../src/readers/zip-reader.js';
import IDBReader from '../src/readers/idb-reader.js';
// import WebReader from '../src/readers/web-reader.js';
// import URLReader from '../src/readers/url-reader.js';
import '../src/schema/all.js';


export default class ConverterApp {
  constructor() {
    this.converter = new SC2JSON();
    this.storage = new IDBReader();

    this.editorXML = null;
    this.editorJSON = null;

    this.currentMod = null;
    this.currentFileName = null;
    this.mods = []
    this.fileListDiv = document.getElementById('file-list');
    this.modBar = document.getElementById('mod-bar');
    this.uploadInfo = document.getElementById('uploadInfo');
    this.fileInput = document.getElementById('fileInput');

    document.getElementById('btn-xml-to-json').onclick = () => this.convertXmlToJson();
    document.getElementById('btn-json-to-xml').onclick = () => this.convertJsonToXml();
    document.getElementById('btn-reset').onclick = () => this.resetEditors();
    document.getElementById('btn-download-zip').onclick = () => this.downloadAsZip();
    document.getElementById('btn-merge').onclick = () => this.mergeMods();
    document.getElementById('btn-new-mod').onclick = () => this.createNewMod();
    document.getElementById('btn-new-file').onclick = () => this.createNewFileInMod();
    document.getElementById('btn-remove-file').onclick = () => this.removeCurrentFile();


    this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
    this.init();
  }

  async removeCurrentFile() {
    if (!this.currentMod || !this.currentFileName) return;
    const files = this.mods[this.currentMod];
    const index = files.indexOf(this.currentFileName);
    if (index !== -1) {
      files.splice(index, 1);
      await this.storage.delete(this.currentFileName);

      this.currentFileName = null;
      this.editorXML.setValue('');
      this.editorJSON.setValue('');
      this.switchMod(this.currentMod);
    }
  }
  
  async mergeMods() {
    const abils = [];
    const mergedFiles = {};

    for (const modName in this.mods) {
      for (const file of this.mods[modName]) {
        if (file.toLowerCase().includes('abildata.xml')) {
          const xml = await this.storage.get(`file:${modName}:${file}`);
          try {
            const json = this.converter.toJSON(xml);
            abils.push(...(json?.Catalog?.CAbil || []));
          } catch (e) {
            console.warn(`Invalid XML in ${modName}:${file}`, e);
          }
        }
      }
    }

    if (abils.length > 0) {
      const merged = { Catalog: { CAbil: abils } };
      const xml = this.converter.toXML(merged, 'Catalog');
      const modName = 'MergedMod';
      const fileName = 'merged/abildata.xml';

      await this.storage.set(`file:${modName}:${fileName}`, xml);
      this.mods[modName] = [fileName];
      this.saveModsList()

      this.addModBadge(modName, true);
      this.switchMod(modName);
    }
  }
  saveModsList(){
      localStorage.setItem('modlist', JSON.stringify(this.mods.map(m => m.name)));
  }

  async init() {
    await this.storage.init();
    await this.initEditors();

    const modsRaw = localStorage.getItem('modlist');
    if (modsRaw) {
      let mods = JSON.parse(modsRaw);
      for (const modName of mods) {

        const idbReader = new IDBReader();
        await idbReader.init(modName);
        this.mods.push({
          name: modName,
          data: idbReader
        })
        this.addModBadge(modName);
      }
      const lastMod = localStorage.getItem('lastMod');
      if (lastMod && this.mods[lastMod]) {
        this.switchMod(lastMod);
      }
    }
  }

  async initEditors() {
    return new Promise((resolve) => {
      require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
      require(['vs/editor/editor.main'], () => {
        this.editorXML = monaco.editor.create(document.getElementById('editor-xml'), {
          value: '',
          language: 'xml',
          theme: 'vs-dark',
          automaticLayout: true
        });

        this.editorJSON = monaco.editor.create(document.getElementById('editor-json'), {
          value: '',
          language: 'json',
          theme: 'vs-dark',
          automaticLayout: true
        });
        resolve();
      });
    });
  }

  async handleFileUpload(event) {
    const files = Array.from(event.target.files);
    for (const file of files) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext !== 'zip') continue;
      const modName = file.name.replace(/\.zip$/i, '');
      const zipReader = new ZipReader(file);
      await zipReader.init();

      const idbReader = new IDBReader();
      await idbReader.init(modName);

      //copy zip data to indexed db
      zipReader.transfer(idbReader)

      this.mods.push({
        name: modName,
        data: idbReader
      })

      this.saveModsList()

      this.addModBadge(modName, true);
      this.switchMod(modName);
    }
    event.target.value = '';
  }

  addModBadge(modName, makeActive = false) {
    const badge = document.createElement('div');
    badge.className = 'mod-badge';
    badge.textContent = modName;
    badge.onclick = () => this.switchMod(modName);

    const close = document.createElement('span');
    close.textContent = '✖';
    close.className = 'remove';
    close.onclick = async (e) => {
      e.stopPropagation();
      await this.deleteMod(modName);
      badge.remove();
    };

    badge.appendChild(close);
    this.modBar.appendChild(badge);
    if (makeActive) badge.click();
  }

  async deleteMod(modName) {
    const mod = this.getMod(modName)
    if (!mod) return;

    await mod.data.clear()

    this.mods.splice(this.mods.indexOf(mod),1)
    this.saveModsList() 
    if (this.currentMod === modName) {
      this.fileListDiv.innerHTML = '';
      this.editorXML.setValue('');
      this.editorJSON.setValue('');
    }
  }
  getMod(modName){
    return this.mods.find(m => m.name === modName)
  }

  async switchMod(modName) {
    const mod = this.getMod(modName)
    if (!mod) return;
    this.currentMod = mod;
    localStorage.setItem('lastMod', mod.name);

    // Highlight active mod badge
    document.querySelectorAll("[mod]").forEach(c => c.classList.remove('active'));
    document.querySelectorAll(`[mod="${modName}"]`).forEach(c => c.classList.add('active'));

    this.fileListDiv.innerHTML = '';
    const files = await this.currentMod.data.list()
    const sortedFiles = files.sort((a,b) => a > b ? 1: -1)

    const tree = this.buildFileTree(sortedFiles);
    const treeDOM = this.renderFileTree(tree, modName);
    this.fileListDiv.appendChild(treeDOM);

    if (sortedFiles.length > 0) {
      const first = sortedFiles[0];
      const firstDiv = this.fileListDiv.querySelector('div');
      if (firstDiv) firstDiv.click();
    }
  }

  extensions = {
    index: {text: "<>", class: "xml"},
    documentinfo: {text: "<>", class: "xml"},
    sc2components: {text: "<>", class: "xml"},
    sc2lib: {text: "<>", class: "xml"},
    sc2layout: {text: "<>", class: "xml"},
    triggerlib: {text: "<>", class: "xml"},
    sc2cutscene: {text: "<>", class: "xml"},
    xml: {text: "<>", class: "xml"},
    galaxy: {text: "{}", class: "text"},
    txt: {text: "#", class: "galaxy"},
  }

  /** Updated File List with Tree View Support by Directory **/
  // Add a method to build a nested directory structure from the flat file list
  buildFileTree(fileList) {
    const tree = {};
    for (const path of fileList) {
      const parts = path.split('/');
      let current = tree;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = i === parts.length - 1 ? path : {};
        }
        current = current[part];
      }
    }
    return tree;
  }

  // Recursively render the file tree to the DOM
  renderFileTree(tree, modName) {
    const ul = document.createElement('ul');
    ul.classList.add("tree-list")


    const filesSorted = Object.keys(tree).sort((a, b) => {
      const aIsDir = typeof tree[a] !== 'string';
      const bIsDir = typeof tree[b] !== 'string';

      if (aIsDir !== bIsDir) {
        return aIsDir ? -1 : 1; // directories first
      }
      return a.localeCompare(b); // alphabetical
    })

    for (const key of filesSorted) {
      const value = tree[key];
      const li = document.createElement('li');

      if (typeof value === 'string') {
        const div = this.createFileListItem(modName, value, key, false);
        li.appendChild(div);
      } else {
        const details = document.createElement('details');
        details.className = 'folder-item';
        details.setAttribute("open",true)

        const summary = document.createElement('summary');
        const icon = document.createElement('span');
        icon.className = 'file-icon folder';
        icon.textContent = '📁';
        icon.style.color = '#d7ba7d';

        summary.appendChild(icon);
        summary.appendChild(document.createTextNode(' ' + key));
        details.appendChild(summary);

        li.appendChild(details);
        let subTree = this.renderFileTree( value, modName);
        details.appendChild(subTree);

      }
      ul.appendChild(li);
    }
    return ul;
  }

  createFileListItem(modName, filename, label, isActive) {
    const div = document.createElement('div');
    div.classList.toggle('active', isActive);
    div.onclick = () => this.onFileSelect(modName, filename, div);
    div.setAttribute("data-file",modName + ":" + filename)

    
    const icon = document.createElement('span');
    icon.className = 'file-icon';

    const lower = filename.split("/").pop().toLowerCase();
    const ext = lower.split(".").pop()
    let fileTypeData = this.extensions[ext]
    if(!fileTypeData){
      fileTypeData = {text: "@", class: "binary"}
    }
    icon.textContent = fileTypeData.text
    icon.classList.add(fileTypeData.class);
    div.appendChild(icon);


    const textNode = document.createTextNode(label);
    div.appendChild(textNode);
    return div;
  }

  async onFileSelect(modName, filename, divElement) {
    if (filename === this.currentFileName) return;
    await this.saveCurrentXml();
    let mod = await this.mods.find(m => m.name === modName)

    const xml = await mod.data.get(filename)
    // const xml = await this.storage.get(`file:${modName}:${filename}`);
    this.editorXML.setValue(xml);

    this.convertXmlToJson()

    this.currentFileName = filename;
    document.querySelectorAll("[data-file]").forEach(c => c.classList.remove('active'));
    divElement.classList.add('active');

    localStorage.setItem('lastOpened', filename);
  }

  async saveCurrentXml() {
    if (this.currentMod && this.currentFileName) {
      const xml = this.editorXML.getValue();
      await this.storage.set(`file:${this.currentMod}:${this.currentFileName}`, xml);
    }
  }


  async createNewMod() {
    const modName = prompt('Enter new mod name:');
    if (!modName || this.mods[modName]) return;
    this.mods[modName] = [];
    

    this.saveModsList()
    this.addModBadge(modName, true);
    this.switchMod(modName);
  }

  async createNewFileInMod() {
    if (!this.currentMod) return;
    const options = ['abildata.xml', 'unitdata.xml', 'effectdata.xml'];
    const fileName = prompt(`Enter file name to create (suggestions: ${options.join(', ')}):`);
    if (!fileName) return;
    const fullPath = `custom/${fileName}`;
    if (!this.mods[this.currentMod].includes(fullPath)) {
      this.mods[this.currentMod].push(fullPath);
      await this.storage.set(`file:${this.currentMod}:${fullPath}`, '<Catalog></Catalog>');
      this.saveModsList()
      this.switchMod(this.currentMod);
    }
  }

  convertXmlToJson() {
    try {
      const xml = this.editorXML.getValue();
      const json = this.converter.toJSON(xml);
      this.editorJSON.setValue(JSON.stringify(json, null, 2));
    } catch (e) {
      alert('Invalid XML: ' + e.message);
    }
  }

  convertJsonToXml() {
    try {
      const json = JSON.parse(this.editorJSON.getValue());
      const xml = this.converter.toXML(json, 'Catalog');
      this.editorXML.setValue(xml);
    } catch (e) {
      alert('Invalid JSON: ' + e.message);
    }
  }

  async resetEditors() {
    if (!confirm('Reset editors and clear all mods?')) return;
    this.mods = []
    await this.storage.clear();
    this.saveModsList()
    location.reload();
  }

  async downloadAsZip() {
    if (!this.currentMod) return;
    //make blob
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.currentMod}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
