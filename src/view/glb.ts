import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import { three, GLTFExporter } from "../deps.ts";
import { Map } from "../models/Map.ts";

export const mapToGlb = async (map: Map) => {
  const wallMaterial = new three.MeshStandardMaterial();
  const startMaterial = new three.MeshStandardMaterial({ color: "green" });
  const endMaterial = new three.MeshStandardMaterial({ color: "red" });

  const height = 3;
  const width = 0.8;
  const thickness = 0.1;

  const horizontalGeometry = new three.BoxBufferGeometry(
    width,
    height,
    thickness
  );
  const verticalGeometry = new three.BoxBufferGeometry(thickness, 3, width);

  const scene = new three.Scene();
  window.document = {
    createElement(tagName: "canvas") {
      const canvas = createCanvas(4272, 2848);
      const bigCanvas = Object.create(canvas, {
        width: { value: 4272, writable: true },
        height: { value: 2848, writable: true },
      });
      return bigCanvas;
    },
  } as Document;

  const textureData = await Deno.readFile("./src/assets/stucco.jpg");
  const texture = new three.DataTexture(textureData, 4272, 2848);

  // const imageUrl = URL.createObjectURL(
  //   new Blob([textureData.buffer], { type: "image/jpf" })
  // );

  // const image = new Image();
  // image.src = imageUrl;

  // const texture = new three.Texture(image);

  map.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellGroup = new three.Group();

      const material = cell.isStart
        ? startMaterial
        : cell.isEnd
        ? endMaterial
        : wallMaterial;

      const addWall = (horizontal: boolean, x: number, z: number) => {
        const mesh = new three.Mesh(
          horizontal ? horizontalGeometry : verticalGeometry,
          material
        );
        mesh.position.set(x, height / 2, z);

        cellGroup.add(mesh);
      };

      cellGroup.position.set(colIndex, 0, rowIndex);

      const ball = new three.Mesh(
        new three.SphereBufferGeometry(0.2),
        new three.MeshStandardMaterial({ color: "blue" })
      );
      cellGroup.add(ball);

      if (cell.walls.top) addWall(true, 0, -width / 2);
      if (cell.walls.bottom) addWall(true, 0, width / 2);
      if (cell.walls.right) addWall(false, width / 2, 0);
      if (cell.walls.left) addWall(false, -width / 2, 0);

      scene.add(cellGroup);
    });
  });

  exportGltf(scene);
};

const exportGltf = (scene: three.Scene): Promise<void> => {
  const exporter = new GLTFExporter();
  return new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      async (gltf) => {
        if (gltf instanceof ArrayBuffer) {
          await Deno.writeFile("./data/maze.glb", new Uint8Array(gltf));
          resolve();
        } else {
          reject(new Error("GLTF not arraybuffer"));
        }
      },
      { binary: true }
    );
  });
};
