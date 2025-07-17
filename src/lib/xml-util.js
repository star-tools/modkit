const DOMParser = (typeof window !== 'undefined') ? window.DOMParser : (await import('xmldom')).DOMParser;

/**
 * Parses an XML string into a DOM Document.
 * @param {string} xmlString
 * @returns {Document}
 */
export function parseXML(xmlString) {
  const parser = new DOMParser();
  return parser.parseFromString(xmlString, 'text/xml');
}


/**
 * Escapes XML special characters in a string.
 * @param {string} str
 * @returns {string}
 */
export function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

//Compact XML
export function cleanXML(xmlString, options = { removeLineBreaks: true }) {
  // Step 1: Remove spaces between tags
  let out = xmlString.replace(/>\s+</g, '><');
  if (options.removeLineBreaks) {
    out = out.replace(/(\>)\s*\n\s*(\<)/g, '$1$2');
  }
  // Step 2: Clean tag attributes (remove extra spaces & trim values)
  out = out.replace(/<([\w:-]+)\s+([^>]+?)\s*(\/?)>/g, (match, tagName, attrs, selfClose) => {
    // Clean attribute list
    const cleanedAttrs = attrs
      .trim()
      .replace(/\s*=\s*/g, '=') // Remove spaces around '='
      .replace(/(\w+)=["']\s*([^"']*?)\s*["']/g, (m, name, value) => {
        return `${name}="${value}"`; // Trim spaces in attribute values
      })
      .replace(/\s+/g, ' '); // Collapse multiple spaces between attributes

    return `<${tagName} ${cleanedAttrs}${selfClose ? ' /' : ''}>`;
  });

  return out.trim();
}
