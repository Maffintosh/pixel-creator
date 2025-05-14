const drawBackgroundGrid = (
  ctx: CanvasRenderingContext2D,
  rows: number,
  cols: number,
  pixelSize: number,
) => {
  for (let row = 0; row < rows / pixelSize; row++) {
    for (let col = 0; col < cols / pixelSize; col++) {
      ctx.fillStyle = ["#808080", "#c0c0c0"][(row + col) % 2];
      ctx.fillRect(
        col * Math.pow(pixelSize, 2),
        row * Math.pow(pixelSize, 2),
        Math.pow(pixelSize, 2),
        Math.pow(pixelSize, 2),
      );
    }
  }
};

export { drawBackgroundGrid };
