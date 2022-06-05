import { three, GLTFExporter } from "../deps.ts";
import { Map } from "../models/Map.ts";

export const mapToGlb = (map: Map) => {
  const scene = new three.Scene();

  const wallMaterial = new three.MeshStandardMaterial();
  const startMaterial = new three.MeshStandardMaterial({ color: "green" });
  const endMaterial = new three.MeshStandardMaterial({ color: "red" });
  const verticalGeometry = new three.BoxGeometry(0.1, 3, 0.8);
  const horizontalGeometry = new three.BoxGeometry(0.8, 3, 0.1);

  map.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellGroup = new three.Group();

      const material = cell.isStart
        ? startMaterial
        : cell.isEnd
        ? endMaterial
        : wallMaterial;

      cellGroup.position.set(rowIndex, 0, colIndex);

      if (cell.walls.top) {
        const top = new three.Mesh(horizontalGeometry, material);
        top.position.set(0, 0, -0.5);
        cellGroup.add(top);
      }

      if (cell.walls.right) {
        const right = new three.Mesh(verticalGeometry, material);
        right.position.set(-0.5, 0, 0);
        cellGroup.add(right);
      }

      if (cell.walls.bottom) {
        const bottom = new three.Mesh(horizontalGeometry, material);
        bottom.position.set(0, 0, 0.5);
        cellGroup.add(bottom);
      }

      if (cell.walls.left) {
        const left = new three.Mesh(verticalGeometry, material);
        left.position.set(0.5, 0, 0);
        cellGroup.add(left);
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
