import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Heart } from 'lucide-react';
import { useStory } from '../context/StoryContext';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { openModal, items } = useStory();
  const itemsWithDate = items.filter(item => item.date);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg/95 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart size={20} className="text-accent fill-accent" />
          <span className="text-text-tertiary text-sm font-mono hidden sm:block">
            {itemsWithDate.length} {itemsWithDate.length === 1 ? 'memory' : 'memories'}
          </span>
        </div>

        <button
          onClick={() => openModal()}
          className="group flex items-center gap-2 px-4 py-2 bg-accent text-bg rounded-lg font-medium text-sm transition-all duration-200 hover:bg-accent/90 hover:scale-105 active:scale-95"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span className="hidden sm:inline">Add Memory</span>
        </button>
      </div>
    </motion.header>
  );
};

export default Header;