import { motion } from 'framer-motion'

export default function MemoryModal({ memory, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl w-full max-w-4xl h-[85vh] overflow-hidden shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-400">{memory.date}</p>
            <h2 className="text-3xl font-serif">{memory.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black text-2xl"
          >
            x
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-y-auto px-8 py-6 space-y-8"
        >
          {memory.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {memory.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt=""
                  className="w-full h-48 object-cover rounded-xl transition duration-500 hover:scale-[1.02]"
                />
              ))}
            </div>
          )}

          <p className="text-gray-600 leading-[1.8] text-[15px] whitespace-pre-line">
            {memory.story}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}