import { arrayOf } from "../lib/arrayOf.ts";
import { Cell, emptyRow } from "./Cell.ts";
import { Index } from "./CellIndex.ts";

export type Map = Cell[][];

export const emptyMap = (size: number): Map => {
  return arrayOf(size, () => emptyRow(size));
};

export const getCell = ({ row, col }: Index, map: Map): Cell => {
  return map[row][col];
};

export const getValidNeighbors = ({ row, col }: Index, map: Map): Index[] => {
  const neighbors: Index[] = [
    { row: row - 1, col },
    { row, col: col - 1 },
    { row, col: col + 1 },
    { row: row + 1, col },
  ];

	const size = map.length;

  return neighbors.filter((index) => {
    const { row, col } = index;
    if (row < 0 || row >= size) return false;
    if (col < 0 || col >= size) return false;
    if (getCell(index, map).visited) return false;
    return true;
  });
};
