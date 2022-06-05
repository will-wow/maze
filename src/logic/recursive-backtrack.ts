import { sample } from "../lib/utils.ts";
import { Index, isEqualIndex } from "../models/CellIndex.ts";
import { getValidNeighbors, getCell, Map } from "../models/Map.ts";
import { WallName } from "../models/Wall.ts";

const getNextCellIndex = (index: Index, map: Map): Index | null => {
  return sample(getValidNeighbors(index, map));
};

const backtrack = (
  stack: Index[],
  map: Map
): [current: Index, next: Index] | null => {
  while (true) {
    // pop the dead-end cell from the stack.
    stack.pop();

    // Peek the next cell.
    const current = stack[stack.length - 1];
    if (!current) return null;

    const next = getNextCellIndex(current, map);
    if (next) {
      // If there is a valid neighbor, return it and leave current on the stack.
      return [current, next];
    }
  }
};

const overlappingWalls = (a: Index, b: Index): [WallName, WallName] => {
  if (a.row < b.row) return ["bottom", "top"];
  if (a.row > b.row) return ["top", "bottom"];
  if (a.col < b.col) return ["right", "left"];
  if (a.col > b.col) return ["left", "right"];
  throw new Error(`a and b are the same: ${a}, ${b}`);
};

const markWinningStack = (map: Map, stack: Index[]) => {
  stack.forEach(({ row, col }, index) => {
    getCell({ row, col }, map).winning = index;
  });
};

/** Mutate a map with a maze. */
export const makeMazeRecursiveBacktrack = (
  map: Map,
  start: Index,
  end: Index
): void => {
  const stack: Index[] = [];

  let current = start;
  // Mark the start cell.
  getCell(current, map).isStart = true;

  while (true) {
    // Mark current cell as visited.
    getCell(current, map).visited = true;
    stack.push(current);

    // If we made it to the end, mark the winning stack.
    if (isEqualIndex(current, end)) {
      getCell(current, map).isEnd = true;
      markWinningStack(map, stack);
    }

    // Get the next cell to visit.
    let next = getNextCellIndex(current, map);

    // Backtrack if there are no valid neighbors.
    if (!next) {
      const result = backtrack(stack, map);
      // If there's nothing left, we're done.
      if (!result) return;
      [current, next] = result;
    }

    const nextCell = getCell(next, map);

    // Open walls
    const [currentWall, nextWall] = overlappingWalls(current, next);
    getCell(current, map).walls[currentWall] = false;
    nextCell.walls[nextWall] = false;

    // Iterate.
    current = next;
  }
};
