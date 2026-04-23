import AppShell from '@/app/AppShell';
import { siteContent } from '@/content/site-content';
import About from '@/sections/About';
import Contact from '@/sections/Contact';
import Experience from '@/sections/Experience';
import FeaturedProject from '@/sections/FeaturedProject';
import Hero from '@/sections/Hero';
import Projects from '@/sections/Projects';
import TechStack from '@/sections/TechStack';

function App() {
  return (
    <AppShell
      brandName={siteContent.hero.name}
      navItems={siteContent.nav}
      headerCtaLabel={siteContent.hero.ctaLabel}
      headerCtaHref={siteContent.hero.ctaHref}
      footerNote={siteContent.seo.footerNote}
    >
      <Hero content={siteContent.hero} />
      <About content={siteContent.about} />
      <TechStack content={siteContent.techStack} />
      <Experience content={siteContent.experience} />
      <FeaturedProject content={siteContent.featuredProject} />
      <Projects content={siteContent.projects} />
      <Contact content={siteContent.contact} />
    </AppShell>
  );
}

export default App;
