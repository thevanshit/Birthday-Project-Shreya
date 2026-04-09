import { motion } from "framer-motion";

export default function MemoryCard({ memory, onClick }) {
  return (
    <motion.div
      onClick={() => onClick(memory)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer transition-all duration-500 hover:-translate-y-1"
    >
      <div className="bg-white rounded-2xl overflow-hidden 
        shadow-[0_6px_30px_rgba(0,0,0,0.05)]
        hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] 
        transition-all duration-500">

        <div className="relative h-56 overflow-hidden">
          <img
            src={memory.images?.[0]}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
        </div>

        <div className="p-6">
          <p className="text-xs text-gray-400 mb-2 tracking-wide">
            {memory.date}
          </p>

          <h3 className="font-serif text-xl text-gray-900 leading-snug">
            {memory.title}
          </h3>

          <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
            {memory.story}
          </p>
        </div>

      </div>
    </motion.div>
  );
}