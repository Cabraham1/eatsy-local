import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { demoStoryContents } from "@/mocks/data";

interface StoryProps {
  imageUrl: string;
  title: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function Story({ imageUrl, title, isActive = false, onClick }: StoryProps) {
  return (
    <div className="flex cursor-pointer flex-col items-center space-y-1" onClick={onClick}>
      <div
        className={cn(
          "relative rounded-full p-0.5",
          isActive ? "bg-gradient-to-tr from-orange-500 to-yellow-300" : "bg-gray-200"
        )}
      >
        <div className="rounded-full bg-white p-0.5">
          <Avatar className="h-16 w-16">
            <AvatarImage src={imageUrl} alt={title} className="object-cover" />
            <AvatarFallback className="bg-orange-100 text-orange-800">
              {title.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <span className="line-clamp-1 text-center text-xs">{title}</span>
    </div>
  );
}

export function StoryViewer({
  stories,
  onClose,
}: {
  stories: Array<{ imageUrl: string; title: string; content: string }>;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            return 0;
          } else {
            clearInterval(timer);
            onClose();
            return 100;
          }
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [currentIndex, stories.length, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black bg-opacity-90">
      {/* Close button */}
      <button className="absolute right-4 top-4 z-10 text-white" onClick={onClose}>
        ✕
      </button>

      {/* Progress bars */}
      <div className="flex w-full gap-1 px-2 pt-2">
        {stories.map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-gray-600">
            <div
              className="h-full rounded-full bg-white"
              style={{
                width: i < currentIndex ? "100%" : i === currentIndex ? `${progress}%` : "0%",
                transition: i === currentIndex ? "width 0.05s linear" : "none",
              }}
            />
          </div>
        ))}
      </div>

      {/* Story content */}
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="w-full max-w-md overflow-hidden rounded-lg bg-gradient-to-b from-gray-900 to-black">
          <img
            src={stories[currentIndex].imageUrl}
            alt={stories[currentIndex].title}
            className="h-80 w-full object-cover"
          />
          <div className="p-4">
            <h3 className="font-bold text-white">{stories[currentIndex].title}</h3>
            <p className="text-sm text-white/80">{stories[currentIndex].content}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div
        className="absolute inset-0"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          if (x < rect.width / 2 && currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setProgress(0);
          } else if (x >= rect.width / 2 && currentIndex < stories.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setProgress(0);
          }
        }}
      />
    </div>
  );
}

export function StoriesRow({
  stories,
}: {
  stories: Array<{
    id: number;
    imageUrl: string;
    title: string;
    hasUnviewed: boolean;
  }>;
}) {
  const [viewingStory, setViewingStory] = React.useState<number | null>(null);

  // Use centralized story content data
  const mockStoryContents = demoStoryContents;

  return (
    <div className="hide-scrollbar overflow-x-auto px-4 pb-2 pt-3">
      <div className="flex gap-4">
        {stories.map((story) => (
          <Story
            key={story.id}
            imageUrl={story.imageUrl}
            title={story.title}
            isActive={story.hasUnviewed}
            onClick={() => setViewingStory(story.id)}
          />
        ))}
      </div>

      {viewingStory !== null && (
        <StoryViewer stories={mockStoryContents} onClose={() => setViewingStory(null)} />
      )}
    </div>
  );
}
