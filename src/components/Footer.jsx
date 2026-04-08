import { motion } from 'framer-motion';
import { config } from '../data/config';

const Footer = () => {
  return (
    <footer className="py-16 text-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        <div className="w-px h-12 bg-border mx-auto" />
        <p className="text-text-tertiary text-sm">
          Made with care for {config.name}
        </p>
        <p className="text-text-tertiary text-xs font-mono">
          Since {config.sinceDate}
        </p>
      </motion.div>
    </footer>
  );
};

export default Footer;
