import rawSiteContent from './site-content.json';
import { parseSiteContent } from './site-content.schema';

export const siteContent = parseSiteContent(rawSiteContent);
