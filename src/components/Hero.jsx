import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { config } from '../data/config';

const Sparkle = ({ delay, left, top, size = 2 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
    className="absolute rounded-full bg-accent"
    style={{
      left: `${left}%`,
      top: `${top}%`,
      width: size,
      height: size,
      boxShadow: `0 0 ${size * 3}px rgba(212, 165, 116, 0.8)`,
    }}
  />
);

const Sparkles = () => {
  const sparkles = [
    { delay: 0.5, left: 10, top: 30, size: 3 },
    { delay: 1, left: 20, top: 20, size: 2 },
    { delay: 1.5, left: 80, top: 25, size: 3 },
    { delay: 2, left: 90, top: 40, size: 2 },
    { delay: 0.8, left: 5, top: 60, size: 2 },
    { delay: 1.2, left: 95, top: 55, size: 3 },
    { delay: 0.3, left: 30, top: 15, size: 2 },
    { delay: 1.8, left: 70, top: 10, size: 3 },
    { delay: 2.2, left: 50, top: 5, size: 2 },
    { delay: 0.7, left: 15, top: 70, size: 3 },
    { delay: 1.3, left: 85, top: 75, size: 2 },
    { delay: 2.5, left: 45, top: 85, size: 3 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((s, i) => (
        <Sparkle key={i} {...s} />
      ))}
    </div>
  );
};

const LetterAnimation = ({ text }) => {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
      },
    },
  };

  const letterVariant = {
    hidden: { 
      opacity: 0, 
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="visible"
      className="font-display text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-semibold tracking-[0.15em] inline-block"
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-4">
          {word.split('').map((letter, letterIndex) => (
            <motion.span
              key={letterIndex}
              variants={letterVariant}
              className="inline-block"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  textShadow: [
                    '0 0 0px rgba(212, 165, 116, 0)',
                    '0 0 15px rgba(212, 165, 116, 0.4)',
                    '0 0 8px rgba(212, 165, 116, 0.2)',
                  ],
                }}
                transition={{
                  duration: 1.2,
                  delay: (wordIndex * word.length + letterIndex) * 0.03 + 0.5,
                }}
              >
                {letter}
              </motion.span>
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h1>
  );
};

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden py-20">
      {/* Background glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-[400px] h-[120px] bg-gradient-radial from-accent/30 via-accent/10 to-transparent blur-[60px]"
        />
      </motion.div>

      {/* Floating animation wrapper */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10"
      >
        <Sparkles />
        <LetterAnimation text={config.name} />
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8, ease: 'easeOut' }}
        className="mt-6 text-text-secondary text-base sm:text-lg font-light tracking-[0.25em] uppercase"
      >
        {config.subtitle}
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.2 }}
        className="absolute bottom-10"
      >
        <motion.div
          animate={{ 
            y: [0, 12, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ 
            y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="text-text-tertiary"
        >
          <ChevronDown size={24} strokeWidth={1} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;