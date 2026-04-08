import { useState, useCallback } from 'react';
import { useMediaStore } from './useMediaStore';
import { generateId } from '../utils/helpers';

export const useMediaUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const { saveMedia } = useMediaStore();

  const uploadFile = useCallback(async (file) => {
    return new Promise(async (resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
      
      const isImage = validImageTypes.includes(file.type);
      const isVideo = validVideoTypes.includes(file.type);
      
      if (!isImage && !isVideo) {
        reject(new Error('Please upload an image (JPEG, PNG, GIF, WebP) or video (MP4, WebM)'));
        return;
      }

      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        reject(new Error('File exceeds 100MB limit'));
        return;
      }

      setUploading(true);
      setProgress(0);
      setError(null);

      try {
        const id = generateId();
        
        // For videos, store in IndexedDB
        if (isVideo) {
          setProgress(30);
          const saved = await saveMedia(id, file);
          if (!saved) {
            throw new Error('Failed to store video');
          }
          setProgress(100);
          
          resolve({
            id,
            src: `indexed:${id}`, // Mark as stored in IndexedDB
            type: 'video',
            name: file.name,
            size: file.size
          });
        } else {
          // For images, use FileReader for preview + IndexedDB for storage
          setProgress(30);
          
          // Read as base64 for immediate preview
          const reader = new FileReader();
          reader.onload = async () => {
            const preview = reader.result;
            setProgress(60);
            
            // Also save to IndexedDB for persistence
            await saveMedia(id, file);
            setProgress(100);
            
            resolve({
              id,
              src: preview,
              srcId: id, // Store reference for persistence
              type: 'image',
              name: file.name,
              size: file.size
            });
          };
          reader.onerror = () => {
            reject(new Error('Failed to read file'));
          };
          reader.readAsDataURL(file);
        }
      } catch (err) {
        reject(err);
      } finally {
        setUploading(false);
      }
    });
  }, [saveMedia]);

  const uploadMultiple = useCallback(async (files) => {
    const results = [];
    const errors = [];
    
    for (const file of files) {
      try {
        const result = await uploadFile(file);
        results.push(result);
      } catch (err) {
        errors.push({ file: file.name, error: err.message });
      }
    }
    
    return { results, errors };
  }, [uploadFile]);

  const uploadFromUrl = useCallback(async (url) => {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(new Error('No URL provided'));
        return;
      }

      const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const validVideoExtensions = ['.mp4', '.webm', '.mov'];
      
      const urlLower = url.toLowerCase();
      const isImage = validImageExtensions.some(ext => urlLower.includes(ext));
      const isVideo = validVideoExtensions.some(ext => urlLower.includes(ext));
      
      if (!isImage && !isVideo) {
        // Try to detect from content type header
        const img = new Image();
        img.onload = () => {
          resolve({
            id: generateId(),
            src: url,
            type: 'image',
            name: url.split('/').pop()
          });
        };
        img.onerror = () => {
          reject(new Error('URL must point to an image or video'));
        };
        img.src = url;
        return;
      }

      resolve({
        id: generateId(),
        src: url,
        type: isImage ? 'image' : 'video',
        name: url.split('/').pop()
      });
    });
  }, []);

  return {
    uploadFile,
    uploadMultiple,
    uploadFromUrl,
    uploading,
    progress,
    error,
    setError
  };
};
