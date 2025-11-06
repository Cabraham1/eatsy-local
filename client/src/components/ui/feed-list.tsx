import React, { useState, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FeedCard, FeedContent } from "./feed-card";
import { fetchMockFeedData } from "../../lib/mock-feed-data";
import { useInfiniteScroll } from "../../hooks/use-infinite-scroll";
import { useIntersectionObserver } from "../../hooks/use-intersection-observer";
import { useCartStore } from "../../stores/cart-store";
import { useToast } from "../../hooks/use-toast";
import { Loader2 } from "lucide-react";

export function FeedList() {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("eatsy-saved-posts");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const { addItem } = useCartStore();
  const { toast } = useToast();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ["feed"],
      queryFn: ({ pageParam = 0 }: { pageParam?: number }) => fetchMockFeedData(pageParam, 10),
      getNextPageParam: (lastPage: { hasNextPage: boolean; nextPage: number }) =>
        lastPage.hasNextPage ? lastPage.nextPage : undefined,
      initialPageParam: 0,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });

  useInfiniteScroll({
    hasNextPage: hasNextPage || false,
    isFetchingNextPage,
    fetchNextPage,
    threshold: 300,
  });

  const handleLike = useCallback((postId: string) => {
    setLikedPosts((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });
  }, []);

  const handleSave = useCallback((postId: string) => {
    setSavedPosts((prev) => {
      const newSaved = new Set(prev);
      if (newSaved.has(postId)) {
        newSaved.delete(postId);
      } else {
        newSaved.add(postId);
      }
      localStorage.setItem("eatsy-saved-posts", JSON.stringify(Array.from(newSaved)));
      return newSaved;
    });
  }, []);

  const handleShare = useCallback((postId: string) => {
    // Analytics or API call could go here
    console.log("Shared post:", postId);
  }, []);

  const handleComment = useCallback((postId: string) => {
    // Navigate to comments or open modal
    console.log("Comment on post:", postId);
  }, []);

  const handleAddToCart = useCallback(
    (postId: string) => {
      // Find the post data
      const allPosts = data?.pages.flatMap((page) => page.data) || [];
      const post = allPosts.find((p) => p.id === postId);

      if (!post || !post.price) {
        toast({
          title: "Error",
          description: "Unable to add item to cart. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Create cart item from post data
      const cartItem = {
        id: post.id,
        name: post.caption.split(".")[0] || `Dish by ${post.cook.name}`, // Use first sentence as name
        description: post.caption,
        price: post.price,
        imageUrl: post.url || post.cook.avatar,
        cookId: post.cook.id,
        cookName: post.cook.name,
      };

      addItem(cartItem);
      toast({
        title: "Added to Cart! 🛒",
        description: `${cartItem.name} from ${post.cook.name} - ₦${post.price.toLocaleString()}`,
        duration: 3000,
      });
    },
    [data, addItem, toast]
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-orange-500" />
          <p className="text-gray-600">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 text-gray-500">
          <svg
            className="mx-auto mb-4 h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">Something went wrong</h3>
        <p className="mb-4 text-gray-500">We couldn&apos;t load the feed. Please try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  const allPosts = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="mx-auto max-w-md pb-20">
      {allPosts.map((post) => (
        <FeedCardWithObserver
          key={post.id}
          content={{
            ...post,
            isLiked: likedPosts.has(post.id) || post.isLiked,
            isSaved: savedPosts.has(post.id) || post.isSaved,
            stats: {
              ...post.stats,
              likes:
                post.stats.likes +
                (likedPosts.has(post.id) && !post.isLiked ? 1 : 0) -
                (post.isLiked && !likedPosts.has(post.id) ? 1 : 0),
            },
          }}
          onLike={handleLike}
          onSave={handleSave}
          onShare={handleShare}
          onComment={handleComment}
          onAddToCart={handleAddToCart}
        />
      ))}

      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          <span className="ml-2 text-gray-600">Loading more posts...</span>
        </div>
      )}

      {!hasNextPage && allPosts.length > 0 && (
        <div className="py-8 text-center text-gray-500">
          <p>You&apos;ve reached the end! 🎉</p>
          <p className="mt-1 text-sm">Follow more cooks to see more content</p>
        </div>
      )}
    </div>
  );
}

// Wrapper component to add intersection observer to each card
function FeedCardWithObserver({
  content,
  onLike,
  onSave,
  onShare,
  onComment,
  onAddToCart,
}: {
  content: FeedContent;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  onComment: (id: string) => void;
  onAddToCart?: (id: string) => void;
}) {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.6,
    rootMargin: "-10% 0px -10% 0px",
  });

  return (
    <div ref={elementRef}>
      <FeedCard
        content={content}
        onLike={onLike}
        onSave={onSave}
        onShare={onShare}
        onComment={onComment}
        onAddToCart={onAddToCart}
        isInView={isIntersecting}
      />
    </div>
  );
}
