import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/constants/api-client";
import { User } from "@shared/schema";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { demoCooks } from "@/mocks/data";
import { queryClient } from "@/lib/constants/queryClient";
interface CookItemProps {
  cook: User;
  onFollow: (cookId: number) => void;
  isFollowing: boolean;
  isFollowingLoading: boolean;
}

const CookItem = ({ cook, onFollow, isFollowing, isFollowingLoading }: CookItemProps) => {
  return (
    <div className="flex items-center justify-between border-b border-muted py-3">
      <Link href={`/cooks/${cook.id}`}>
        <div className="flex cursor-pointer items-center">
          <Avatar className="mr-3 h-10 w-10">
            {cook.profileImage ? (
              <AvatarImage src={cook.profileImage} alt={cook.fullName} />
            ) : (
              <AvatarFallback>{cook.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <h4 className="text-sm font-medium">{cook.fullName}</h4>
            <p className="flex items-center text-xs text-muted-foreground">
              {cook.cuisine} • 4.5 <Star className="ml-0.5 h-3 w-3 text-yellow-400" />
            </p>
          </div>
        </div>
      </Link>
      <Button
        variant={isFollowing ? "outline" : "link"}
        size="sm"
        className={isFollowing ? "text-muted-foreground" : "text-primary"}
        onClick={() => onFollow(cook.id)}
        disabled={isFollowingLoading}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
};

export function SuggestedCooks() {
  const { toast } = useToast();
  const [loadingFollowId, setLoadingFollowId] = useState<number | null>(null);

  // For demonstration, we're using mock data
  const MOCK_DEMO_DATA = true;

  const { data: fetchedSuggestedCooks, isLoading: isLoadingSuggested } = useQuery<
    { cook: User; isFollowing: boolean }[]
  >({
    queryKey: ["/api/cooks/suggested"],
    enabled: !MOCK_DEMO_DATA,
  });

  // Mock data for preview purposes - Use actual demoCooks data
  const mockSuggestedCooks: { cook: User; isFollowing: boolean }[] = demoCooks
    .slice(2, 6)
    .map((cook) => ({
      cook,
      isFollowing: false,
    }));

  // Use mock data if enabled, otherwise use fetched data
  const suggestedCooks = MOCK_DEMO_DATA ? mockSuggestedCooks : fetchedSuggestedCooks;
  const isLoading = !MOCK_DEMO_DATA && isLoadingSuggested;

  const followMutation = useMutation({
    mutationFn: async (cookId: number) => {
      await api.post(`/api/cooks/${cookId}/follow`, {});
      return cookId;
    },
    onMutate: (cookId) => {
      setLoadingFollowId(cookId);
      // Optimistic update
      const previousData = queryClient.getQueryData<{ cook: User; isFollowing: boolean }[]>([
        "/api/cooks/suggested",
      ]);
      if (previousData) {
        queryClient.setQueryData(
          ["/api/cooks/suggested"],
          previousData.map((item) =>
            item.cook.id === cookId ? { ...item, isFollowing: !item.isFollowing } : item
          )
        );
      }
      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cooks/favorites"] });
      setLoadingFollowId(null);
    },
    onError: (error, cookId, context) => {
      // Revert to previous state if mutation fails
      if (context?.previousData) {
        queryClient.setQueryData(["/api/cooks/suggested"], context.previousData);
      }
      setLoadingFollowId(null);
      toast({
        title: "Error",
        description: `Failed to update follow status: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleFollow = (cookId: number) => {
    followMutation.mutate(cookId);
  };

  const [showMore, setShowMore] = useState(false);

  const visibleCooks = showMore ? suggestedCooks : suggestedCooks?.slice(0, 3);

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-4 shadow-card">
        <h3 className="mb-3 text-lg font-medium">Suggested Cooks</h3>

        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between border-b border-muted py-3">
            <div className="flex items-center">
              <Skeleton className="mr-3 h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="mb-1 h-4 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (!suggestedCooks || suggestedCooks.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-card">
      <h3 className="mb-3 text-lg font-medium">Suggested Cooks</h3>

      {visibleCooks?.map(({ cook, isFollowing }) => (
        <CookItem
          key={cook.id}
          cook={cook}
          onFollow={handleFollow}
          isFollowing={isFollowing}
          isFollowingLoading={loadingFollowId === cook.id}
        />
      ))}

      {suggestedCooks && suggestedCooks.length > 3 && (
        <Button
          variant="ghost"
          className="mt-3 flex w-full items-center justify-center text-sm font-medium text-primary"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Show Less" : "See More"}
          <ChevronDown
            className={`ml-1 h-4 w-4 transition-transform ${showMore ? "rotate-180" : ""}`}
          />
        </Button>
      )}
    </div>
  );
}
