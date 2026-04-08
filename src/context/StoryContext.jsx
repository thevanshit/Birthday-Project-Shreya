import { createContext, useContext, useReducer, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/helpers';

const StoryContext = createContext(null);

const initialState = {
  selectedId: null,
  isModalOpen: false,
  editingItem: null,
  isPanelOpen: false,
};

function storyReducer(state, action) {
  switch (action.type) {
    case 'SELECT_ITEM':
      return {
        ...state,
        selectedId: action.payload,
        isPanelOpen: action.payload !== null
      };
    case 'CLOSE_PANEL':
      return {
        ...state,
        selectedId: null,
        isPanelOpen: false
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
    default:
      return state;
  }
}

export function StoryProvider({ children }) {
  const { items, addItem, updateItem, deleteItem, getItem } = useLocalStorage([]);
  const [state, dispatch] = useReducer(storyReducer, initialState);

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

  const removeItem = useCallback((id) => {
    deleteItem(id);
    if (state.selectedId === id) {
      closePanel();
    }
  }, [deleteItem, state.selectedId, closePanel]);

  const value = {
    items,
    selectedItem,
    selectedId: state.selectedId,
    isModalOpen: state.isModalOpen,
    isPanelOpen: state.isPanelOpen,
    editingItem: state.editingItem,
    selectItem,
    closePanel,
    openModal,
    closeModal,
    saveItem,
    removeItem,
    getItem
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
