import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Image, ChevronDown } from 'lucide-react';
import MediaCard from './MediaCard';
import EmptyState from './EmptyState';
import { useStory } from '../context/StoryContext';

const formatMonthYear = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const Timeline = () => {
  const { items, selectedId, selectItem } = useStory();

  const itemsWithDate = items.filter(item => item.date);
  const itemsWithoutDate = items.filter(item => !item.date);

  if (itemsWithDate.length === 0) {
    return <EmptyState />;
  }

  const sortedItems = [...itemsWithDate].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });

  const groupedByMonth = sortedItems.reduce((groups, item) => {
    const monthYear = formatMonthYear(item.date);
    if (!monthYear) return groups;
    
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(item);
    return groups;
  }, {});

  const months = Object.keys(groupedByMonth);

  return (
    <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <h2 className="font-display text-2xl sm:text-3xl text-center">The Timeline</h2>
        <p className="text-text-secondary mt-2 text-sm text-center">Scroll down to explore our journey</p>
      </motion.div>

      <div className="space-y-16">
        {months.map((month, monthIndex) => {
          const monthItems = groupedByMonth[month];
          
          return (
            <motion.div
              key={month}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: monthIndex * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Calendar size={20} className="text-accent" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-text-primary">
                  {month}
                </h3>
                <div className="flex-grow h-px bg-gradient-to-r from-border to-transparent" />
                <span className="text-text-tertiary text-sm font-mono">
                  {monthItems.length} {monthItems.length === 1 ? 'memory' : 'memories'}
                </span>
              </div>

              <div className="space-y-4 ml-4 sm:ml-8 border-l-2 border-border/50 pl-6 sm:pl-8">
                {monthItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <MemoryCard 
                      item={item} 
                      isSelected={selectedId === item.id}
                      onClick={() => selectItem(item.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {itemsWithoutDate.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-text-tertiary text-sm">
            {itemsWithoutDate.length} {itemsWithoutDate.length === 1 ? 'memory' : 'memories'} without date not shown
          </p>
        </motion.div>
      )}
    </section>
  );
};

const MemoryCard = ({ item, isSelected, onClick }) => {
  const totalCount = item.media?.length || 0;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-accent shadow-lg shadow-accent/20' 
          : 'hover:shadow-lg hover:shadow-black/20'
      }`}
      style={{
        backgroundColor: '#141414',
      }}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-64 h-48 sm:h-40 flex-shrink-0">
          {item.media && item.media.length > 0 && (
            <div className="w-full h-full">
              <img 
                src={item.media[0].src} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {totalCount > 1 && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-1.5">
                  <Image size={12} className="text-accent" />
                  <span className="text-xs text-white font-mono">+{totalCount - 1}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} className="text-accent" />
            <span className="text-sm font-mono text-accent">
              {new Date(item.date).toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}
            </span>
          </div>
          
          <h4 className="font-display text-lg text-text-primary mb-2 line-clamp-1">
            {item.title}
          </h4>
          
          <p className="text-text-secondary text-sm line-clamp-2">
            {item.story}
          </p>
          
          {totalCount > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <div className="flex -space-x-2">
                {item.media.slice(0, 3).map((m, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-[#141414] overflow-hidden">
                    <img src={m.src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-xs text-text-tertiary">
                {totalCount} {totalCount === 1 ? 'photo' : 'photos'}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Timeline;