import { motion } from 'framer-motion'
import MemoryCard from './MemoryCard'

export default function Timeline({ memories, onMemoryClick }) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {memories.map((monthData, monthIndex) => (
          <motion.div
            key={monthData.monthYear}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: monthIndex * 0.1 }}
            className="mb-32"
          >
            <h2 className="text-3xl font-serif text-gray-900 mb-4 tracking-tight">
              {monthData.monthYear}
            </h2>

            <div className="w-12 h-[1px] bg-gray-200 mb-10" />

            <div className="grid md:grid-cols-2 gap-12">
              {monthData.memories.map((memory) => (
                <MemoryCard 
                  key={memory.id}
                  memory={memory}
                  onClick={onMemoryClick}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}