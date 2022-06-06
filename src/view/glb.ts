import { three, GLTFExporter } from "../deps.ts";
import { Map } from "../models/Map.ts";

export const mapToGlb = (map: Map) => {
  const scene = new three.Scene();

  const wallMaterial = new three.MeshStandardMaterial();
  const startMaterial = new three.MeshStandardMaterial({ color: "green" });
  const endMaterial = new three.MeshStandardMaterial({ color: "red" });

  const wallWidth = 0.8;
  const wallDepth = 0.1;

  const horizontalGeometry = new three.BoxGeometry(0.8, 3, 0.1);
  const verticalGeometry = new three.BoxGeometry(wallDepth, 3, 0.8);

  const shape = new three.Shape();

  map.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellGroup = new three.Group();

      const material = cell.isStart
        ? startMaterial
        : cell.isEnd
        ? endMaterial
        : wallMaterial;

      cellGroup.position.set(colIndex, 0, rowIndex);

      if (cell.walls.top) {
        const top = new three.Mesh(horizontalGeometry, material);
        top.position.set(wallWidth / 2, 0, 0);
        cellGroup.add(top);
      }

      if (cell.walls.left) {
        const left = new three.Mesh(verticalGeometry, material);
        left.position.set(0, 0, wallWidth / 2);
        cellGroup.add(left);
      }

      if (cell.walls.bottom) {
        const bottom = new three.Mesh(horizontalGeometry, material);
        bottom.position.set(wallWidth / 2, 0, wallWidth);
        cellGroup.add(bottom);
      }

      if (cell.walls.right) {
        const right = new three.Mesh(verticalGeometry, material);
        right.position.set(wallWidth, 0, wallWidth / 2);
        cellGroup.add(right);
      }

      scene.add(cellGroup);
    });
  });

  const exporter = new GLTFExporter();
  exporter.parse(
    scene,
    async (gltf) => {
      if (gltf instanceof ArrayBuffer) {
        await Deno.writeFile("./data/maze.glb", new Uint8Array(gltf));
      } else {
        throw new Error("GLTF not arraybuffer");
      }
    },
    { binary: true }
  );
};
