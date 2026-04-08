import { motion } from 'framer-motion';
import { Play, Calendar } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const MediaCard = ({ item, isSelected, onClick, index }) => {
  const isVideo = item.type === 'video';

  return (
    <motion.button
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: 'easeOut'
      }}
      onClick={onClick}
      className={`relative group flex-shrink-0 w-[300px] sm:w-[350px] md:w-[400px] aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-accent scale-[1.02]' 
          : 'hover:scale-[1.02] hover:shadow-2xl'
      }`}
      style={{
        boxShadow: isSelected 
          ? '0 0 40px rgba(212, 165, 116, 0.3)' 
          : '0 4px 20px rgba(0, 0, 0, 0.4)'
      }}
    >
      {isVideo ? (
        <>
          <video
            src={item.src}
            className="w-full h-full object-cover"
            preload="metadata"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Play size={24} fill="#F5F5F5" color="#F5F5F5" />
            </div>
          </div>
        </>
      ) : (
        <img
          src={item.src}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full flex items-center gap-1.5">
        <Calendar size={12} />
        <span className="text-xs font-mono text-text-secondary">
          {formatDate(item.date)}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
        <h3 className="font-display text-lg text-text-primary">
          {item.title}
        </h3>
      </div>
    </motion.button>
  );
};

export default MediaCard;
