

export function flattenToIni(obj, parentPath = [], sections = {}) {
  for (const key in obj) {
    const value = obj[key];
    const fullPath = [...parentPath, key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      flattenToIni(value, fullPath, sections);
    } else {
      const sectionName = parentPath.length === 0 ? '/' : parentPath.join('/');
      if (!sections[sectionName]) sections[sectionName] = {};
      sections[sectionName][key] = String(value); // no quotes
    }
  }

  return sections;
}

export function sectionsToIniString(sections) {
  const lines = [];

  // Top-level keys first (from virtual "/" section)
  if (sections['/']) {
    for (const [key, val] of Object.entries(sections['/'])) {
      lines.push(`${key} = ${val}`);
    }
    delete sections['/'];
  }

  // All other [section] blocks
  for (const [section, entries] of Object.entries(sections)) {
    lines.push(`[${section}]`);
    for (const [key, val] of Object.entries(entries)) {
      lines.push(`${key}=${val}`);
    }
  }

  return lines.join("\n");
}