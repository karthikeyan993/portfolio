#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'));

const locales = ['en', 'de'];
const errors = [];
const warnings = [];
const homeSectionIds = new Set(['about', 'tech-stack', 'experience', 'projects', 'contact']);
const placeholderPatterns = [/alex@example\.com/i, /^https:\/\/github\.com\/?$/i, /^https:\/\/www\.linkedin\.com\/?$/i];

const walkValues = (value, visitor) => {
  if (Array.isArray(value)) {
    value.forEach((item) => walkValues(item, visitor));
    return;
  }

  if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => walkValues(item, visitor));
    return;
  }

  visitor(value);
};

for (const locale of locales) {
  const content = readJson(`src/data/site-content.${locale}.json`);

  for (const item of content.nav) {
    if (!homeSectionIds.has(item.id)) {
      errors.push(`${locale}: nav item points at unknown home section '${item.id}'.`);
    }
  }

  const resumePath = path.join(rootDir, 'public', content.resume.href.replace(/^\//, ''));
  if (!fs.existsSync(resumePath)) {
    errors.push(`${locale}: resume file is missing at ${content.resume.href}.`);
  }

  walkValues(content, (value) => {
    if (typeof value === 'string' && placeholderPatterns.some((pattern) => pattern.test(value))) {
      warnings.push(`${locale}: placeholder value still present: ${value}`);
    }
  });
}

if (warnings.length > 0) {
  console.warn(`Content validation warnings:\n- ${warnings.join('\n- ')}`);
}

const blogDir = path.join(rootDir, 'src/data/blog');
const translationKeys = new Map();

for (const filename of fs.readdirSync(blogDir).filter((file) => /\.mdx?$/.test(file))) {
  const source = fs.readFileSync(path.join(blogDir, filename), 'utf8');
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter) continue;

  const language = frontmatter[1].match(/^language:\s*['"]?([a-z-]+)['"]?\s*$/m)?.[1];
  const translationKey = frontmatter[1].match(/^translationKey:\s*['"]?([^'"\n]+)['"]?\s*$/m)?.[1];
  if (!translationKey || !language) continue;

  const mapKey = `${translationKey}:${language}`;
  const existing = translationKeys.get(mapKey);
  if (existing) {
    errors.push(`Duplicate ${language} translationKey '${translationKey}' in ${existing} and ${filename}.`);
  }
  translationKeys.set(mapKey, filename);
}

if (errors.length > 0) {
  console.error(`Content validation failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log('Content validation passed.');
