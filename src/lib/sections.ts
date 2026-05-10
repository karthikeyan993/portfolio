import type { SiteContent } from '@/data/site-content.schema';

type ToggleableSection = {
  enabled?: boolean;
};

const hasText = (value?: string) => Boolean(value?.trim());

const hasItems = <T>(items: T[] | undefined, predicate: (item: T) => boolean) => {
  return Boolean(items?.some(predicate));
};

const isEnabled = (section?: ToggleableSection) => section?.enabled !== false;

export const hasHeroContent = (content: SiteContent['hero']) => {
  return isEnabled(content) && (hasText(content.name) || hasText(content.summary) || content.titles.length > 0);
};

export const hasAboutContent = (content: SiteContent['about']) => {
  return isEnabled(content) && (hasText(content.title) || hasText(content.eyebrow) || content.paragraphs.some(hasText));
};

export const hasTechStackContent = (content: SiteContent['techStack']) => {
  return (
    isEnabled(content) &&
    (hasText(content.title) ||
      hasText(content.eyebrow) ||
      hasItems(content.categories, (category) => hasText(category.title) || category.techs.some(hasText)))
  );
};

export const hasExperienceContent = (content: SiteContent['experience']) => {
  return (
    isEnabled(content) &&
    (hasText(content.title) ||
      hasText(content.eyebrow) ||
      hasItems(content.items, (item) => hasText(item.company) || hasText(item.role) || hasText(item.period)))
  );
};

const hasProjectItemContent = (item: SiteContent['projects']['items'][number]) => {
  return hasText(item.title) || hasText(item.summary) || item.tags.some(hasText);
};

export const hasFeaturedProjectContent = (content: SiteContent['featuredProject']) => {
  return (
    isEnabled(content) &&
    (hasText(content.sectionTitle) ||
      hasText(content.eyebrow) ||
      hasText(content.title) ||
      hasText(content.summary) ||
      content.tags.some(hasText))
  );
};

export const hasProjectsContent = (content: SiteContent['projects']) => {
  return (
    isEnabled(content) &&
    (hasText(content.title) || hasText(content.eyebrow) || hasItems(content.items, hasProjectItemContent))
  );
};

export const hasWritingContent = (content: SiteContent['writing'], postCount: number) => {
  return isEnabled(content) && postCount > 0 && (hasText(content.title) || hasText(content.description));
};

export const hasContactContent = (content: SiteContent['contact']) => {
  return (
    isEnabled(content) &&
    (hasText(content.title) ||
      hasText(content.description) ||
      hasText(content.email) ||
      hasItems(content.links, (link) => hasText(link.href) || hasText(link.label)) ||
      hasItems(content.infoCards, (card) => hasText(card.value) || hasText(card.label)))
  );
};

export const getVisibleHomeSectionIds = (content: SiteContent) => {
  const visibleSections = new Set<string>();

  if (hasAboutContent(content.about)) visibleSections.add('about');
  if (hasTechStackContent(content.techStack)) visibleSections.add('tech-stack');
  if (hasExperienceContent(content.experience)) visibleSections.add('experience');
  if (hasProjectsContent(content.projects)) visibleSections.add('projects');
  if (hasContactContent(content.contact)) visibleSections.add('contact');

  return visibleSections;
};
