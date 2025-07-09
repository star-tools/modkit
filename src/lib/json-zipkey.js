
const CJK_START = 0x4E00;
const CJK_END = 0x9FFF;
const CHINESE_KEYS = [];

for (let i = CJK_START; i <= CJK_END; i++) {
  CHINESE_KEYS.push(String.fromCharCode(i));
}

function indexToChineseKey(index) {
  const base = CHINESE_KEYS.length;
  let key = '';
  do {
    key = CHINESE_KEYS[index % base] + key;
    index = Math.floor(index / base) - 1;
  } while (index >= 0);
  return key;
}

function chineseKeyToIndex(key) {
  const base = CHINESE_KEYS.length;
  let index = 0;
  for (let i = 0; i < key.length; i++) {
    const charIndex = CHINESE_KEYS.indexOf(key[i]);
    if (charIndex === -1) throw new Error(`Invalid Chinese key char: ${key[i]}`);
    index = index * base + (charIndex + 1);
  }
  return index - 1;
}



const CHAR_SET = [];
for (let i = 0; i < 26; i++) {
  CHAR_SET.push(String.fromCharCode(97 + i)); // a-z
}
for (let i = 0; i < 26; i++) {
  CHAR_SET.push(String.fromCharCode(65 + i)); // A-Z
}
const BASE = CHAR_SET.length; // 52

function indexToAsciiKey(index) {
  let key = '';
  do {
    key = CHAR_SET[index % BASE] + key;
    index = Math.floor(index / BASE) - 1;
  } while (index >= 0);
  return key;
}

function asciiKeyToIndex(key) {
  let index = 0;
  for (let i = 0; i < key.length; i++) {
    const charIndex = CHAR_SET.indexOf(key[i]);
    if (charIndex === -1) throw new Error(`Invalid key char: ${key[i]}`);
    index = index * BASE + (charIndex + 1);
  }
  return index - 1;
}


let indexToKey = indexToChineseKey

let keyToIndex = chineseKeyToIndex

export function compressJSON(obj) {
  const keyMap = new Map();
  const keyList = [];
  let counter = 0;

  function getAsciiKey(originalKey) {
    if (!keyMap.has(originalKey)) {
      const newKey = indexToKey(counter++);
      keyMap.set(originalKey, newKey);
      keyList.push(originalKey);
    }
    return keyMap.get(originalKey);
  }

  function compress(o) {
    if (Array.isArray(o)) {
      return o.map(compress);
    } else if (o && typeof o === 'object') {
      const result = {};
      for (const [k, v] of Object.entries(o)) {
        const newKey = getAsciiKey(k);
        result[newKey] = compress(v);
      }
      return result;
    } else {
      return o;
    }
  }

  const data = compress(obj);

  return {
    keys: keyList,
    data
  };
}

export function decompressJSON({ keys, data }) {
  function decompress(o) {
    if (Array.isArray(o)) {
      return o.map(decompress);
    } else if (o && typeof o === 'object') {
      const result = {};
      for (const [k, v] of Object.entries(o)) {
        const originalKey = keys[keyToIndex(k)] || k;
        result[originalKey] = decompress(v);
      }
      return result;
    } else {
      return o;
    }
  }

  return decompress(data);
}
