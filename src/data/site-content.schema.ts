import { z } from 'zod';
import { formatZodIssues } from '@/lib/validation';

export const localeSchema = z.enum(['en', 'de']);
export type Locale = z.infer<typeof localeSchema>;

export const navItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
});

export type NavItem = z.infer<typeof navItemSchema>;

export const socialPlatformSchema = z.enum(['github', 'linkedin', 'mail']);
export type SocialPlatform = z.infer<typeof socialPlatformSchema>;

const heroSocialLinkSchema = z.object({
  platform: socialPlatformSchema,
  href: z.string().default(''),
  label: z.string().default(''),
});

const heroSchema = z.object({
  enabled: z.boolean().default(true),
  greeting: z.string().default(''),
  name: z.string().default(''),
  initials: z.string().default(''),
  titles: z.array(z.string()).default([]),
  summary: z.string().default(''),
  ctaLabel: z.string().default(''),
  ctaHref: z.string().default(''),
  resumeLabel: z.string().default(''),
  socialLinks: z.array(heroSocialLinkSchema).default([]),
}).prefault({});

const aboutHighlightIconSchema = z.enum(['user', 'mapPin', 'languages']);
export type AboutHighlightIcon = z.infer<typeof aboutHighlightIconSchema>;

const aboutHighlightSchema = z.object({
  icon: aboutHighlightIconSchema,
  label: z.string().default(''),
  description: z.string().default(''),
});

const aboutSchema = z.object({
  enabled: z.boolean().default(true),
  title: z.string().default(''),
  eyebrow: z.string().default(''),
  paragraphs: z.array(z.string()).default([]),
  highlights: z.array(aboutHighlightSchema).default([]),
}).prefault({});

const techCategorySchema = z.object({
  title: z.string().default(''),
  techs: z.array(z.string()).default([]),
});

const techStackSchema = z.object({
  enabled: z.boolean().default(true),
  title: z.string().default(''),
  eyebrow: z.string().default(''),
  categories: z.array(techCategorySchema).default([]),
}).prefault({});

export const experienceItemSchema = z.object({
  company: z.string().default(''),
  role: z.string().default(''),
  period: z.string().default(''),
  location: z.string().default(''),
  bullets: z.array(z.string()).default([]),
});

export type ExperienceItem = z.infer<typeof experienceItemSchema>;

const experienceSchema = z.object({
  enabled: z.boolean().default(true),
  title: z.string().default(''),
  eyebrow: z.string().default(''),
  items: z.array(experienceItemSchema).default([]),
}).prefault({});

const projectLinkSchema = z.object({
  live: z.string().optional(),
  source: z.string().optional(),
}).default({});

export const projectItemSchema = z.object({
  slug: z.string().default(''),
  title: z.string().default(''),
  summary: z.string().default(''),
  tags: z.array(z.string()).default([]),
  links: projectLinkSchema,
  featured: z.boolean().default(false),
});

export type ProjectItem = z.infer<typeof projectItemSchema>;

const featuredProjectSchema = projectItemSchema.extend({
  enabled: z.boolean().default(true),
  sectionTitle: z.string().default(''),
  eyebrow: z.string().default(''),
  badge: z.string().default(''),
  previewLabel: z.string().default(''),
}).prefault({});

const projectsSchema = z.object({
  enabled: z.boolean().default(true),
  title: z.string().default(''),
  eyebrow: z.string().default(''),
  items: z.array(projectItemSchema).default([]),
}).prefault({});

const contactLinkPlatformSchema = z.enum(['email', 'linkedin', 'github']);

const contactLinkSchema = z.object({
  platform: contactLinkPlatformSchema,
  href: z.string().default(''),
  label: z.string().default(''),
});

const contactCardIconSchema = z.enum(['mail', 'mapPin']);

const contactInfoCardSchema = z.object({
  icon: contactCardIconSchema,
  label: z.string().default(''),
  value: z.string().default(''),
  href: z.string().optional(),
});

export const contactConfigSchema = z.object({
  enabled: z.boolean().default(true),
  title: z.string().default(''),
  eyebrow: z.string().default(''),
  description: z.string().default(''),
  email: z.email().or(z.literal('')).default(''),
  location: z.string().default(''),
  formEnabled: z.boolean().default(false),
  submitLabel: z.string().default(''),
  successTitle: z.string().default(''),
  successMessage: z.string().default(''),
  nameLabel: z.string().default(''),
  emailLabel: z.string().default(''),
  messageLabel: z.string().default(''),
  messagePlaceholder: z.string().default(''),
  links: z.array(contactLinkSchema).default([]),
  infoCards: z.array(contactInfoCardSchema).default([]),
}).prefault({});

export type ContactConfig = z.infer<typeof contactConfigSchema>;

const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  footerNote: z.string().min(1),
  siteName: z.string().min(1),
  author: z.string().min(1),
  image: z.string().min(1),
  keywords: z.array(z.string().min(1)).min(1),
});

const writingSchema = z.object({
  enabled: z.boolean().default(true),
  title: z.string().default(''),
  eyebrow: z.string().default(''),
  description: z.string().default(''),
  readAllLabel: z.string().default(''),
}).prefault({});

const resumeSchema = z.object({
  href: z.string().min(1),
  label: z.string().min(1),
  headerLabel: z.string().min(1),
  note: z.string().min(1),
});

const commonSchema = z.object({
  homeLabel: z.string().min(1),
  blogLabel: z.string().min(1),
  languageLabel: z.string().min(1),
  themeLightLabel: z.string().min(1),
  themeDarkLabel: z.string().min(1),
  menuOpenLabel: z.string().min(1),
  menuCloseLabel: z.string().min(1),
  noPostsTitle: z.string().min(1),
  noPostsDescription: z.string().min(1),
  backToBlogLabel: z.string().min(1),
  updatedLabel: z.string().min(1),
  readPostLabel: z.string().min(1),
  readTimeSuffix: z.string().min(1),
  postContactTitle: z.string().min(1),
  postContactDescription: z.string().min(1),
  postContactCtaLabel: z.string().min(1),
  viewProjectLabel: z.string().min(1),
});

export const siteContentSchema = z.object({
  locale: localeSchema,
  seo: seoSchema,
  nav: z.array(navItemSchema).default([]),
  hero: heroSchema,
  about: aboutSchema,
  techStack: techStackSchema,
  experience: experienceSchema,
  featuredProject: featuredProjectSchema,
  projects: projectsSchema,
  writing: writingSchema,
  resume: resumeSchema,
  contact: contactConfigSchema,
  common: commonSchema,
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type HeroContent = SiteContent['hero'];
export type AboutContent = SiteContent['about'];
export type TechStackContent = SiteContent['techStack'];
export type ExperienceContent = SiteContent['experience'];
export type FeaturedProjectContent = SiteContent['featuredProject'];
export type ProjectsContent = SiteContent['projects'];
export type WritingContent = SiteContent['writing'];
export type ResumeContent = SiteContent['resume'];

export const parseSiteContent = (content: unknown): SiteContent => {
  const result = siteContentSchema.safeParse(content);

  if (result.success) {
    return result.data;
  }

  throw new Error(`Invalid site content: ${formatZodIssues(result.error.issues)}`);
};