import { motion } from 'framer-motion';
import { Calendar, Image } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { useStory } from '../context/StoryContext';

const MediaThumbnail = ({ item, className = "" }) => {
  const { getMediaUrl } = useStory();
  const url = item ? getMediaUrl(item) : null;

  if (!url) {
    return (
      <div className={`relative overflow-hidden ${className} bg-surface flex items-center justify-center`}>
        <Image size={24} className="text-text-tertiary" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={url}
        alt="Memory"
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};

const MediaGrid = ({ media, onClick }) => {
  if (!media || media.length === 0) {
    return (
      <div className="w-full h-full bg-surface flex items-center justify-center">
        <Image size={32} className="text-text-tertiary" />
      </div>
    );
  }

  const count = media.length;
  
  if (count === 1) {
    return <div onClick={onClick} className="cursor-pointer"><MediaThumbnail item={media[0]} className="w-full h-full" /></div>;
  }
  
  if (count === 2) {
    return (
      <div className="w-full h-full grid grid-cols-2 gap-1">
        <div onClick={onClick} className="cursor-pointer"><MediaThumbnail item={media[0]} className="h-full" /></div>
        <div onClick={onClick} className="cursor-pointer"><MediaThumbnail item={media[1]} className="h-full" /></div>
      </div>
    );
  }
  
  if (count === 3) {
    return (
      <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1">
        <div onClick={onClick} className="cursor-pointer col-span-1 row-span-2 h-full"><MediaThumbnail item={media[0]} className="h-full" /></div>
        <div onClick={onClick} className="cursor-pointer h-full"><MediaThumbnail item={media[1]} className="h-full" /></div>
        <div onClick={onClick} className="cursor-pointer h-full"><MediaThumbnail item={media[2]} className="h-full" /></div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1">
      <div onClick={onClick} className="cursor-pointer h-full"><MediaThumbnail item={media[0]} className="h-full" /></div>
      <div onClick={onClick} className="cursor-pointer h-full"><MediaThumbnail item={media[1]} className="h-full" /></div>
      <div className="relative h-full cursor-pointer" onClick={onClick}>
        <MediaThumbnail item={media[2]} className="h-full" />
        {count > 3 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-2xl font-semibold">+{count - 3}</span>
          </div>
        )}
      </div>
      <div className="relative h-full cursor-pointer" onClick={onClick}>
        <MediaThumbnail item={media[Math.min(3, count - 1)]} className="h-full" />
        {count === 4 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-2xl font-semibold">+0</span>
          </div>
        )}
      </div>
    </div>
  );
};

const MediaCard = ({ item, isSelected, onClick, index }) => {
  const totalCount = item.media?.length || 0;

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
      className={`relative group flex-shrink-0 w-[350px] sm:w-[400px] md:w-[500px] aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-accent scale-[1.02]' 
          : 'hover:scale-[1.02]'
      }`}
      style={{
        boxShadow: isSelected 
          ? '0 0 60px rgba(212, 165, 116, 0.4)' 
          : '0 8px 32px rgba(0, 0, 0, 0.5)'
      }}
    >
      <MediaGrid media={item.media || []} onClick={onClick} />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-2">
        <Calendar size={12} className="text-accent" />
        <span className="text-xs font-mono text-text-secondary">
          {formatDate(item.date) || 'No date'}
        </span>
      </div>

      {totalCount > 1 && (
        <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-2">
          <Image size={12} className="text-accent" />
          <span className="text-xs font-mono text-text-secondary">
            {totalCount}
          </span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
        <h3 className="font-display text-xl text-text-primary font-medium">
          {item.title}
        </h3>
        {totalCount > 1 && (
          <p className="text-text-secondary text-sm mt-1">
            {totalCount} {totalCount === 1 ? 'photo' : 'photos'}
          </p>
        )}
      </div>
    </motion.button>
  );
};

export default MediaCard;