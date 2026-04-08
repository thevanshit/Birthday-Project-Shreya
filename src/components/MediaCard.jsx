import { motion } from 'framer-motion';
import { Play, Calendar, Image, Film } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { useStory } from '../context/StoryContext';

const MediaThumbnail = ({ item, className = "" }) => {
  const { getMediaUrl } = useStory();
  const url = getMediaUrl(item);
  const isVideo = item.type === 'video';

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isVideo ? (
        <>
          <video
            src={url}
            className="w-full h-full object-cover"
            muted
            preload="metadata"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <Play size={14} fill="#F5F5F5" color="#F5F5F5" />
            </div>
          </div>
        </>
      ) : (
        <img
          src={url}
          alt="Memory"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
    </div>
  );
};

const MediaGrid = ({ media }) => {
  const count = media.length;
  
  if (count === 1) {
    return <MediaThumbnail item={media[0]} className="w-full h-full" />;
  }
  
  if (count === 2) {
    return (
      <div className="w-full h-full grid grid-cols-2 gap-0.5">
        <MediaThumbnail item={media[0]} className="col-span-1 h-full" />
        <MediaThumbnail item={media[1]} className="col-span-1 h-full" />
      </div>
    );
  }
  
  if (count === 3) {
    return (
      <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5">
        <MediaThumbnail item={media[0]} className="col-span-1 row-span-2 h-full" />
        <MediaThumbnail item={media[1]} className="col-span-1 h-full" />
        <MediaThumbnail item={media[2]} className="col-span-1 h-full" />
      </div>
    );
  }
  
  // 4 or more - show 2x2 grid with +X overlay
  return (
    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5">
      <MediaThumbnail item={media[0]} className="h-full" />
      <MediaThumbnail item={media[1]} className="h-full" />
      <div className="relative h-full">
        <MediaThumbnail item={media[2]} className="h-full" />
        {count > 3 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-xl font-medium">+{count - 3}</span>
          </div>
        )}
      </div>
      <div className="relative h-full">
        <MediaThumbnail item={media[Math.min(3, count - 1)]} className="h-full" />
        {count === 4 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-xl font-medium">+0</span>
          </div>
        )}
      </div>
    </div>
  );
};

const MediaCard = ({ item, isSelected, onClick, index }) => {
  const hasVideo = item.media?.some(m => m.type === 'video');
  const hasImages = item.media?.some(m => m.type === 'image');
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
      className={`relative group flex-shrink-0 w-[300px] sm:w-[350px] md:w-[400px] aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-accent scale-[1.02]' 
          : 'hover:scale-[1.02]'
      }`}
      style={{
        boxShadow: isSelected 
          ? '0 0 40px rgba(212, 165, 116, 0.3)' 
          : '0 4px 20px rgba(0, 0, 0, 0.4)'
      }}
    >
      <MediaGrid media={item.media || []} />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full flex items-center gap-1.5">
        <Calendar size={12} />
        <span className="text-xs font-mono text-text-secondary">
          {formatDate(item.date)}
        </span>
      </div>

      {totalCount > 1 && (
        <div className="absolute top-4 right-4 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full flex items-center gap-1">
          {hasVideo && <Film size={12} className="text-accent" />}
          {hasImages && <Image size={12} className="text-accent" />}
          <span className="text-xs font-mono text-text-secondary">
            {totalCount}
          </span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
        <h3 className="font-display text-lg text-text-primary">
          {item.title}
        </h3>
      </div>
    </motion.button>
  );
};

export default MediaCard;
