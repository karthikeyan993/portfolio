import { existsSync } from 'node:fs';
import { join } from 'node:path';

const resumePath = join(process.cwd(), 'public', 'resume.pdf');

export const hasPublicResume = () => existsSync(resumePath);
