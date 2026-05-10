import { describe, expect, it } from 'vitest';
import {
  getHomeAnchor,
  getSamePageAnchor,
} from '@/lib/i18n';

describe('i18n route helpers', () => {
  it('builds stable anchors', () => {
    expect(getHomeAnchor('contact', 'en')).toBe('/#contact');
    expect(getHomeAnchor('contact', 'de')).toBe('/de/#contact');
    expect(getSamePageAnchor('projects')).toBe('#projects');
  });
});
