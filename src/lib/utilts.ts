/** Take a random sample of a list */
export const sample = <T>(list: T[]): T | null => {
  if (list.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
};