import { motion } from 'framer-motion';
import type { TechStackContent } from '@/content/site-content.schema';
import SectionHeading from '@/ui/SectionHeading';

interface TechStackProps {
  content: TechStackContent;
}

const TechStack = ({ content }: TechStackProps) => {
  return (
    <section id="tech-stack" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading title={content.title} />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {content.categories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.15 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.techs.map((tech) => (
                  <span key={tech} className="tech-badge text-sm text-gray-700">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
