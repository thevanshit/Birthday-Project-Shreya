import { useState, useCallback } from 'react';

export const useMediaUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = useCallback((file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
      
      const isValidType = [...validImageTypes, ...validVideoTypes].includes(file.type);
      
      if (!isValidType) {
        reject(new Error('Please upload an image (JPEG, PNG, GIF, WebP) or video (MP4, WebM)'));
        return;
      }

      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        reject(new Error('File exceeds 50MB limit'));
        return;
      }

      setUploading(true);
      setError(null);

      const reader = new FileReader();
      
      reader.onload = () => {
        const type = validImageTypes.includes(file.type) ? 'image' : 'video';
        resolve({
          src: reader.result,
          type,
          name: file.name
        });
        setUploading(false);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
        setUploading(false);
      };

      reader.readAsDataURL(file);
    });
  }, []);

  const uploadFromUrl = useCallback((url) => {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(new Error('No URL provided'));
        return;
      }

      const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const validVideoExtensions = ['.mp4', '.webm', '.mov'];
      const validVideoHosts = ['youtube.com', 'youtu.be', 'vimeo.com'];
      
      const urlLower = url.toLowerCase();
      const isImage = validImageExtensions.some(ext => urlLower.includes(ext));
      const isVideo = validVideoExtensions.some(ext => urlLower.includes(ext)) || 
                      validVideoHosts.some(host => urlLower.includes(host));
      
      if (!isImage && !isVideo) {
        reject(new Error('URL must point to an image or video'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        resolve({
          src: url,
          type: 'image',
          name: url.split('/').pop()
        });
      };
      img.onerror = () => {
        resolve({
          src: url,
          type: 'video',
          name: url.split('/').pop()
        });
      };
      img.src = url;
    });
  }, []);

  return {
    uploadFile,
    uploadFromUrl,
    uploading,
    error,
    setError
  };
};
