import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Film, Image } from 'lucide-react';
import { useStory } from '../context/StoryContext';

const MediaCarousel = ({ media = [], currentIndex = 0, onIndexChange }) => {
  const { getMediaUrl } = useStory();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const currentMedia = media[currentIndex];
  const currentUrl = currentMedia ? getMediaUrl(currentMedia) : null;
  const isVideo = currentMedia?.type === 'video';

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  }, [currentIndex, onIndexChange]);

  const goToNext = useCallback(() => {
    if (currentIndex < media.length - 1) {
      onIndexChange(currentIndex + 1);
    }
  }, [currentIndex, media.length, onIndexChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') setLightboxOpen(false);
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, goToPrevious, goToNext]);

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      goToNext();
    } else if (distance < -minSwipeDistance) {
      goToPrevious();
    }
  };

  if (media.length === 0 || !currentMedia) {
    return null;
  }

  const CarouselContent = ({ className = "" }) => (
    <div 
      className={`relative ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative aspect-[4/3] bg-surface rounded-xl overflow-hidden cursor-pointer"
          onClick={() => setLightboxOpen(true)}
        >
          {isVideo ? (
            <video
              src={currentUrl}
              className="w-full h-full object-contain"
              controls
              playsInline
            />
          ) : (
            <img
              src={currentUrl}
              alt={`Memory ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {media.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            disabled={currentIndex === 0}
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-black/70 ${
              currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            disabled={currentIndex === media.length - 1}
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-black/70 ${
              currentIndex === media.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {media.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {media.map((_, idx) => (
            <button
              key={idx}
              onClick={() => onIndexChange(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'bg-accent w-6' 
                  : 'bg-border hover:bg-text-tertiary'
              }`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Strip */}
      {media.length > 1 && (
        <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
          {media.map((item, idx) => {
            const url = getMediaUrl(item);
            const isVid = item.type === 'video';
            
            return (
              <button
                key={idx}
                onClick={() => onIndexChange(idx)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                  idx === currentIndex 
                    ? 'ring-2 ring-accent scale-105' 
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                {isVid ? (
                  <>
                    <video src={url} className="w-full h-full object-cover" muted />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Film size={12} className="text-white" />
                    </div>
                  </>
                ) : (
                  <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  // Lightbox Modal
  if (lightboxOpen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
        onClick={() => setLightboxOpen(false)}
      >
        <button
          onClick={() => setLightboxOpen(false)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
        >
          <X size={20} className="text-white" />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
          disabled={currentIndex === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-30"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>

        <motion.img
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          src={currentUrl}
          alt={`Memory ${currentIndex + 1}`}
          className="max-w-[90vw] max-h-[90vh] object-contain"
          onClick={(e) => e.stopPropagation()}
        />

        <button
          onClick={(e) => { e.stopPropagation(); goToNext(); }}
          disabled={currentIndex === media.length - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-30"
        >
          <ChevronRight size={24} className="text-white" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
          {media.map((item, idx) => {
            const isVid = item.type === 'video';
            return (
              <button
                key={idx}
                onClick={() => onIndexChange(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            );
          })}
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white/60 text-sm">
          {isVideo ? <Film size={16} /> : <Image size={16} />}
          <span>{currentIndex + 1} / {media.length}</span>
        </div>
      </motion.div>
    );
  }

  return <CarouselContent className="group" />;
};

export default MediaCarousel;
