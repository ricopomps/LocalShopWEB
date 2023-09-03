import React, { useEffect, useRef } from "react";

interface InfiniteScrollProps {
  onLoadMore: () => void;
  isLoading: boolean;
  containerRef?: React.RefObject<HTMLDivElement>; // Add a containerRef prop
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  onLoadMore,
  isLoading,
  containerRef,
}) => {
  const lastScrollY = useRef(containerRef ? 0 : window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      if (!isLoading) {
        if (containerRef) {
          const container = containerRef.current;

          if (!container) return;

          const currentScrollY = container.scrollTop;

          const scrollDirection =
            currentScrollY > lastScrollY.current ? "down" : "up";

          if (
            (scrollDirection === "down" &&
              container.clientHeight + currentScrollY >=
                container.scrollHeight - 100) ||
            (scrollDirection === "up" && currentScrollY === 0)
          ) {
            onLoadMore();
          }
          lastScrollY.current = currentScrollY;
        } else {
          const currentScrollY = window.scrollY;
          const scrollDirection =
            currentScrollY > lastScrollY.current ? "down" : "up";

          if (
            (scrollDirection === "down" &&
              window.innerHeight + currentScrollY >=
                document.documentElement.scrollHeight - 100) ||
            (scrollDirection === "up" && currentScrollY === 0)
          ) {
            onLoadMore();
          }

          lastScrollY.current = currentScrollY;
        }
      }
    };

    if (containerRef) {
      const container = containerRef.current;
      if (container) {
        container.addEventListener("scroll", handleScroll);
      }
      return () => {
        if (container) {
          container.removeEventListener("scroll", handleScroll);
        }
      };
    } else {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isLoading, onLoadMore, containerRef]);

  return null;
};

export default InfiniteScroll;
