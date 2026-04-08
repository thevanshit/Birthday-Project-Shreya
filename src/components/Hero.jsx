import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { config } from '../data/config';

const LetterAnimation = ({ text }) => {
  const letters = text.split('');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.2, 0, 0, 1],
      },
    },
  };

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="visible"
      className="font-sans text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight inline-block"
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={letterVariant} className="inline-block">
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.h1>
  );
};

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative">
      <div className="space-y-2">
        <LetterAnimation text={config.name} />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5, ease: 'easeOut' }}
        className="mt-6 text-text-secondary text-lg sm:text-xl font-light tracking-wide"
      >
        {config.subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2 }}
        className="absolute bottom-12"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-text-tertiary"
        >
          <ChevronDown size={32} strokeWidth={1} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
