import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import styles from "../styles/Grid.module.css";
import * as MapApi from "../network/mapApi";
interface GridProps {
  rows: number;
  cols: number;
  storeId: string;
  edit?: boolean;
}

export interface CellCoordinates {
  x: number;
  y: number;
  type: string;
}

const Grid: React.FC<GridProps> = ({ rows, cols, storeId, edit }) => {
  const [selectedCells, setSelectedCells] = useState<CellCoordinates[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const cellSize = 50;
  const spacing = 10;

  useEffect(() => {
    const fetchMap = async () => {
      const baseData = await MapApi.getMap(storeId);

      if (baseData) setSelectedCells(baseData.items);
    };

    fetchMap();
  }, []);

  const supportColumn = [
    { style: styles.green, text: "Prateleira" },
    { style: styles.blue, text: "Frios" },
    { style: styles.purple, text: "Caixa" },
    { style: styles.red, text: "Obstáculo" },
  ];

  const handleClick = (x: number, y: number, type: string) => {
    if (!edit) return;
    const cellIsSelected = selectedCells.some(
      (cell) => cell.x === x && cell.y === y
    );
    const newSelectedCells = cellIsSelected
      ? selectedCells.filter((cell) => cell.x !== x || cell.y !== y)
      : [...selectedCells, { x, y, type }];

    setSelectedCells(newSelectedCells);
  };

  const isCellSelected = (x: number, y: number) => {
    return selectedCells.some((cell) => cell.x === x && cell.y === y);
  };

  const getCellType = (x: number, y: number) => {
    const cell = selectedCells.find((cell) => cell.x === x && cell.y === y);
    return cell?.type;
  };

  const getCellSyle = (x: number, y: number) => {
    const type = getCellType(x, y);
    const selected = supportColumn.find((a) => a.text === type);
    return selected?.style;
  };

  const generateCellKey = (x: number, y: number) => {
    return `cell-${x}-${y}`;
  };

  const gridStyle = {
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
  };

  const supportColumnStyle = {
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    gridTemplateColumns: `${rows}, ${cellSize}px`,
    gap: `${spacing}px`,
  };

  const saveMap = async () => {
    try {
      await MapApi.saveMap({ items: selectedCells });
      toast.success("Mapa salvo com sucesso");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };

  return (
    <Row>
      <Col>
        <div className={styles.grid} style={gridStyle}>
          {Array.from({ length: rows * cols }, (_, index) => {
            const x = index % cols;
            const y = Math.floor(index / cols);

            return (
              <div
                key={generateCellKey(x, y)}
                onClick={() => handleClick(x, y, selectedStyle)}
                className={`${styles.gridCell} ${
                  isCellSelected(x, y) && getCellSyle(x, y)
                }`}
              ></div>
            );
          })}
        </div>
      </Col>
      <Col>
        {edit && (
          <>
            <Button onClick={() => setSelectedCells([])}>Limpar</Button>
            <Button onClick={saveMap}>Salvar</Button>
          </>
        )}
        <div className={styles.supportColumn} style={supportColumnStyle}>
          {supportColumn.map((item, index) => (
            <div
              key={`support-cell-${index}`}
              className={styles.supportCellContainer}
              onClick={() => setSelectedStyle(item.text)}
            >
              <div className={`${styles.gridCell} ${item.style}`}>
                <div className={styles.supportSquare}></div>
              </div>
              <span className={styles.supportText}>{item.text}</span>
            </div>
          ))}
        </div>
      </Col>
    </Row>
  );
};

export default Grid;