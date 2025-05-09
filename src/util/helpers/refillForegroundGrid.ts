import { isEdge } from "./isEdge";

const refillForegroundGrid = (
  newPixels: string[][],
  selectedColor: string,
  penSize: number,
  rows: number,
  cols: number,
  row: number,
  col: number,
) => {
  for (let dy = 0; dy < penSize; dy++) {
    for (let dx = 0; dx < penSize; dx++) {
      if (penSize > 2 && isEdge(penSize, dy, dx)) continue;

      const r = row + dy;
      const c = col + dx;

      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        newPixels[r][c] = selectedColor;
      }
    }
  }
};

export { refillForegroundGrid };
