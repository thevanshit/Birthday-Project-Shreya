import { motion } from 'framer-motion';
import { Film } from 'lucide-react';
import { useStory } from '../context/StoryContext';

const EmptyState = () => {
  const { openModal } = useStory();

  return (
    <section className="min-h-[60vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface flex items-center justify-center"
        >
          <Film size={36} className="text-text-tertiary" />
        </motion.div>

        <h2 className="font-display text-2xl mb-3">No memories yet</h2>
        <p className="text-text-secondary mb-8">
          Start adding moments that matter. Photos, videos, and the stories behind them.
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openModal()}
          className="px-6 py-3 bg-accent text-bg rounded-lg font-medium inline-flex items-center gap-2"
        >
          <span>Add First Memory</span>
        </motion.button>
      </motion.div>
    </section>
  );
};

export default EmptyState;
