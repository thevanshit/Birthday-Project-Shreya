import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Link, X, Image, Plus, AlertCircle } from 'lucide-react';
import { useMediaUpload } from '../hooks/useMediaUpload';

const MediaItem = ({ item, onRemove, index }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="relative group"
    >
      <div 
        className="relative aspect-video bg-surface rounded-lg overflow-hidden border border-border cursor-pointer"
        onClick={() => setShowPreview(true)}
      >
        <img 
          src={item.src} 
          alt={item.name || `Photo ${index + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
      >
        <X size={14} className="text-white" />
      </button>

      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        <Image size={10} />
        <span>{index + 1}</span>
      </div>
    </motion.div>
  );
};

const MediaUploader = ({ value = [], onChange, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState('file');
  const [urlInput, setUrlInput] = useState('');
  const [uploadErrors, setUploadErrors] = useState([]);
  const fileInputRef = useRef(null);
  const { uploadFile, uploadMultiple, uploadFromUrl, uploading, progress, error: uploadError, setError } = useMediaUpload();

  const handleFilesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadErrors([]);

    if (files.length === 1) {
      try {
        const result = await uploadFile(files[0]);
        onChange([...value, result]);
        setError(null);
      } catch (err) {
        setUploadErrors([{ file: files[0].name, error: err.message }]);
      }
    } else {
      const { results, errors } = await uploadMultiple(files);
      onChange([...value, ...results]);
      setUploadErrors(errors);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;
    try {
      const result = await uploadFromUrl(urlInput);
      onChange([...value, result]);
      setUrlInput('');
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    setUploadErrors([]);

    const { results, errors } = await uploadMultiple(files);
    onChange([...value, ...results]);
    setUploadErrors(errors);
  }, [uploadMultiple, onChange, value]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = (id) => {
    onChange(value.filter(m => m.id !== id));
  };

  const handleAddMore = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Media List */}
      {value.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-secondary">
              Your Photos ({value.length})
            </label>
            <button
              onClick={handleAddMore}
              disabled={uploading}
              className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors"
            >
              <Plus size={14} />
              Add More
            </button>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            <AnimatePresence>
              {value.map((item, index) => (
                <MediaItem
                  key={item.id}
                  item={item}
                  index={index}
                  onRemove={handleRemove}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Upload Area or Input Mode */}
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
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif,.heic,.heif"
              onChange={handleFilesChange}
              className="hidden"
              multiple
              disabled={uploading}
            />
            
            <label
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                isDragging 
                  ? 'border-accent bg-accent/10' 
                  : error || uploadError
                  ? 'border-red-500/50 bg-red-500/5 cursor-pointer'
                  : value.length > 0
                  ? 'border-border hover:border-accent/50 hover:bg-surface cursor-pointer'
                  : 'border-border hover:border-accent/50 hover:bg-surface cursor-pointer'
              }`}
            >
                  {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full"
                  />
                  <span className="text-text-secondary text-sm">
                    {progress < 50 ? 'Converting HEIC...' : `Processing... ${progress}%`}
                  </span>
                  {progress > 0 && (
                    <div className="w-32 h-1 bg-surface rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-surface-hover flex items-center justify-center">
                    {value.length === 0 ? (
                      <Image size={24} className="text-accent" />
                    ) : (
                      <Plus size={24} className="text-accent" />
                    )}
                  </div>
                  <div>
                    {value.length === 0 ? (
                      <>
                        <p className="text-text-primary font-medium">Drop photos here</p>
                        <p className="text-text-tertiary text-sm mt-1">or click to browse</p>
                      </>
                    ) : (
                      <p className="text-text-primary font-medium">Add more photos</p>
                    )}
                  </div>
                  <p className="text-text-tertiary text-xs">
                    PNG, JPG, GIF, WebP, HEIC • Multiple files allowed
                  </p>
                </div>
              )}
            </label>
          </>
        ) : (
          <div className="space-y-3">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
              placeholder="Paste image URL..."
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
      </div>

      {/* Errors */}
      {(error || uploadError) && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={14} />
          {error || uploadError}
        </div>
      )}

      {uploadErrors.length > 0 && (
        <div className="space-y-1">
          {uploadErrors.map((err, idx) => (
            <div key={idx} className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={14} />
              <span>{err.file}: {err.error}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;