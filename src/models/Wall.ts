export interface Walls {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}

export type WallName = keyof Walls;