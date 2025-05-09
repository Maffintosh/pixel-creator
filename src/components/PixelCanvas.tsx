import { useEffect, useRef, useState } from "react";
import { getCursor } from "../util/helpers/getCursor";

interface PixelCanvasProps {
  zoom: number;
  pixelSize: number;
  isGrab: boolean;
  isGrabbing: boolean;
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
}

export default function PixelCanvas({
  zoom,
  pixelSize,
  isGrab,
  isGrabbing,
  selectedColor,
  setSelectedColor,
}: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const penSize = 1;
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

    const getGridColor = (row: number, col: number): string => {
      return ["gray", "#fff"][(row + col) % 2];
    };

    for (let row = 0; row < rows / pixelSize; row++) {
      for (let col = 0; col < cols / pixelSize; col++) {
        ctx.fillStyle = getGridColor(row, col);
        ctx.fillRect(
          col * Math.pow(pixelSize, 2),
          row * Math.pow(pixelSize, 2),
          Math.pow(pixelSize, 2),
          Math.pow(pixelSize, 2),
        );
      }
    }
  }, []);

  // Draw the full grid
  const drawCanvas = () => {
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

      if (penSize <= 2) {
        for (let dy = 0; dy < penSize; dy++) {
          for (let dx = 0; dx < penSize; dx++) {
            const r = row + dy;
            const c = col + dx;

            if (r >= 0 && r < rows && c >= 0 && c < cols) {
              ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
            }
          }
        }
      } else {
        for (let dy = 0; dy < penSize; dy++) {
          for (let dx = 0; dx < penSize; dx++) {
            if (
              (dy === 0 && dx === 0) ||
              (dy === 0 && dx === penSize - 1) ||
              (dy === penSize - 1 && dx === 0) ||
              (dy === penSize - 1 && dx === penSize - 1)
            )
              continue;
            const r = row + dy;
            const c = col + dx;
            if (r >= 0 && r < rows && c >= 0 && c < cols) {
              ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    drawCanvas();
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
    if (penSize <= 2) {
      setPixels((prev) => {
        const newPixels = prev.map((r) => [...r]);
        for (let dy = 0; dy < penSize; dy++) {
          for (let dx = 0; dx < penSize; dx++) {
            const r = row + dy;
            const c = col + dx;

            if (r >= 0 && r < rows && c >= 0 && c < cols) {
              newPixels[r][c] = selectedColor;
            }
          }
        }
        return newPixels;
      });
    }

    setPixels((prev) => {
      const newPixels = prev.map((r) => [...r]);
      for (let dy = 0; dy < penSize; dy++) {
        for (let dx = 0; dx < penSize; dx++) {
          if (
            (dy === 0 && dx === 0) ||
            (dy === 0 && dx === penSize - 1) ||
            (dy === penSize - 1 && dx === 0) ||
            (dy === penSize - 1 && dx === penSize - 1)
          )
            continue;
          const r = row + dy;
          const c = col + dx;
          if (r >= 0 && r < rows && c >= 0 && c < cols) {
            newPixels[r][c] = selectedColor;
          }
        }
      }
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
          handleMouseUp();
          setHoverPos(null);
        }}
      />
    </div>
  );
}
