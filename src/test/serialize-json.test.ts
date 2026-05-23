import { describe, expect, it } from 'vitest';
import { serializeJsonForHtml } from '@/lib/serialize-json';

describe('serializeJsonForHtml', () => {
  it('escapes characters that can break out of JSON script content', () => {
    const serialized = serializeJsonForHtml({
      text: '</script><script>alert("x")</script>',
      comparison: '<>&',
      separators: `line\u2028separator\u2029paragraph`,
    });

    expect(serialized).not.toContain('</script>');
    expect(serialized).not.toContain('<');
    expect(serialized).not.toContain('>');
    expect(serialized).not.toContain('&');
    expect(serialized).not.toContain('\u2028');
    expect(serialized).not.toContain('\u2029');
    expect(serialized).toContain('\\u003C/script\\u003E');
    expect(serialized).toContain('\\u003C\\u003E\\u0026');
    expect(serialized).toContain('\\u2028');
    expect(serialized).toContain('\\u2029');
  });
});
