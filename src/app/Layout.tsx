import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background orbs */}
      <motion.div
        className="orb w-72 h-72 bg-primary/20 -top-20 -left-20"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="orb w-96 h-96 bg-secondary/20 top-1/3 -right-32"
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="orb w-64 h-64 bg-accent/15 bottom-20 left-1/4"
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default Layout;
