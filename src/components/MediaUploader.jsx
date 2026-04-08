import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Link, X, Image, Film, AlertCircle } from 'lucide-react';
import { useStory } from '../context/StoryContext';
import { useMediaUpload } from '../hooks/useMediaUpload';

const MediaUploader = ({ value, onChange, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState('file');
  const [urlInput, setUrlInput] = useState('');
  const { uploadFile, uploadFromUrl, uploading, error: uploadError, setError } = useMediaUpload();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await uploadFile(file);
        onChange(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;
    try {
      const result = await uploadFromUrl(urlInput);
      onChange(result);
      setUrlInput('');
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      try {
        const result = await uploadFile(file);
        onChange(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    }
  }, [uploadFile, onChange, setError]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearMedia = () => {
    onChange(null);
  };

  if (value) {
    return (
      <div className="relative rounded-xl overflow-hidden bg-surface border border-border">
        {value.type === 'video' ? (
          <video src={value.src} className="w-full aspect-video object-cover" />
        ) : (
          <img src={value.src} alt="Preview" className="w-full aspect-video object-cover" />
        )}
        <button
          onClick={clearMedia}
          className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-surface rounded-lg">
        <button
          onClick={() => setMode('file')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors ${
            mode === 'file' ? 'bg-border text-text-primary' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Upload size={16} />
          Upload
        </button>
        <button
          onClick={() => setMode('url')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors ${
            mode === 'url' ? 'bg-border text-text-primary' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Link size={16} />
          URL
        </button>
      </div>

      {mode === 'file' ? (
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
            isDragging 
              ? 'border-accent bg-accent/10' 
              : error || uploadError
              ? 'border-red-500/50 bg-red-500/5'
              : 'border-border hover:border-accent/50 hover:bg-surface'
          }`}
        >
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full"
              />
              <span className="text-text-secondary text-sm">Processing...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-surface-hover flex items-center justify-center">
                <Image size={24} className="text-accent" />
              </div>
              <div className="text-center">
                <p className="text-text-primary font-medium">Drop media here</p>
                <p className="text-text-tertiary text-sm mt-1">or click to browse</p>
              </div>
              <p className="text-text-tertiary text-xs">PNG, JPG, MP4, WebM • Max 50MB</p>
            </div>
          )}
        </label>
      ) : (
        <div className="space-y-3">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image or video URL..."
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none transition-colors"
          />
          <button
            onClick={handleUrlSubmit}
            disabled={!urlInput.trim() || uploading}
            className="w-full py-3 bg-accent text-bg rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Loading...' : 'Use URL'}
          </button>
        </div>
      )}

      {(error || uploadError) && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={14} />
          {error || uploadError}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
