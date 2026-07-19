# Humari Pyaari Shreya

A digital birthday gift -- a quiet collection of moments, memories, and time shared, presented as an interactive timeline.

Built with React, Vite, Tailwind CSS, and Framer Motion. Features a clean, minimal design with smooth page transitions and a timeline of memories with photos organized by month.

## Tech Stack

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Fonts:** Cormorant Garamond (serif) + Inter (sans-serif)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs at `http://localhost:5173` by default.

## Project Structure

```
src/
├── components/
│   ├── Hero.jsx          # Landing section with intro text
│   ├── Timeline.jsx      # Scrollable timeline of memories
│   ├── MemoryCard.jsx    # Individual memory card in timeline
│   └── MemoryModal.jsx   # Full-screen modal for memory details
├── data/
│   └── memories.json     # All memory entries with stories and images
├── App.jsx               # Root app with state management
├── main.jsx              # Entry point
└── index.css             # Global styles + Tailwind imports
```

## Features

- Animated hero section with fade-in typography
- Chronological timeline of memories grouped by month
- Expandable memory cards with full stories and photo galleries
- Smooth modal transitions for memory detail view
- Fully responsive design

## Credits

Built as a birthday gift. Photos and memories belong to their respective moments.
