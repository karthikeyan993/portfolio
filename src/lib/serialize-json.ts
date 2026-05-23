const HTML_JSON_REPLACEMENTS: Record<string, string> = {
  '<': '\\u003C',
  '>': '\\u003E',
  '&': '\\u0026',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};

export function serializeJsonForHtml(value: unknown): string {
  return (JSON.stringify(value) ?? 'null').replace(/[<>&\u2028\u2029]/g, (character) => HTML_JSON_REPLACEMENTS[character]);
}
