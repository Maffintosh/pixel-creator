import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getCursor } from "../../util/helpers/getCursor";
import { drawGhostBrush } from "../../util/helpers/drawGhostBrush";
import { drawBackgroundGrid } from "../../util/helpers/drawBackgroundGrid";
import { refillForegroundGrid } from "../../util/helpers/refillForegroundGrid";
import { useCanvasSettingsContext } from "../../store/CanvasSettingsContext";
import { useAppStateContext } from "../../store/AppStateContext";
import { useSelectedToolContext } from "../../store/SelectedToolContext";
import { getCanvasCtx } from "../../util/helpers/getCanvasContext";

export default function PixelCanvas() {
  const { resolution, zoom, pixelSize } = useCanvasSettingsContext();
  const { isGrab, isGrabbing } = useAppStateContext();
  const { penSize, selectedColor } = useSelectedToolContext();
  const [isDrawing, setIsDrawing] = useState(false);
  const [hoverPos, setHoverPos] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const { logicWidth, logicHeight } = resolution;
  const visualWidth = logicWidth * pixelSize;
  const visualHeight = logicHeight * pixelSize;

  // Store pixel colors as 2D array
  const [pixels, setPixels] = useState<string[][]>(
    Array(logicHeight)
      .fill(null)
      .map(() => Array(logicWidth).fill("transparent")),
  );

  // Draw background grid on first page render
  useEffect(() => {
    const ctx = getCanvasCtx(gridCanvasRef.current);
    drawBackgroundGrid(ctx, logicHeight, logicWidth, pixelSize);
  }, []);

  // Draw the full grid
  const drawForegroundGrid = () => {
    const ctx = getCanvasCtx(canvasRef.current);
    // Clear canvas from ghost brush
    ctx.clearRect(0, 0, visualWidth, visualHeight);

    // Draw pixels
    for (let row = 0; row < logicHeight; row++) {
      for (let col = 0; col < logicWidth; col++) {
        ctx.fillStyle = pixels[row][col];
        ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
      }
    }

    // Show ghost brush
    if (hoverPos && !isDrawing && !isGrab && !isGrabbing) {
      const { row, col } = hoverPos;
      ctx.fillStyle = selectedColor;

      drawGhostBrush(
        ctx,
        logicHeight,
        logicWidth,
        row,
        col,
        penSize,
        pixelSize,
      );
    }
  };

  useLayoutEffect(() => {
    drawForegroundGrid();
  }, [pixels, hoverPos, isDrawing]);

  // Convert mouse coordinates to grid cell
  const getCell = (event: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoom;
    const y = (event.clientY - rect.top) / zoom;
    const col = Math.floor(x / pixelSize);
    const row = Math.floor(y / pixelSize);
    return { row, col };
  };

  const drawPixel = (row: number, col: number) => {
    if (isGrab || isGrabbing) return;

    setPixels((prev) => {
      //if (prev[row][col] === selectedColor) return prev;

      const newPixels = prev.map((r) => [...r]);
      refillForegroundGrid(
        newPixels,
        selectedColor,
        penSize,
        logicHeight,
        logicWidth,
        row,
        col,
      );
      return newPixels;
    });
  };

  // HANDLERS
  const handleMouseDown = (e: React.MouseEvent) => {
    const { row, col } = getCell(e);
    drawPixel(row, col);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { row, col } = getCell(e);
    setHoverPos({ row, col });

    if (isDrawing) {
      drawPixel(row, col);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseLeave = () => {
    setHoverPos(null);
  };

  return (
    <div
      className="relative"
      style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
    >
      <canvas
        style={{ imageRendering: "pixelated" }}
        className="absolute -z-10"
        ref={gridCanvasRef}
        width={visualWidth}
        height={visualHeight}
      />
      <canvas
        style={{ imageRendering: "pixelated" }}
        className={getCursor("canvas", isGrab, isGrabbing)}
        ref={canvasRef}
        width={visualWidth}
        height={visualHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
}
