import React, { useEffect } from "react";

interface InfiniteScrollProps {
  onLoadMore: () => void;
  isLoading: boolean;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  onLoadMore,
  isLoading,
}) => {
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        isLoading
      ) {
        return;
      }
      onLoadMore();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, onLoadMore]);
  return null;
};

export default InfiniteScroll;
