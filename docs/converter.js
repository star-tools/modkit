/* ===== Full JS Implementation with IndexedDB-based Virtual ZIP and ZIP Export ===== */

import JSZip from '../src/lib/jszip.js';
import JSZipComponentReader from '../src/readers/scmod-reader-jszip.js';
import SC2JSON from '../src/converter/scjson.js';
import SC2JSONDebugger from '../src/converter/debugger.js';
import '../src/schema/catalog.js';

class IDBStorage {
  constructor(dbName = 'zipStorage') {
    this.dbName = dbName;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files');
        }
      };
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  async set(key, value) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      store.put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('files', 'readonly');
      const store = tx.objectStore('files');
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(key) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      store.delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async clear() {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      store.clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

export default class ConverterApp {
  constructor() {

    this.debugger = new SC2JSONDebugger()
    this.converter = new SC2JSON({debugger : this.debugger});
    this.zipReader = null;
    this.currentFileName = null;
    this.storage = new IDBStorage();

    this.defaultXML = document.getElementById('sc2-xml').textContent.trim();
    this.defaultJSON = document.getElementById('sc2-json').textContent.trim();

    this.editorXML = null;
    this.editorJSON = null;
    this.decorations = [];

    this.fileListDiv = document.getElementById('file-list');
    this.uploadInfo = document.getElementById('uploadInfo');
    this.fileInput = document.getElementById('fileInput');

    document.getElementById('btn-xml-to-json').onclick = () => this.convertXmlToJson();
    document.getElementById('btn-json-to-xml').onclick = () => this.convertJsonToXml();
    document.getElementById('btn-reset').onclick = () => this.resetEditors();
    document.getElementById('btn-download-zip').onclick = () => this.downloadAsZip();

    this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));

    this.init();
  }

  async init() {
    await this.storage.init();
    await this.initEditors();
    this.setupKeyboardNavigation(); 

    const indexRaw = await this.storage.get('zipfile:indexlist');
    if (indexRaw) {
      const indexList = JSON.parse(indexRaw);
      this.rebuildFileList(indexList);
    }
  }

  setupKeyboardNavigation() {
    this.fileListDiv.setAttribute('tabindex', '0'); // make focusable
    this.fileListDiv.addEventListener('keydown', async (e) => {
        const active = this.fileListDiv.querySelector('.active');
        const items = [...this.fileListDiv.children];
        const currentIndex = items.indexOf(active);

        let newIndex = currentIndex;

        if (e.key === 'ArrowUp') {
            newIndex = Math.max(0, currentIndex - 1);

            e.preventDefault()
        } else if (e.key === 'ArrowDown') {
            newIndex = Math.min(items.length - 1, currentIndex + 1);
            e.preventDefault()
        }

        if (newIndex !== currentIndex) {
            items[newIndex].click();
            items[newIndex].scrollIntoView({ block: 'nearest' });
        }
    });
    }


  async initEditors() {
    return new Promise((resolve) => {
      require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
      require(['vs/editor/editor.main'], () => {
        this.editorXML = monaco.editor.create(document.getElementById('editor-xml'), {
          value: '',
          language: 'xml', theme: 'vs-dark', automaticLayout: true
        });

        this.editorJSON = monaco.editor.create(document.getElementById('editor-json'), {
          value: '',
          language: 'json', theme: 'vs-dark', automaticLayout: true
        });

        resolve();
      });
    });
  }


    async handleFileUpload(event) {
        const files = Array.from(event.target.files);
        const indexList = [];

        for (const file of files) {
        const ext = file.name.split('.').pop().toLowerCase();
        const path = file.webkitRelativePath || file.name;

        if (ext === 'zip') {
            this.uploadInfo.textContent = `Loaded: ${file.name}`;

            this.zipReader = new JSZipComponentReader();
            await this.zipReader.load(file);
            const { files: zipFiles } = this.zipReader.getFiles('', true);

            for (const filename of zipFiles) {
            if (!filename.endsWith('.xml')) continue;
            const label = filename.split('/').pop().replace(/data.xml$/i, '');
            if (!JSZipComponentReader.DATA_FILES.includes(label.toLowerCase())) continue;

            const content = await this.zipReader.read(filename);
            await this.storage.set(`zipfile:${filename}`, content);
            indexList.push(filename);
            }
        } else if (ext === 'xml') {
            const text = await file.text();
            await this.storage.set(`zipfile:${path}`, text);
            indexList.push(path);
        }
        }

        if (indexList.length > 0) {
        await this.storage.set('zipfile:indexlist', JSON.stringify(indexList));
        this.rebuildFileList(indexList);
        }

        event.target.value = '';
    }

    async rebuildFileList(fileList) {
        this.fileListDiv.innerHTML = '';

        const lastOpened = localStorage.getItem('lastOpened');
        const fallback = fileList[0];

        for (const filename of fileList) {


            //todo initial test
            const xml = await this.storage.get(`zipfile:${filename}`);
            this.converter.toJSON(xml);



            const label = filename.split('/').pop().replace('data.xml', '');
            const div = this.createFileListItem(filename, label, false);
            this.fileListDiv.appendChild(div);
            if (filename === lastOpened || (!lastOpened && filename === fallback)) {
            div.click(); // Open file
            }
        }
    }

  createFileListItem(filename, label, isActive) {
        const div = document.createElement('div');
        div.classList.toggle('active', isActive);
        div.onclick = () => this.onFileSelect(filename, div)


        // Create file icon span or svg
        const icon = document.createElement('span');
        icon.className = 'file-icon';
        icon.textContent = '📄'; // simple icon
        div.appendChild(icon);

        const textNode = document.createTextNode(label);
        div.appendChild(textNode);

        return div;
    }

  async onFileSelect(filename, divElement) {
    if (filename === this.currentFileName) return;
    await this.saveCurrentXml();

    const xml = await this.storage.get(`zipfile:${filename}`);
    // const xml = await this.zipReader.read(filename);
    this.editorXML.setValue(xml);

    try {
      const newJsonObj = this.converter.toJSON(xml);
      const newJsonStr = JSON.stringify(newJsonObj, null, 2);
      this.editorJSON.setValue(newJsonStr);
    } catch {
      this.editorJSON.setValue('');
    }

    this.currentFileName = filename;
    [...this.fileListDiv.children].forEach(c => c.classList.remove('active'));
    divElement.classList.add('active');
    
    localStorage.setItem('lastOpened', filename); // 🆕 remember last opened

  }

  async saveCurrentXml() {
    if (this.currentFileName) {
      const xml = this.editorXML.getValue();
      await this.storage.set(`zipfile:${this.currentFileName}`, xml);
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
    if (!confirm('Reset editors and clear saved ZIP?')) return;

    await this.storage.clear();
    location.reload();
  }

  async downloadAsZip() {
    const zip = new JSZip();
    const fileListRaw = await this.storage.get('zipfile:indexlist');
    const fileList = JSON.parse(fileListRaw || '[]');
    for (const filename of fileList) {
      const content = await this.storage.get(`zipfile:${filename}`);
      if (content) zip.file(filename, content);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modified_data.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
