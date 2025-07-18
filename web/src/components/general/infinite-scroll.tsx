import { ReactNode, useCallback, useEffect, useRef } from "react";

interface InfiniteScrollProps {
  children: ReactNode;
  loadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  observerOptions?: IntersectionObserverInit;
  loader?: ReactNode;
}

const InfiniteScroll = ({
  children,
  loadMore,
  hasMore,
  isLoading,
  observerOptions = {
    root: null,
    rootMargin: "20px",
    threshold: 0,
  },
  loader = (
    <div className="flex justify-center py-4">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
}: InfiniteScrollProps) => {
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    },
    [loadMore, hasMore, isLoading],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    const trigger = triggerRef.current;
    if (trigger) {
      observer.observe(trigger);
    }

    return () => {
      if (trigger) {
        observer.unobserve(trigger);
      }
    };
  }, [observerOptions, observerCallback]);

  return (
    <div>
      {children}
      {isLoading && loader}
      <div ref={triggerRef} className="h-1" id="trigger" />
    </div>
  );
};

export default InfiniteScroll; 