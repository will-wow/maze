import { Map } from "../models/Map.ts";
import { Cell } from "../models/Cell.ts";

export const printRow = (row: Cell[], rowIndex: number, showPath: boolean) => {
  let displayRows = [];

  if (rowIndex === 0) {
    // First row for to of the map.
    displayRows.push(["  |", ...row.map(() => "____")]);
  }

  displayRows.push([
    rowIndex.toString().padStart(2, "0") + "|",
    ...row.map((cell) => {
      const right = cell.walls.right ? "|" : " ";
      return getCellValue(cell, showPath) + right;
    }),
  ]);
  displayRows.push([
    "  |",
    ...row.map((cell) => {
      const bottom = cell.walls.bottom ? "___" : "   ";
      const corner = cell.walls.right ? "|" : cell.walls.bottom ? "_" : " ";
      return bottom + corner;
    }),
  ]);

  return displayRows.map((row) => row.join("")).join("\n");
};

export const printMap = (map: Map, showPath: boolean) => {
  const rows = map.map((row, index) => printRow(row, index, showPath));

  return rows.join("\n");
};

const getCellValue = (cell: Cell, showPath: boolean) => {
  if (cell.isStart) return " S ";
  if (cell.isEnd) return " E ";
  if (!showPath) return "   ";
  if (cell.winning >= 0) return cell.winning.toString().padStart(3, "0");
  return "   ";
};
