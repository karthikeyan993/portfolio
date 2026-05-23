#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// Calculate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to slugify the title
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w-]+/g, '')       // Remove all non-word chars
    .replace(/--+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
}

function escapeYamlDoubleQuotedCharacter(character) {
  switch (character) {
    case '"':
      return '\\"';
    case '\\':
      return '\\\\';
    case '\0':
      return '\\0';
    case '\x07':
      return '\\a';
    case '\b':
      return '\\b';
    case '\t':
      return '\\t';
    case '\n':
      return '\\n';
    case '\v':
      return '\\v';
    case '\f':
      return '\\f';
    case '\r':
      return '\\r';
    case '\x1b':
      return '\\e';
    default: {
      const codePoint = character.codePointAt(0);
      return codePoint === undefined ? '' : `\\u${codePoint.toString(16).padStart(4, '0')}`;
    }
  }
}

export function quoteYamlString(value) {
  let escaped = '';

  for (const character of value.toString()) {
    const codePoint = character.codePointAt(0);
    escaped += character === '"' || character === '\\' || (codePoint !== undefined && (codePoint < 0x20 || codePoint === 0x7f))
      ? escapeYamlDoubleQuotedCharacter(character)
      : character;
  }

  return `"${escaped}"`;
}

function run() {
  // Get CLI arguments
  const args = process.argv.slice(2);
  const titleArg = args.find(arg => !arg.startsWith('--'));
  const langArg = args.find(arg => arg.startsWith('--lang='));

  if (!titleArg) {
    console.error('\x1b[31mError: Please provide a post title.\x1b[0m');
    console.log('\nUsage:');
    console.log('  pnpm run new-post "My New Post" [--lang=en|de]\n');
    process.exit(1);
  }

  // Parse language option (defaults to 'en')
  let language = 'en';
  if (langArg) {
    const parts = langArg.split('=');
    if (parts.length === 2 && (parts[1] === 'en' || parts[1] === 'de')) {
      language = parts[1];
    } else {
      console.warn(`\x1b[33mWarning: Unsupported language. Defaulting to 'en'. (Supported: en, de)\x1b[0m`);
    }
  }

  const slug = slugify(titleArg);
  if (!slug) {
    console.error('\x1b[31mError: Title must contain alphanumeric characters.\x1b[0m');
    process.exit(1);
  }

  // Target folder for blog files
  const blogDir = path.resolve(__dirname, '../src/data/blog');

  // Ensure directory exists
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }

  // Check for collision
  const filename = `${slug}.md`;
  const filePath = path.join(blogDir, filename);

  if (fs.existsSync(filePath)) {
    console.error(`\x1b[31mError: A blog post already exists at src/data/blog/${filename}\x1b[0m`);
    process.exit(1);
  }

  // Get current date formatted as YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  // Template markdown content
  const template = `---
title: ${quoteYamlString(titleArg)}
description: ${quoteYamlString('Brief summary of the blog post.')}
publishedAt: ${today}
language: ${quoteYamlString(language)}
tags: []
draft: true
---

Write your content here!
`;

  try {
    fs.writeFileSync(filePath, template, 'utf8');
    console.log(`\n\x1b[32mSuccess! Created new blog post:\x1b[0m`);
    console.log(`  File: \x1b[36msrc/data/blog/${filename}\x1b[0m`);
    console.log(`  Language: ${language.toUpperCase()}`);
    console.log(`  Draft: true (won't display in production until draft: false is set)\n`);
  } catch (error) {
    console.error('\x1b[31mError writing file:\x1b[0m', error);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
