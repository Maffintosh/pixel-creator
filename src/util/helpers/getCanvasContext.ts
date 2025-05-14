export const getCanvasCtx = (
  canvas: HTMLCanvasElement | null,
): CanvasRenderingContext2D => {
  if (!canvas) {
    throw new Error("Please create the canvas first");
  }

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Please create the context first");
  }

  return ctx;
};
