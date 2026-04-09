import { useEffect } from 'react';
import { X, Calendar, Image, FileText } from 'lucide-react';
import { useStory } from '../context/StoryContext';
import MediaCarousel from './MediaCarousel';

const StoryPanel = () => {
  const { 
    selectedItem, 
    isPanelOpen, 
    closePanel,
    selectedMediaIndex,
    setMediaIndex
  } = useStory();
  useEffect(() => {
    if (isPanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isPanelOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closePanel();
    };
    if (isPanelOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isPanelOpen, closePanel]);

  if (!isPanelOpen) return null;

  const mediaCount = selectedItem?.media?.length || 0;
  const hasMedia = mediaCount > 0;

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'No date';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-surface rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closePanel}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <X size={20} className="text-white" />
        </button>

        <div className="overflow-y-auto max-h-[90vh]">
          {hasMedia && (
            <div className="relative">
              <MediaCarousel 
                media={selectedItem.media || []}
                currentIndex={selectedMediaIndex}
                onIndexChange={setMediaIndex}
              />
            </div>
          )}

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-accent" />
                  <span className="text-sm font-mono text-accent">
                    {formatDate(selectedItem.date)}
                  </span>
                </div>
                {mediaCount > 1 && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-surface-hover rounded-full">
                    <Image size={12} className="text-text-secondary" />
                    <span className="text-xs text-text-secondary">
                      {mediaCount} photos
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl sm:text-3xl text-text-primary">
                {selectedItem.title || 'Untitled Memory'}
              </h2>
              
              {selectedItem.story ? (
                <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {selectedItem.story}
                </p>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-surface-hover rounded-xl text-text-tertiary">
                  <FileText size={20} />
                  <span>No story written for this memory yet.</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPanel;
