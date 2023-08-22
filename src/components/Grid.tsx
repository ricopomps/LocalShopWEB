import React, { useState } from "react";
import styles from "../styles/Grid.module.css";
import { Col, Row } from "react-bootstrap";

interface GridProps {
  rows: number;
  cols: number;
}

interface SelectedCells {
  x: number;
  y: number;
}

const Grid: React.FC<GridProps> = ({ rows, cols }) => {
  const [selectedCells, setSelectedCells] = useState<SelectedCells[]>([]);
  const cellSize = 50;
  const gridStyle = {
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
  };

  const handleClick = (x: number, y: number) => {
    if (selectedCells.find((s) => s.x === x && s.y === y)) {
      setSelectedCells(selectedCells.filter((s) => s.x !== x || s.y !== y));
    } else {
      setSelectedCells([...selectedCells, { x, y }]);
    }
  };

  return (
    <Row>
      <Col>
        <div className={styles.grid} style={gridStyle}>
          {Array.from({ length: rows * cols }, (_, index) => {
            const x = index % cols;
            const y = Math.floor(index / cols);
            const isSelected = selectedCells.some(
              (cell) => cell.x === x && cell.y === y
            );

            return (
              <div
                key={index}
                onClick={() => handleClick(x, y)}
                className={`${styles.gridCell} ${
                  isSelected && styles.gridCellGreen
                }`}
              >
                {/* {`${x}-${y}`} */}
              </div>
            );
          })}
        </div>
      </Col>
    </Row>
  );
};

export default Grid;
