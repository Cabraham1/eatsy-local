import { useState, useEffect } from "react";

interface UseInfiniteScrollProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number;
}

export function useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 200,
}: UseInfiniteScrollProps) {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const throttledHandleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        if (hasNextPage && !isFetchingNextPage && !isFetching) {
          setIsFetching(true);
          fetchNextPage();
        }
      }
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          throttledHandleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, isFetching, fetchNextPage, threshold]);

  useEffect(() => {
    if (!isFetchingNextPage) {
      setIsFetching(false);
    }
  }, [isFetchingNextPage]);

  return { isFetching };
}
