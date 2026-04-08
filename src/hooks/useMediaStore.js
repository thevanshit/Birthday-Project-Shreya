import { get, set, del, keys, clear } from 'idb-keyval';

const MEDIA_PREFIX = 'media_';

export const useMediaStore = () => {
  const saveMedia = async (id, blob) => {
    try {
      await set(`${MEDIA_PREFIX}${id}`, blob);
      return true;
    } catch (error) {
      console.error('Failed to save media:', error);
      return false;
    }
  };

  const getMedia = async (id) => {
    try {
      const blob = await get(`${MEDIA_PREFIX}${id}`);
      if (blob) {
        return URL.createObjectURL(blob);
      }
      return null;
    } catch (error) {
      console.error('Failed to get media:', error);
      return null;
    }
  };

  const deleteMedia = async (id) => {
    try {
      await del(`${MEDIA_PREFIX}${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete media:', error);
      return false;
    }
  };

  const deleteMultipleMedia = async (ids) => {
    try {
      await Promise.all(ids.map(id => del(`${MEDIA_PREFIX}${id}`)));
      return true;
    } catch (error) {
      console.error('Failed to delete media:', error);
      return false;
    }
  };

  const getAllMediaIds = async () => {
    try {
      const allKeys = await keys();
      return allKeys
        .filter(key => String(key).startsWith(MEDIA_PREFIX))
        .map(key => String(key).replace(MEDIA_PREFIX, ''));
    } catch (error) {
      console.error('Failed to get media keys:', error);
      return [];
    }
  };

  const clearAllMedia = async () => {
    try {
      await clear();
      return true;
    } catch (error) {
      console.error('Failed to clear media:', error);
      return false;
    }
  };

  return {
    saveMedia,
    getMedia,
    deleteMedia,
    deleteMultipleMedia,
    getAllMediaIds,
    clearAllMedia
  };
};
