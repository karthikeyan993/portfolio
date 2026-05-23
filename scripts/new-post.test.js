import { describe, expect, it } from 'vitest';
import { quoteYamlString, slugify } from './new-post.js';

describe('new-post helpers', () => {
  it('quotes frontmatter titles as YAML-safe strings', () => {
    expect(quoteYamlString('Title: "YAML" # comment')).toBe('"Title: \\"YAML\\" # comment"');
    expect(quoteYamlString('two\nlines')).toBe('"two\\nlines"');
  });

  it('keeps slug generation stable', () => {
    expect(slugify('Title: "YAML" # comment')).toBe('title-yaml-comment');
  });
});
