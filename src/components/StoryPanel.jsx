import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Trash2, Calendar, Image, Loader2 } from 'lucide-react';
import { useStory } from '../context/StoryContext';
import { formatFullDate } from '../utils/helpers';
import MediaCarousel from './MediaCarousel';

const StoryPanel = () => {
  const { 
    selectedItem, 
    isPanelOpen, 
    closePanel, 
    openModal, 
    removeItem,
    selectedMediaIndex,
    setMediaIndex
  } = useStory();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [closePanel]);

  useEffect(() => {
    if (isPanelOpen) {
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      setShowDeleteConfirm(false);
    }
  }, [isPanelOpen]);

  const handleDelete = () => {
    if (selectedItem) {
      removeItem(selectedItem.id);
    }
  };

  if (!selectedItem) return null;

  const mediaCount = selectedItem.media?.length || 0;

  return (
    <AnimatePresence>
      {isPanelOpen && selectedItem && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closePanel}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[600px] md:w-[700px] bg-surface border-l border-border z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-surface/95 backdrop-blur-md border-b border-border z-10">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-accent" />
                    <span className="text-sm font-mono text-accent">
                      {formatFullDate(selectedItem.date) || 'No date'}
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
                <button
                  onClick={closePanel}
                  className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {isLoading ? (
                <div className="aspect-[16/9] bg-surface rounded-2xl flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 size={32} className="text-accent animate-spin" />
                    <span className="text-text-secondary text-sm">Loading...</span>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <MediaCarousel 
                    media={selectedItem.media || []}
                    currentIndex={selectedMediaIndex}
                    onIndexChange={setMediaIndex}
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <h2 className="font-display text-2xl sm:text-3xl">
                  {selectedItem.title}
                </h2>
                <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {selectedItem.story}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-4 border-t border-border"
              >
                {showDeleteConfirm ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-text-secondary">Delete this memory?</span>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-surface-hover transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-3 py-1.5 text-sm bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openModal(selectedItem)}
                      className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-surface-hover transition-colors text-sm"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-2 px-4 py-2 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors text-sm text-red-400"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StoryPanel;