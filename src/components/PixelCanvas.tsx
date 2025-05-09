import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getCursor } from "../util/helpers/getCursor";
import { drawGhostBrush } from "../util/helpers/drawGhostBrush";
import { drawBackgroundGrid } from "../util/helpers/drawBackgroundGrid";
import { refillForegroundGrid } from "../util/helpers/refillForegroundGrid";

interface PixelCanvasProps {
  zoom: number;
  penSize: number;
  pixelSize: number;
  isGrab: boolean;
  isGrabbing: boolean;
  selectedColor: string;
}

export default function PixelCanvas({
  zoom,
  penSize,
  pixelSize,
  isGrab,
  isGrabbing,
  selectedColor,
}: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoverPos, setHoverPos] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const rows = 48;
  const cols = 48;
  const canvasWidth = cols * pixelSize;
  const canvasHeight = rows * pixelSize;

  // Store pixel colors as 2D array
  const [pixels, setPixels] = useState<string[][]>(
    Array(rows)
      .fill(null)
      .map(() => Array(cols).fill("transparent")),
  );

  // Draw background grid on first page render
  useEffect(() => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawBackgroundGrid(ctx, rows, cols, pixelSize);
  }, []);

  // Draw the full grid
  const drawForegroundGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw pixels
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        ctx.fillStyle = pixels[row][col];
        ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
      }
    }

    // Show ghost brush
    if (hoverPos && !isDrawing && !isGrab && !isGrabbing) {
      const { row, col } = hoverPos;
      ctx.fillStyle = selectedColor; // semi-transparent color (hex alpha)

      drawGhostBrush(ctx, rows, cols, row, col, penSize, pixelSize);
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
      const newPixels = prev.map((r) => [...r]);
      refillForegroundGrid(
        newPixels,
        selectedColor,
        penSize,
        rows,
        cols,
        row,
        col,
      );
      return newPixels;
    });
  };

  // Handlers
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

  return (
    <div
      className="relative"
      style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
    >
      <canvas
        style={{ imageRendering: "pixelated" }}
        className="absolute -z-10"
        ref={gridCanvasRef}
        width={canvasWidth}
        height={canvasHeight}
      />
      <canvas
        style={{ imageRendering: "pixelated" }}
        className={getCursor("canvas", isGrab, isGrabbing)}
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setHoverPos(null);
        }}
      />
    </div>
  );
}
