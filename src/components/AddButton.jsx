import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useStory } from '../context/StoryContext';

const AddButton = () => {
  const { openModal } = useStory();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <button
      onClick={() => openModal()}
      className={`fixed bottom-8 right-8 w-14 h-14 bg-accent text-bg rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 z-40 group ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
      }`}
      style={{ 
        boxShadow: '0 4px 24px rgba(212, 165, 116, 0.4)',
        transition: 'opacity 0.3s ease, transform 0.3s ease, scale 0.2s ease'
      }}
    >
      <Plus 
        size={24} 
        strokeWidth={2.5} 
        className="transition-transform duration-300 group-hover:rotate-90" 
      />
    </button>
  );
};

export default AddButton;
