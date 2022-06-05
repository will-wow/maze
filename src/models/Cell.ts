import { arrayOf } from "../lib/arrayOf.ts";
import { Walls } from "./Wall.ts";

export interface Cell {
  visited: boolean;
  winning: number;
	isStart: boolean;
	isEnd: boolean;
  walls: Walls;
}

export const emptyCell = (): Cell => {
  return {
    visited: false,
    winning: -1,
		isStart: false,
		isEnd: false,
    walls: {
      top: true,
      left: true,
      bottom: true,
      right: true,
    },
  };
};

export const emptyRow = (size: number): Cell[] => {
  return arrayOf(size, emptyCell);
};
