import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import styles from "../styles/Grid.module.css";
import * as MapApi from "../network/mapApi";
import AlocateProductModal from "./Modal/AlocateProductModal";
import { useLocation } from "react-router-dom";
import pathfinding, { DiagonalMovement } from "pathfinding";

interface GridProps {
  rows: number;
  cols: number;
  storeId: string;
  edit?: boolean;
}

export interface CellCoordinates {
  x: number;
  y: number;
  type?: string;
}

const Grid: React.FC<GridProps> = ({ rows, cols, storeId, edit }) => {
  const location = useLocation();
  const queryParameters = new URLSearchParams(location.search);
  const locationX = queryParameters.get("x");
  const locationY = queryParameters.get("y");
  const [selectedCells, setSelectedCells] = useState<CellCoordinates[]>([]);
  const [selectedPath, setSelectedPath] = useState<CellCoordinates[][]>([]);
  const [selectedCell, setSelectedCell] = useState<CellCoordinates | undefined>(
    undefined
  );
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [alocateProduct, setAlocateProduct] = useState(false);
  const cellSize = 50;
  const spacing = 10;

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const baseData = await MapApi.getMap(storeId);

        if (baseData) setSelectedCells(baseData.items);
      } catch (error: any) {
        toast.error(error?.response?.data?.error ?? error?.message);
      }
    };

    fetchMap();
  }, []);

  const calculatePath = () => {
    const grid = new pathfinding.Grid(cols, rows);

    selectedCells.forEach((cell) => {
      grid.setWalkableAt(cell.x, cell.y, false);
    });
    console.log(selectedCells);
    console.log(grid);
    const finder = new pathfinding.AStarFinder({
      diagonalMovement: DiagonalMovement.OnlyWhenNoObstacles,
      //   dontCrossCorners: true,
    });
    const entranceNode = { x: 0, y: 0 }; // Replace with actual entrance coordinates
    const shelfNodes = [
      { x: 3, y: 3 },
      //   { x: 7, y: 7 },
    ]; // Replace with shelf coordinates

    const shortestPaths = shelfNodes.map((shelfNode) => {
      const path = finder.findPath(
        entranceNode.x,
        entranceNode.y,
        shelfNode.x,
        shelfNode.y,
        grid
      );
      return path;
    });
    const formattedPaths = shortestPaths.map((path) => {
      return path.map((node) => ({ x: node[0], y: node[1] }));
    });
    setSelectedPath(formattedPaths);
    console.log(shortestPaths);
  };

  const supportColumn = [
    { style: styles.green, text: "Prateleira" },
    { style: styles.blue, text: "Frios" },
    { style: styles.purple, text: "Caixa" },
    { style: styles.red, text: "Obstáculo" },
  ];

  const handleClick = (x: number, y: number, type: string) => {
    if (!edit) return;
    if (alocateProduct) {
      handleAlocateProduct(x, y);
    } else {
      const cellIsSelected = selectedCells.some(
        (cell) => cell.x === x && cell.y === y
      );
      const newSelectedCells = cellIsSelected
        ? selectedCells.filter((cell) => cell.x !== x || cell.y !== y)
        : [...selectedCells, { x, y, type }];

      setSelectedCells(newSelectedCells);
    }
  };

  const handleAlocateProduct = (x: number, y: number) => {
    setSelectedCell({ x, y });
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

  const productSelected = (x: number, y: number) => {
    if (
      locationX &&
      locationY &&
      x === parseInt(locationX) &&
      y === parseInt(locationY)
    )
      return styles.selected;
  };

  return (
    <Row>
      <Col>
        <div className={styles.grid} style={gridStyle}>
          {Array.from({ length: rows * cols }, (_, index) => {
            const x = index % cols;
            const y = Math.floor(index / cols);
            const isPathCell = selectedPath.some((path) =>
              path.some((coord) => coord.x === x && coord.y === y)
            );
            return (
              <div
                key={generateCellKey(x, y)}
                onClick={() => handleClick(x, y, selectedStyle)}
                className={`${styles.gridCell} ${
                  isCellSelected(x, y) && getCellSyle(x, y)
                } ${productSelected(x, y)} ${isPathCell ? styles.path : ""}`}
              ></div>
            );
          })}
        </div>
      </Col>
      <Col>
        {edit && (
          <>
            <Button
              className={styles.buttonMap}
              onClick={() => calculatePath()}
            >
              Calcular
            </Button>
            <Button
              className={styles.buttonMap}
              onClick={() => setSelectedCells([])}
            >
              Limpar
            </Button>
            <Button className={styles.buttonMap} onClick={saveMap}>
              Salvar
            </Button>
          </>
        )}
        <div className={styles.supportColumn} style={supportColumnStyle}>
          {supportColumn.map((item, index) => (
            <div
              key={`support-cell-${index}`}
              className={styles.supportCellContainer}
              onClick={() => {
                setSelectedStyle(item.text);
                setAlocateProduct(false);
              }}
            >
              <div
                className={`${styles.gridCell} ${item.style} ${
                  selectedStyle === item.text && styles.selected
                }`}
              >
                <div className={styles.supportSquare}></div>
              </div>
              <span className={styles.supportText}>{item.text}</span>
            </div>
          ))}
          {edit && (
            <div
              className={styles.supportCellContainer}
              onClick={() => {
                setAlocateProduct(!alocateProduct);
                setSelectedStyle("");
              }}
            >
              <div
                className={`${styles.gridCell} ${
                  alocateProduct && styles.selected
                }`}
              >
                <div className={styles.supportSquare}></div>
              </div>
              <span className={styles.supportText}>Alocar produtos</span>
            </div>
          )}
        </div>
      </Col>
      {selectedCell && (
        <AlocateProductModal
          acceptText="Alocar"
          dismissText="Recusar"
          location={selectedCell}
          onAccepted={() => {
            setSelectedCell(undefined);
          }}
          onDismiss={() => {
            setSelectedCell(undefined);
          }}
        />
      )}
    </Row>
  );
};

export default Grid;
