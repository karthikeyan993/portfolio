import type { ZodIssue } from 'zod';

const stringifyPath = (path: Array<string | number | symbol>): string => {
  if (path.length === 0) {
    return 'root';
  }

  return path
    .map((segment) =>
      typeof segment === 'number' ? `[${segment}]` : String(segment)
    )
    .join('.');
};

export const formatZodIssues = (issues: ZodIssue[]): string => {
  return issues
    .map((issue) => `${stringifyPath(issue.path)}: ${issue.message}`)
    .join('; ');
};
