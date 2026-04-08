import { stories } from '../data/memories';

const Story = () => {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      {stories.map((story) => (
        <div key={story.id} className="mb-20 last:mb-0">
          <img
            src={story.image}
            alt={story.title}
            className="w-full aspect-[4/3] object-cover mb-6"
          />
          <h3 className="text-xl md:text-2xl font-medium mb-3">
            {story.title}
          </h3>
          <p className="text-text-light leading-relaxed">
            {story.story}
          </p>
        </div>
      ))}
    </section>
  );
};

export default Story;
