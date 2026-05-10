import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const getPublicResumePath = (href: string) => {
  return join(process.cwd(), 'public', href.replace(/^\//, ''));
};

export const hasPublicResume = (href: string) => existsSync(getPublicResumePath(href));
