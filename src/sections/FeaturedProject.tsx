import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import type { FeaturedProjectContent } from '@/content/site-content.schema';
import SectionHeading from '@/ui/SectionHeading';

interface FeaturedProjectProps {
  content: FeaturedProjectContent;
}

const FeaturedProject = ({ content }: FeaturedProjectProps) => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading title={content.sectionTitle} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-3xl p-8 md:p-10"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-video flex items-center justify-center">
              <span className="text-gray-400 text-lg">{content.previewLabel}</span>
            </div>

            <div>
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                {content.badge}
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mt-1 mb-3">
                {content.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">{content.summary}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {content.tags.map((tech) => (
                  <span key={tech} className="tech-badge text-xs text-gray-600">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                {content.links.live ? (
                  <a
                    href={content.links.live}
                    className="glass-button-primary flex items-center gap-2 text-sm"
                  >
                    Live Demo <ExternalLink size={16} />
                  </a>
                ) : null}
                {content.links.source ? (
                  <a
                    href={content.links.source}
                    className="glass-button-secondary flex items-center gap-2 text-sm"
                  >
                    Source <Github size={16} />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProject;
