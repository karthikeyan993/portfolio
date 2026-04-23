import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import type { ExperienceContent } from '@/content/site-content.schema';
import SectionHeading from '@/ui/SectionHeading';

interface ExperienceProps {
  content: ExperienceContent;
}

const Experience = ({ content }: ExperienceProps) => {
  return (
    <section id="experience" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading title={content.title} />
        </motion.div>

        <div className="space-y-6">
          {content.items.map((experienceItem, index) => (
            <motion.div
              key={`${experienceItem.company}-${experienceItem.role}`}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="glass-card rounded-2xl p-6 flex gap-5"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0">
                <Briefcase size={22} className="text-primary" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {experienceItem.role}
                </h3>
                <p className="text-primary font-medium text-sm mb-1">
                  {experienceItem.company} · {experienceItem.period}
                </p>
                <p className="text-gray-500 text-sm mb-3">{experienceItem.location}</p>
                <ul className="text-gray-600 text-sm leading-relaxed list-disc list-inside space-y-1">
                  {experienceItem.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
