import { useState, useCallback } from 'react';
import { generateId } from '../utils/helpers';
import heic2any from 'heic2any';

export const useMediaUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const convertHeicToJpeg = async (file) => {
    try {
      const result = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.85
      });
      
      const blob = Array.isArray(result) ? result[0] : result;
      
      if (!blob) {
        throw new Error('Conversion returned no image data');
      }
      
      const convertedFile = new File([blob], file.name.replace(/\.heic|\.heif/i, '.jpg'), {
        type: 'image/jpeg'
      });
      
      return convertedFile;
    } catch (err) {
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

      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        reject(new Error('File exceeds 50MB limit'));
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

        if (isHeic) {
          setProgress(20);
          fileToProcess = await convertHeicToJpeg(file);
          isConverted = true;
          setProgress(50);
        } else {
          setProgress(30);
        }

        const reader = new FileReader();
        
        reader.onload = () => {
          const preview = reader.result;
          setProgress(90);
          
          const result = {
            id,
            src: preview,
            srcId: id,
            type: 'image',
            name: isConverted ? file.name.replace(/\.heic|\.heif/i, '.jpg') : file.name,
            size: fileToProcess.size
          };
          
          console.log('useMediaUpload: File uploaded successfully', { id, srcLength: preview.length });
          setProgress(100);
          resolve(result);
        };
        
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
        
        reader.readAsDataURL(fileToProcess);
      } catch (err) {
        reject(err);
      } finally {
        setUploading(false);
      }
    });
  }, []);

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
      const urlLower = url.toLowerCase();
      const hasExtension = validImageExtensions.some(ext => urlLower.includes(ext));

      if (hasExtension) {
        resolve({
          id: generateId(),
          src: url,
          type: 'image',
          name: url.split('/').pop() || 'image.jpg'
        });
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        resolve({
          id: generateId(),
          src: url,
          type: 'image',
          name: url.split('/').pop() || 'image.jpg'
        });
      };
      
      img.onerror = () => {
        resolve({
          id: generateId(),
          src: url,
          type: 'image',
          name: url.split('/').pop() || 'image.jpg'
        });
      };
      
      img.src = url;
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
