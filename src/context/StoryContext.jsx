import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import memories from '../data/memories';

const StoryContext = createContext(null);

const initialState = {
  selectedId: null,
  isPanelOpen: false,
  selectedMediaIndex: 0,
};

function storyReducer(state, action) {
  switch (action.type) {
    case 'SELECT_ITEM':
      return {
        ...state,
        selectedId: action.payload,
        isPanelOpen: true,
        selectedMediaIndex: 0
      };
    case 'CLOSE_PANEL':
      return {
        ...state,
        selectedId: null,
        isPanelOpen: false,
        selectedMediaIndex: 0
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
  const [state, dispatch] = useReducer(storyReducer, initialState);

  const items = memories;

  const selectedItem = useMemo(() => {
    if (!state.selectedId) return null;
    return items.find(item => item.id === state.selectedId) || null;
  }, [state.selectedId, items]);

  const selectItem = useCallback((id) => {
    dispatch({ type: 'SELECT_ITEM', payload: id });
  }, []);

  const closePanel = useCallback(() => {
    dispatch({ type: 'CLOSE_PANEL' });
  }, []);

  const setMediaIndex = useCallback((index) => {
    dispatch({ type: 'SET_MEDIA_INDEX', payload: index });
  }, []);

  const getMediaUrl = useCallback((mediaItem) => {
    if (!mediaItem) return null;
    return mediaItem.src || null;
  }, []);

  const value = {
    items,
    selectedItem,
    selectedId: state.selectedId,
    selectedMediaIndex: state.selectedMediaIndex,
    isPanelOpen: state.isPanelOpen,
    selectItem,
    closePanel,
    setMediaIndex,
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