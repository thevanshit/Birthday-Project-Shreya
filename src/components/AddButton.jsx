import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useStory } from '../context/StoryContext';

const AddButton = () => {
  const { openModal } = useStory();

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      onClick={() => openModal()}
      className="fixed bottom-8 right-8 w-14 h-14 bg-accent text-bg rounded-full shadow-lg shadow-accent/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 z-40 group"
      style={{ boxShadow: '0 4px 24px rgba(212, 165, 116, 0.4)' }}
    >
      <Plus size={24} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
    </motion.button>
  );
};

export default AddButton;
