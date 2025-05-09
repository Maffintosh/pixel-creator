const getGridColor = (row: number, col: number): string => {
  return ["#808080", "#c0c0c0"][(row + col) % 2];
};

export { getGridColor };
