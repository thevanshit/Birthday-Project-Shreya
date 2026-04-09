import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Hero from './components/Hero'
import Timeline from './components/Timeline'
import MemoryModal from './components/MemoryModal'
import memoriesData from './data/memories.json'

function App() {
  const [selectedMemory, setSelectedMemory] = useState(null)

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Timeline 
        memories={memoriesData.grouped} 
        onMemoryClick={setSelectedMemory} 
      />
      
      <AnimatePresence>
        {selectedMemory && (
          <MemoryModal 
            memory={selectedMemory} 
            onClose={() => setSelectedMemory(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App