import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useStory } from '../context/StoryContext';
import MediaUploader from './MediaUploader';

const AddModal = () => {
  const { isModalOpen, editingItem, closeModal, saveItem } = useStory();
  const [formData, setFormData] = useState({
    media: null,
    title: '',
    story: '',
    date: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingItem) {
      setFormData({
        media: { src: editingItem.src, type: editingItem.type },
        title: editingItem.title,
        story: editingItem.story,
        date: editingItem.date
      });
    } else {
      setFormData({ media: null, title: '', story: '', date: '' });
    }
    setErrors({});
  }, [editingItem, isModalOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isModalOpen, closeModal]);

  const validate = () => {
    const newErrors = {};
    if (!formData.media) newErrors.media = 'Please add an image or video';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length > 100) newErrors.title = 'Title must be under 100 characters';
    if (!formData.story.trim()) newErrors.story = 'Story is required';
    if (formData.story.length > 2000) newErrors.story = 'Story must be under 2000 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    saveItem({
      src: formData.media.src,
      type: formData.media.type,
      title: formData.title.trim(),
      story: formData.story.trim(),
      date: formData.date || null
    });
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-surface border border-border rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-surface/95 backdrop-blur-md border-b border-border z-10">
              <div className="flex items-center justify-between p-5">
                <h2 className="font-display text-xl">
                  {editingItem ? 'Edit Memory' : 'Add Memory'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">
                  Photo or Video
                </label>
                <MediaUploader
                  value={formData.media}
                  onChange={(media) => {
                    setFormData(prev => ({ ...prev, media }));
                    if (errors.media) setErrors(prev => ({ ...prev, media: null }));
                  }}
                  error={errors.media}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, title: e.target.value }));
                    if (errors.title) setErrors(prev => ({ ...prev, title: null }));
                  }}
                  placeholder="Give this memory a title..."
                  className={`w-full px-4 py-3 bg-bg border rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors ${
                    errors.title ? 'border-red-500' : 'border-border focus:border-accent'
                  }`}
                />
                {errors.title && (
                  <p className="text-red-400 text-sm">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">
                  Date (optional)
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">
                  The Story
                </label>
                <textarea
                  value={formData.story}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, story: e.target.value }));
                    if (errors.story) setErrors(prev => ({ ...prev, story: null }));
                  }}
                  placeholder="What makes this moment special?"
                  rows={5}
                  className={`w-full px-4 py-3 bg-bg border rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors resize-none ${
                    errors.story ? 'border-red-500' : 'border-border focus:border-accent'
                  }`}
                />
                <div className="flex justify-between">
                  {errors.story && (
                    <p className="text-red-400 text-sm">{errors.story}</p>
                  )}
                  <p className={`text-sm ml-auto ${formData.story.length > 1800 ? 'text-yellow-400' : 'text-text-tertiary'}`}>
                    {formData.story.length}/2000
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 border border-border rounded-lg hover:bg-surface-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-accent text-bg rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                  {editingItem ? 'Save Changes' : 'Add Memory'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddModal;
