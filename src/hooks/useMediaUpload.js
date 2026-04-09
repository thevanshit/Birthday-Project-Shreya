import { useState, useCallback } from 'react';
import { useMediaStore } from './useMediaStore';
import { generateId } from '../utils/helpers';
import heic2any from 'heic2any';

export const useMediaUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const { saveMedia } = useMediaStore();

  const convertHeicToJpeg = async (file) => {
    try {
      console.log('Starting HEIC conversion for:', file.name);
      
      const result = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.85
      });
      
      console.log('HEIC conversion result:', result);
      
      // Handle both single blob and array of blobs
      const blob = Array.isArray(result) ? result[0] : result;
      
      if (!blob) {
        throw new Error('Conversion returned no image data');
      }
      
      // Convert blob to a proper file-like object for FileReader
      const convertedFile = new File([blob], file.name.replace(/\.heic|\.heif/i, '.jpg'), {
        type: 'image/jpeg'
      });
      
      console.log('Converted to:', convertedFile.type, convertedFile.size);
      return convertedFile;
    } catch (err) {
      console.error('HEIC conversion failed:', err);
      throw new Error(`Failed to convert ${file.name}: ${err.message}`);
    }
  };

  const uploadFile = useCallback(async (file) => {
    return new Promise(async (resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const heicTypes = ['image/heic', 'image/heif', 'image/x-heic'];
      
      const isStandardImage = validImageTypes.includes(file.type);
      const isHeic = heicTypes.includes(file.type) || 
                     file.name.toLowerCase().endsWith('.heic') || 
                     file.name.toLowerCase().endsWith('.heif');
      
      if (!isStandardImage && !isHeic) {
        reject(new Error('Please upload an image (JPEG, PNG, GIF, WebP, HEIC)'));
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
        let fileToProcess = file;
        let isConverted = false;

        setProgress(10);

        // Convert HEIC to JPEG if needed
        if (isHeic) {
          console.log('Converting HEIC file:', file.name);
          setProgress(20);
          fileToProcess = await convertHeicToJpeg(file);
          isConverted = true;
          setProgress(50);
          console.log('HEIC conversion complete, file size:', fileToProcess.size);
        } else {
          setProgress(30);
        }

        // Read as base64 for immediate preview
        const reader = new FileReader();
        
        reader.onload = async () => {
          const preview = reader.result;
          console.log('FileReader complete, preview length:', preview.length);
          setProgress(70);
          
          // Save to IndexedDB for persistence
          await saveMedia(id, fileToProcess);
          setProgress(100);
          
          resolve({
            id,
            src: preview,
            srcId: id,
            type: 'image',
            name: isConverted ? file.name.replace(/\.heic|\.heif/i, '.jpg') : file.name,
            size: fileToProcess.size
          });
        };
        
        reader.onerror = () => {
          console.error('FileReader error:', reader.error);
          reject(new Error('Failed to read file'));
        };
        
        reader.readAsDataURL(fileToProcess);
      } catch (err) {
        console.error('Upload error:', err);
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

      const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif'];
      
      const urlLower = url.toLowerCase();
      const isImage = validImageExtensions.some(ext => urlLower.includes(ext));
      
      if (!isImage) {
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
          reject(new Error('URL must point to an image'));
        };
        img.src = url;
        return;
      }

      resolve({
        id: generateId(),
        src: url,
        type: 'image',
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