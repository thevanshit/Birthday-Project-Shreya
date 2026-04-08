import { createContext, useContext, useReducer, useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useMediaStore } from '../hooks/useMediaStore';
import { generateId } from '../utils/helpers';

const StoryContext = createContext(null);

const initialState = {
  selectedId: null,
  isModalOpen: false,
  editingItem: null,
  isPanelOpen: false,
  selectedMediaIndex: 0,
};

function storyReducer(state, action) {
  switch (action.type) {
    case 'SELECT_ITEM':
      return {
        ...state,
        selectedId: action.payload,
        isPanelOpen: action.payload !== null,
        selectedMediaIndex: 0
      };
    case 'CLOSE_PANEL':
      return {
        ...state,
        selectedId: null,
        isPanelOpen: false,
        selectedMediaIndex: 0
      };
    case 'OPEN_MODAL':
      return {
        ...state,
        isModalOpen: true,
        editingItem: action.payload || null
      };
    case 'CLOSE_MODAL':
      return {
        ...state,
        isModalOpen: false,
        editingItem: null
      };
    case 'SET_MEDIA_INDEX':
      return {
        ...state,
        selectedMediaIndex: action.payload
      };
    default:
      return state;
  }
}

export function StoryProvider({ children }) {
  const { items, addItem, updateItem, deleteItem, getItem } = useLocalStorage([]);
  const { getMedia, deleteMedia, deleteMultipleMedia } = useMediaStore();
  const [state, dispatch] = useReducer(storyReducer, initialState);
  const [mediaUrls, setMediaUrls] = useState({});

  // Load media URLs from IndexedDB when items change
  useEffect(() => {
    const loadMediaUrls = async () => {
      const newUrls = {};
      for (const item of items) {
        if (item.media) {
          for (const m of item.media) {
            if (m.srcId) {
              const url = await getMedia(m.srcId);
              if (url) {
                newUrls[m.srcId] = url;
              }
            }
          }
        }
      }
      setMediaUrls(newUrls);
    };
    loadMediaUrls();
  }, [items, getMedia]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(mediaUrls).forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const selectedItem = state.selectedId ? getItem(state.selectedId) : null;

  const selectItem = useCallback((id) => {
    dispatch({ type: 'SELECT_ITEM', payload: id });
  }, []);

  const closePanel = useCallback(() => {
    dispatch({ type: 'CLOSE_PANEL' });
  }, []);

  const openModal = useCallback((item = null) => {
    dispatch({ type: 'OPEN_MODAL', payload: item });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, []);

  const setMediaIndex = useCallback((index) => {
    dispatch({ type: 'SET_MEDIA_INDEX', payload: index });
  }, []);

  const saveItem = useCallback((itemData) => {
    if (state.editingItem) {
      updateItem(state.editingItem.id, itemData);
    } else {
      const newItem = {
        ...itemData,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      addItem(newItem);
    }
    closeModal();
  }, [state.editingItem, updateItem, addItem, closeModal]);

  const removeItem = useCallback(async (id) => {
    const item = getItem(id);
    if (item && item.media) {
      // Delete all media from IndexedDB
      const mediaIds = item.media
        .filter(m => m.srcId)
        .map(m => m.srcId);
      if (mediaIds.length > 0) {
        await deleteMultipleMedia(mediaIds);
      }
    }
    deleteItem(id);
    if (state.selectedId === id) {
      closePanel();
    }
  }, [deleteItem, getItem, deleteMultipleMedia, state.selectedId, closePanel]);

  const getMediaUrl = useCallback((mediaItem) => {
    // If it's a direct URL (from URL upload), use it directly
    if (mediaItem.src && !mediaItem.src.startsWith('indexed:')) {
      return mediaItem.src;
    }
    // If it's stored in IndexedDB, get the URL
    if (mediaItem.srcId && mediaUrls[mediaItem.srcId]) {
      return mediaUrls[mediaItem.srcId];
    }
    return mediaItem.src;
  }, [mediaUrls]);

  const value = {
    items,
    selectedItem,
    selectedId: state.selectedId,
    selectedMediaIndex: state.selectedMediaIndex,
    isModalOpen: state.isModalOpen,
    isPanelOpen: state.isPanelOpen,
    editingItem: state.editingItem,
    selectItem,
    closePanel,
    openModal,
    closeModal,
    setMediaIndex,
    saveItem,
    removeItem,
    getItem,
    getMediaUrl
  };

  return (
    <StoryContext.Provider value={value}>
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
}
