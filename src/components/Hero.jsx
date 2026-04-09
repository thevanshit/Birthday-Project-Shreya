import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="min-h-[85vh] flex items-center justify-center text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <motion.h1 
          className="text-5xl md:text-6xl font-serif text-gray-900 leading-[1.2] tracking-tight"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Humari Pyaari Shreya
        </motion.h1>

        <motion.div 
          className="w-16 h-[1px] bg-gray-300 mx-auto my-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
        
        <motion.p 
          className="text-gray-500 text-sm tracking-wide leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          A quiet collection of moments, memories,  
          and time we shared — one day at a time
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12 text-gray-400 text-sm"
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  )
}