import { useCallback, useMemo } from 'react';
import { Calendar, Image } from 'lucide-react';
import EmptyState from './EmptyState';
import { useStory } from '../context/StoryContext';

const formatMonthYear = (dateString) => {
  if (!dateString) return 'No Date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'No Date';
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const Timeline = () => {
  const { items, selectedId, selectItem, getMediaUrl } = useStory();

  const itemsWithDate = useMemo(() => 
    items.filter(item => item.date && item.date.trim() !== ''),
    [items]
  );

  if (itemsWithDate.length === 0) {
    return <EmptyState />;
  }

  const sortedItems = useMemo(() => 
    [...itemsWithDate].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [itemsWithDate]
  );

  const groupedByMonth = useMemo(() => {
    return sortedItems.reduce((groups, item) => {
      const monthYear = formatMonthYear(item.date);
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(item);
      return groups;
    }, {});
  }, [sortedItems]);

  const months = Object.keys(groupedByMonth);

  const handleCardClick = useCallback((itemId) => {
    console.log('Timeline: Calling selectItem with id:', itemId);
    selectItem(itemId);
  }, [selectItem]);

  return (
    <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="mb-10">
        <h2 className="font-display text-2xl sm:text-3xl text-center">The Timeline</h2>
        <p className="text-text-secondary mt-2 text-sm text-center">Scroll down to explore our journey</p>
      </div>

      <div className="space-y-16">
        {months.map((month) => {
          const monthItems = groupedByMonth[month];
          
          return (
            <div
              key={month}
              className="relative"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Calendar size={20} className="text-accent" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-text-primary">
                  {month}
                </h3>
                <div className="flex-grow h-px bg-gradient-to-r from-border to-transparent" />
                <span className="text-text-tertiary text-sm font-mono">
                  {monthItems.length} {monthItems.length === 1 ? 'memory' : 'memories'}
                </span>
              </div>

              <div className="space-y-4 ml-4 sm:ml-8 border-l-2 border-border/50 pl-6 sm:pl-8">
                {monthItems.map((item) => (
                  <MemoryCard 
                    key={item.id}
                    item={item} 
                    isSelected={selectedId === item.id}
                    onClick={() => handleCardClick(item.id)}
                    getMediaUrl={getMediaUrl}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const MemoryCard = ({ item, isSelected, onClick, getMediaUrl }) => {
  const totalCount = item.media?.length || 0;
  const firstMedia = item.media?.[0];
  const thumbnailUrl = firstMedia ? getMediaUrl(firstMedia) : null;

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return 'No date';
    }
  };

  const handleClick = () => {
    console.log('MemoryCard onClick triggered:', item.id, item.title);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`w-full text-left relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/20 ${
        isSelected 
          ? 'ring-2 ring-accent shadow-lg shadow-accent/20' 
          : ''
      }`}
      style={{ backgroundColor: '#141414' }}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-64 h-48 sm:h-40 flex-shrink-0">
          {item.media && item.media.length > 0 ? (
            <div className="w-full h-full">
              {thumbnailUrl ? (
                <img 
                  src={thumbnailUrl} 
                  alt={item.title || 'Memory'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-surface flex items-center justify-center">
                  <span className="text-text-tertiary text-xs">Loading...</span>
                </div>
              )}
              {totalCount > 1 && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-1.5">
                  <Image size={12} className="text-accent" />
                  <span className="text-xs text-white font-mono">+{totalCount - 1}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-surface flex items-center justify-center">
              <span className="text-text-tertiary text-xs">No photo</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} className="text-accent" />
            <span className="text-sm font-mono text-accent">
              {formatDate(item.date)}
            </span>
          </div>
          
          <h4 className="font-display text-lg text-text-primary mb-2 line-clamp-1">
            {item.title || 'Untitled'}
          </h4>
          
          <p className="text-text-secondary text-sm line-clamp-2">
            {item.story || 'No story yet...'}
          </p>
          
          {totalCount > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <div className="flex -space-x-2">
                {item.media.slice(0, 3).map((m, i) => {
                  const url = getMediaUrl(m);
                  return (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-[#141414] overflow-hidden">
                      {url ? (
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-surface" />
                      )}
                    </div>
                  );
                })}
              </div>
              <span className="text-xs text-text-tertiary">
                {totalCount} {totalCount === 1 ? 'photo' : 'photos'}
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

export default Timeline;
