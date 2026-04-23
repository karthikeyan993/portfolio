import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Mail,
  MapPin,
  Linkedin,
  Github,
  type LucideIcon,
} from 'lucide-react';
import type { ContactConfig } from '@/content/site-content.schema';
import SectionHeading from '@/ui/SectionHeading';

interface ContactProps {
  content: ContactConfig;
}

const infoCardIconMap: Record<'mail' | 'mapPin', LucideIcon> = {
  mail: Mail,
  mapPin: MapPin,
};

const contactLinkIconMap: Record<'email' | 'linkedin' | 'github', LucideIcon> = {
  email: Mail,
  linkedin: Linkedin,
  github: Github,
};

const Contact = ({ content }: ContactProps) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading title={content.title} />
          <p className="text-gray-600 mb-8 max-w-xl">{content.description}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl p-8"
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4" aria-hidden="true">
                  🎉
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {content.successTitle}
                </h3>
                <p className="text-gray-600">{content.successMessage}</p>
              </div>
            ) : content.formEnabled ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder={content.email}
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <button
                  type="submit"
                  className="glass-button-primary w-full flex items-center justify-center gap-2"
                >
                  {content.submitLabel} <Send size={18} />
                </button>
              </form>
            ) : (
              <p className="text-gray-600">Contact form is currently disabled.</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-4"
          >
            {content.infoCards.map(({ icon, label, value, href }) => {
              const Icon = infoCardIconMap[icon];

              return (
                <div
                  key={`${label}-${value}`}
                  className="glass-card rounded-xl p-5 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="font-semibold text-gray-900 hover:text-primary transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-semibold text-gray-900">{value}</p>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="glass-card rounded-xl p-5 flex gap-3">
              {content.links.map(({ platform, href, label }) => {
                const Icon = contactLinkIconMap[platform];

                return (
                  <a
                    key={platform}
                    href={href}
                    aria-label={label}
                    className="social-circle"
                  >
                    <Icon size={18} className="text-primary" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
