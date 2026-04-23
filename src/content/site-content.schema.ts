import { z } from 'zod';
import { formatZodIssues } from '@/lib/validation';

export const navItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
});

export type NavItem = z.infer<typeof navItemSchema>;

export const socialPlatformSchema = z.enum(['github', 'linkedin', 'mail']);
export type SocialPlatform = z.infer<typeof socialPlatformSchema>;

const heroSocialLinkSchema = z.object({
  platform: socialPlatformSchema,
  href: z.string().min(1),
  label: z.string().min(1),
});

const heroSchema = z.object({
  greeting: z.string().min(1),
  name: z.string().min(1),
  initials: z.string().min(1),
  titles: z.array(z.string().min(1)).min(1),
  summary: z.string().min(1),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
  socialLinks: z.array(heroSocialLinkSchema).min(1),
  scrollLabel: z.string().min(1),
});

const aboutHighlightIconSchema = z.enum(['user', 'mapPin', 'languages']);
export type AboutHighlightIcon = z.infer<typeof aboutHighlightIconSchema>;

const aboutHighlightSchema = z.object({
  icon: aboutHighlightIconSchema,
  label: z.string().min(1),
  description: z.string().min(1),
});

const aboutSchema = z.object({
  title: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
  highlights: z.array(aboutHighlightSchema).min(1),
});

const techCategorySchema = z.object({
  title: z.string().min(1),
  techs: z.array(z.string().min(1)).min(1),
});

const techStackSchema = z.object({
  title: z.string().min(1),
  categories: z.array(techCategorySchema).min(1),
});

export const experienceItemSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1),
  location: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
});

export type ExperienceItem = z.infer<typeof experienceItemSchema>;

const experienceSchema = z.object({
  title: z.string().min(1),
  items: z.array(experienceItemSchema).min(1),
});

const projectLinkSchema = z.object({
  live: z.string().min(1).optional(),
  source: z.string().min(1).optional(),
});

export const projectItemSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  links: projectLinkSchema,
  featured: z.boolean(),
});

export type ProjectItem = z.infer<typeof projectItemSchema>;

const featuredProjectSchema = projectItemSchema.extend({
  sectionTitle: z.string().min(1),
  badge: z.string().min(1),
  previewLabel: z.string().min(1),
});

const projectsSchema = z.object({
  title: z.string().min(1),
  items: z.array(projectItemSchema).min(1),
});

const contactLinkPlatformSchema = z.enum(['email', 'linkedin', 'github']);

const contactLinkSchema = z.object({
  platform: contactLinkPlatformSchema,
  href: z.string().min(1),
  label: z.string().min(1),
});

const contactCardIconSchema = z.enum(['mail', 'mapPin']);

const contactInfoCardSchema = z.object({
  icon: contactCardIconSchema,
  label: z.string().min(1),
  value: z.string().min(1),
  href: z.string().min(1).optional(),
});

export const contactConfigSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  email: z.string().email(),
  location: z.string().min(1),
  formEnabled: z.boolean(),
  submitLabel: z.string().min(1),
  successTitle: z.string().min(1),
  successMessage: z.string().min(1),
  links: z.array(contactLinkSchema).min(1),
  infoCards: z.array(contactInfoCardSchema).min(1),
});

export type ContactConfig = z.infer<typeof contactConfigSchema>;

const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  footerNote: z.string().min(1),
});

export const siteContentSchema = z.object({
  seo: seoSchema,
  nav: z.array(navItemSchema).min(1),
  hero: heroSchema,
  about: aboutSchema,
  techStack: techStackSchema,
  experience: experienceSchema,
  featuredProject: featuredProjectSchema,
  projects: projectsSchema,
  contact: contactConfigSchema,
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type HeroContent = SiteContent['hero'];
export type AboutContent = SiteContent['about'];
export type TechStackContent = SiteContent['techStack'];
export type ExperienceContent = SiteContent['experience'];
export type FeaturedProjectContent = SiteContent['featuredProject'];
export type ProjectsContent = SiteContent['projects'];

export const parseSiteContent = (content: unknown): SiteContent => {
  const result = siteContentSchema.safeParse(content);

  if (result.success) {
    return result.data;
  }

  throw new Error(`Invalid site content: ${formatZodIssues(result.error.issues)}`);
};
