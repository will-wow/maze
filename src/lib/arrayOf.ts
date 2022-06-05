export const arrayOf = <T>(size: number, getter: () => T): T[] => {
  const array = [];
  for (let i = 0; i < size; i++) {
    array.push(getter());
  }
  return array;
};
