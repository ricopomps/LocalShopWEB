import React, { useRef } from "react";
import styles from "../styles/HorizontalScroll.module.css";
interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
}

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  children,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleWheelScroll = (e: React.WheelEvent) => {
    const container = containerRef.current;
    if (container) {
      container.scrollLeft += e.deltaY;
    }
  };

  return (
    <div
      className={`${styles.container} ${className && styles[className]}`}
      ref={containerRef}
      onWheel={handleWheelScroll}
    >
      {children}
    </div>
  );
};

export default HorizontalScroll;
