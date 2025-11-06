import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Story } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { demoStories } from "@/mocks/data";

interface StoryItemProps {
  story: Story;
}

const StoryItem = ({ story }: StoryItemProps) => {
  const href =
    story.type === "category"
      ? `/category/${story.title.toLowerCase()}`
      : story.type === "cuisine"
        ? `/cuisine/${story.title.toLowerCase()}`
        : `/cooks/${story.referenceId}`;

  return (
    <Link href={href}>
      <div className="flex cursor-pointer flex-col items-center">
        <div
          className="story-circle border-3 mb-1 h-[70px] w-[70px] rounded-full border-primary bg-cover bg-center"
          style={{ backgroundImage: `url('${story.imageUrl}')` }}
        />
        <span className="w-16 truncate text-center text-xs font-medium">{story.title}</span>
      </div>
    </Link>
  );
};

export function StoryList() {
  // For demonstration, we're using mock data
  const MOCK_DEMO_DATA = true;

  const { data: fetchedStories, isLoading: isLoadingStories } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
    enabled: !MOCK_DEMO_DATA, // Only fetch if we're not using mock data
  });

  // Demo data for preview purposes - Nigerian market
  // Use centralized stories data
  const mockStories = demoStories;

  // Use mock data if enabled, otherwise use fetched data
  const stories = MOCK_DEMO_DATA ? mockStories : fetchedStories;
  const isLoading = !MOCK_DEMO_DATA && isLoadingStories;

  if (isLoading) {
    return (
      <div className="-mx-4 mb-6 overflow-x-auto px-4 pb-2">
        <div className="flex space-x-4 pt-1">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <Skeleton className="mb-1 h-[70px] w-[70px] rounded-full" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stories || stories.length === 0) {
    return null;
  }

  return (
    <div className="-mx-4 mb-6 overflow-x-auto px-4 pb-2">
      <div className="flex space-x-4 pt-1">
        {stories.map((story) => (
          <StoryItem key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
}
