import { useEffect, useRef, useState } from "react";
import { getCursor } from "../util/helpers/getCursor";

interface PixelCanvasProps {
  isGrab: boolean;
  isGrabbing: boolean;
}

export default function PixelCanvas({ isGrab, isGrabbing }: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const penSize = 3;
  const [hoverPos, setHoverPos] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedTool, setSelectedTool] = useState<"brush" | "eraser">("brush");

  const pixelSize = 16;
  const rows = 48;
  const cols = 48;
  const canvasWidth = cols * pixelSize;
  const canvasHeight = rows * pixelSize;

  // Store pixel colors as 2D array
  const [pixels, setPixels] = useState<string[][]>(
    Array(rows)
      .fill(null)
      .map(() => Array(cols).fill("#ffffff")),
  );

  // Draw the full grid
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    //ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw pixels
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        ctx.fillStyle = pixels[row][col];
        ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
      }
    }

    // Show ghost brush
    if (hoverPos && !isDrawing) {
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

    // Draw grid
    //ctx.strokeStyle = "#000";
    //for (let i = 0; i <= cols; i++) {
    //  ctx.beginPath();
    //  ctx.moveTo(i * pixelSize, 0);
    //  ctx.lineTo(i * pixelSize, canvasHeight);
    //  ctx.stroke();
    //}
    //for (let i = 0; i <= rows; i++) {
    //  ctx.beginPath();
    //  ctx.moveTo(0, i * pixelSize);
    //  ctx.lineTo(canvasWidth, i * pixelSize);
    //  ctx.stroke();
    //}
  };

  useEffect(() => {
    drawCanvas();
  }, [pixels, hoverPos, isDrawing]);

  // Convert mouse coordinates to grid cell
  const getCell = (event: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor(x / pixelSize);
    const row = Math.floor(y / pixelSize);
    return { row, col };
  };

  const drawPixel = (row: number, col: number) => {
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
    <div>
      <canvas
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
      <div className="mt-4">
        <label>Color: </label>
        <input
          className="w-10 h-10 rounded-full"
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        />
      </div>
    </div>
  );
}
