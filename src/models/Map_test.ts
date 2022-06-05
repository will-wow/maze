// url_test.ts
import { assertEquals } from "https://deno.land/std@0.142.0/testing/asserts.ts";
import { makeIndex } from "./CellIndex.ts";
import { emptyMap,getValidNeighbors } from "./Map.ts";

Deno.test("validNeighbors", () => {
  const url = new URL("./foo.js", "https://deno.land/");
  assertEquals(url.href, "https://deno.land/foo.js");

  const index = { row: 3, col: 1 };
  const map = emptyMap(5);

  const neighbors = getValidNeighbors(index, map);

  assertEquals(neighbors, [
    makeIndex(2, 1),
    makeIndex(3, 0),
    makeIndex(3, 2),
    makeIndex(4, 1),
  ]);
});
