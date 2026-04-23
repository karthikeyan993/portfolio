import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowDownRight,
  Github,
  Linkedin,
  Mail,
  type LucideIcon,
} from 'lucide-react';
import type { HeroContent, SocialPlatform } from '@/content/site-content.schema';

interface HeroProps {
  content: HeroContent;
}

const socialIconMap: Record<SocialPlatform, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
};

const Hero = ({ content }: HeroProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const titles = useMemo(() => content.titles, [content.titles]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % titles.length);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [titles.length]);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl w-full"
      >
        <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <motion.div
            className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center"
            >
              <div className="relative">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-gradient-to-br from-primary to-secondary opacity-20"
                    style={{
                      width: 60 + i * 40,
                      height: 60 + i * 40,
                      top: -i * 15,
                      left: -i * 15,
                    }}
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 8 + i * 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                ))}

                <motion.div
                  className="w-48 h-48 md:w-56 md:h-56 rounded-2xl bg-gradient-to-br from-[#1F2937] to-[#374151] flex items-center justify-center relative z-10"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-5xl md:text-6xl font-bold gradient-text">
                    {content.initials}
                  </span>
                </motion.div>
              </div>
            </motion.div>

            <div className="text-center md:text-left">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-secondary font-semibold mb-2"
              >
                {content.greeting}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-4xl md:text-6xl font-bold text-gray-900 mb-4"
              >
                {content.name}
              </motion.h1>

              <div className="h-12 mb-6">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl md:text-3xl gradient-text font-semibold"
                  >
                    {titles[currentIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-gray-600 mb-8 max-w-md"
              >
                {content.summary}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="flex flex-wrap gap-4 justify-center md:justify-start"
              >
                <a
                  href={content.ctaHref}
                  className="glass-button-primary flex items-center gap-2"
                >
                  {content.ctaLabel}
                  <ArrowDownRight size={20} />
                </a>

                <div className="flex gap-3">
                  {content.socialLinks.map(({ platform, href, label }) => {
                    const Icon = socialIconMap[platform];

                    return (
                      <motion.a
                        key={platform}
                        href={href}
                        aria-label={label}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="social-circle"
                      >
                        <Icon size={20} className="text-primary" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gray-400 text-sm"
            >
              {content.scrollLabel} ↓
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
