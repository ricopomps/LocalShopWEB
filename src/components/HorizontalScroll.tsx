import React, { useRef } from "react";
import styles from "../styles/HorizontalScroll.module.css";
import { Row } from "react-bootstrap";
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
    <Row
      xs={1}
      md={2}
      xl={3}
      ref={containerRef}
      onWheel={handleWheelScroll}
      className={`g-4 ${styles.container} ${className}`}
    >
      {children}
    </Row>
  );
};

export default HorizontalScroll;
