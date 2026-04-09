import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Image, Maximize2, Loader2 } from 'lucide-react';
import { useStory } from '../context/StoryContext';

const MediaCarousel = ({ media = [], currentIndex = 0, onIndexChange }) => {
  const { getMediaUrl } = useStory();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentMedia = media[currentIndex];
  const currentUrl = currentMedia ? getMediaUrl(currentMedia) : null;

  useEffect(() => {
    if (currentUrl) {
      const img = new Image();
      img.onload = () => setIsLoading(false);
      img.onerror = () => setIsLoading(false);
      img.src = currentUrl;
    } else {
      setIsLoading(false);
    }
  }, [currentUrl]);

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
          className="relative aspect-[16/9] bg-surface rounded-2xl overflow-hidden cursor-pointer"
          onClick={() => currentUrl && setLightboxOpen(true)}
        >
          {isLoading || !currentUrl ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={32} className="text-accent animate-spin" />
                <span className="text-text-secondary text-sm">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <img
                src={currentUrl}
                alt={`Memory ${currentIndex + 1}`}
                className="w-full h-full object-contain bg-black"
              />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <Maximize2 size={24} className="text-white" />
                </div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {media.length > 1 && !isLoading && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            disabled={currentIndex === 0}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center transition-all hover:bg-black/80 ${
              currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeft size={22} className="text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            disabled={currentIndex === media.length - 1}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center transition-all hover:bg-black/80 ${
              currentIndex === media.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            <ChevronRight size={22} className="text-white" />
          </button>
        </>
      )}

      {media.length > 1 && !isLoading && (
        <div className="flex justify-center gap-2 mt-5">
          {media.map((_, idx) => (
            <button
              key={idx}
              onClick={() => onIndexChange(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'bg-accent w-8' 
                  : 'bg-border/50 w-4 hover:bg-text-tertiary'
              }`}
            />
          ))}
        </div>
      )}

      {media.length > 1 && !isLoading && (
        <div className="flex justify-center gap-3 mt-4 overflow-x-auto pb-2">
          {media.map((item, idx) => {
            const url = getMediaUrl(item);
            
            return (
              <button
                key={idx}
                onClick={() => onIndexChange(idx)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-200 ${
                  idx === currentIndex 
                    ? 'ring-2 ring-accent scale-105' 
                    : 'opacity-50 hover:opacity-100 hover:scale-105'
                }`}
              >
                {url ? (
                  <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-surface flex items-center justify-center">
                    <Image size={16} className="text-text-tertiary" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  if (lightboxOpen && currentUrl) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center"
        onClick={() => setLightboxOpen(false)}
      >
        <button
          onClick={() => setLightboxOpen(false)}
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
        >
          <X size={24} className="text-white" />
        </button>

        {media.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              disabled={currentIndex === 0}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-30"
            >
              <ChevronLeft size={28} className="text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              disabled={currentIndex === media.length - 1}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-30"
            >
              <ChevronRight size={28} className="text-white" />
            </button>
          </>
        )}

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

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 bg-white/10 rounded-full backdrop-blur-md">
          {media.map((item, idx) => {
            return (
              <button
                key={idx}
                onClick={() => onIndexChange(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            );
          })}
        </div>

        <div className="absolute bottom-6 right-6 flex items-center gap-3 text-white/70 text-sm font-mono">
          <Image size={18} />
          <span>{currentIndex + 1} / {media.length}</span>
        </div>
      </motion.div>
    );
  }

  return <CarouselContent className="group" />;
};

export default MediaCarousel;