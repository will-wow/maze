export interface Index {
  row: number;
  col: number;
}

export const isEqualIndex = (a: Index, b: Index): boolean => {
  return a.col === b.col && a.row === b.row;
};

export const makeIndex = (row: number, col: number): Index => {
  return { row, col };
};
