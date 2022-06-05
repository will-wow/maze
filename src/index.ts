import { parse } from "./deps.ts";
import { emptyMap } from "./models/Map.ts";
import { printMap } from "./logic/print.ts";
import { makeMazeRecursiveBacktrack } from "./logic/recursive-backtrack.ts";

const { size = 20 } = parse(Deno.args);

const map = emptyMap(size);
makeMazeRecursiveBacktrack(
  map,
  { row: 0, col: 0 },
  { row: size - 1, col: size - 1 }
);

console.log(printMap(map, false));
console.log("\n");
console.log(printMap(map, true));
