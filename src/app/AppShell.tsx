import { useEffect, useState, type ReactNode } from 'react';
import Layout from './Layout';
import type { NavItem } from '@/content/site-content.schema';

interface AppShellProps {
  brandName: string;
  navItems: NavItem[];
  headerCtaLabel: string;
  headerCtaHref: string;
  footerNote: string;
  children: ReactNode;
}

const AppShell = ({
  brandName,
  navItems,
  headerCtaLabel,
  headerCtaHref,
  footerNote,
  children,
}: AppShellProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Layout>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-lg py-2 shadow-sm'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex items-center justify-between">
            <div className="text-2xl font-bold gradient-text">{brandName}</div>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <a
              href={headerCtaHref}
              className="glass-button-primary px-6 py-2 rounded-full font-medium"
            >
              {headerCtaLabel}
            </a>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="py-12 px-4 border-t border-gray-200/50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 mb-4">
            {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">{footerNote}</p>
        </div>
      </footer>
    </Layout>
  );
};

export default AppShell;
