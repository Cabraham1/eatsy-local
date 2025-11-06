import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
}

export function useIntersectionObserver({
  threshold = 0.5,
  rootMargin = "0px",
}: UseIntersectionObserverProps = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return { elementRef, isIntersecting };
}
