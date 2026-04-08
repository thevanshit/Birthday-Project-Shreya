import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MediaCard from './MediaCard';
import EmptyState from './EmptyState';
import { useStory } from '../context/StoryContext';

const Timeline = () => {
  const { items, selectedId, selectItem } = useStory();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, [items]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 420;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="px-6 mb-8 flex items-center justify-between"
      >
        <div>
          <h2 className="font-display text-2xl sm:text-3xl">The Timeline</h2>
          <p className="text-text-secondary mt-1 text-sm">Scroll to explore</p>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded-lg border border-border transition-all duration-200 ${
              canScrollLeft 
                ? 'hover:bg-surface-hover cursor-pointer' 
                : 'opacity-30 cursor-not-allowed'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded-lg border border-border transition-all duration-200 ${
              canScrollRight 
                ? 'hover:bg-surface-hover cursor-pointer' 
                : 'opacity-30 cursor-not-allowed'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-6 pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, index) => (
          <div key={item.id} className="snap-start">
            <MediaCard
              item={item}
              isSelected={selectedId === item.id}
              onClick={() => selectItem(item.id)}
              index={index}
            />
          </div>
        ))}
        <div className="flex-shrink-0 w-6" />
      </div>

      <div className="px-6 mt-4">
        <div className="flex justify-center gap-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => selectItem(item.id)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                selectedId === item.id 
                  ? 'bg-accent w-6' 
                  : 'bg-border hover:bg-text-tertiary'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
