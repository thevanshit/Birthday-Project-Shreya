import { StoryProvider } from './context/StoryContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import StoryPanel from './components/StoryPanel';
import Footer from './components/Footer';

function App() {
  return (
    <StoryProvider>
      <div className="bg-bg min-h-screen text-text-primary">
        <Header />
        <main>
          <Hero />
          <Timeline />
        </main>
        <Footer />
        <StoryPanel />
      </div>
    </StoryProvider>
  );
}

export default App;
