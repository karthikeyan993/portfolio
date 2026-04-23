import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import type { ProjectsContent } from '@/content/site-content.schema';
import SectionHeading from '@/ui/SectionHeading';

interface ProjectsProps {
  content: ProjectsContent;
}

const Projects = ({ content }: ProjectsProps) => {
  return (
    <section id="projects" className="py-24 px-4">
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
          {content.items.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="glass-card-hover rounded-2xl p-6 flex flex-col"
            >
              <div className="rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-video flex items-center justify-center mb-4">
                <span className="text-gray-400 text-sm">Preview</span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {project.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                {project.summary}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-1 rounded-md bg-primary/5 text-primary font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                {project.links.live ? (
                  <a
                    href={project.links.live}
                    className="text-sm text-gray-600 hover:text-primary flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink size={14} /> Demo
                  </a>
                ) : null}
                {project.links.source ? (
                  <a
                    href={project.links.source}
                    className="text-sm text-gray-600 hover:text-primary flex items-center gap-1 transition-colors"
                  >
                    <Github size={14} /> Code
                  </a>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
