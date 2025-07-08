import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getCursor } from "../../util/helpers/getCursor";
import { drawBackgroundGrid } from "../../util/helpers/drawBackgroundGrid";
import { useCanvasSettingsContext } from "../../store/CanvasSettingsContext";
import { useAppStateContext } from "../../store/AppStateContext";
import { useSelectedToolContext } from "../../store/SelectedToolContext";
import { getCanvasCtx } from "../../util/helpers/getCanvasContext";
import hsvToCss from "../../util/helpers/hsvToCss";

export default function PixelCanvas() {
  const { resolution, zoom, pixelSize } = useCanvasSettingsContext();
  const { isGrab, isGrabbing } = useAppStateContext();
  const { penSize, selectedColor, selectedTool } = useSelectedToolContext();

  const [isDrawing, setIsDrawing] = useState(false);
  const [hoverPos, setHoverPos] = useState<{ row: number; col: number } | null>(
    null,
  );

  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const pixelCanvasRef = useRef<HTMLCanvasElement>(null);
  const ghostCanvasRef = useRef<HTMLCanvasElement>(null);

  const { logicWidth, logicHeight } = resolution;
  const visualWidth = logicWidth * pixelSize;
  const visualHeight = logicHeight * pixelSize;

  // State for pixels and history
  const [pixels, setPixels] = useState<string[][]>(
    Array(logicHeight)
      .fill(null)
      .map(() => Array(logicWidth).fill("transparent")),
  );
  const [history, setHistory] = useState<string[][][]>([]);
  const [historyStep, setHistoryStep] = useState(0);

  // Init history
  useEffect(() => {
    const initial = pixels.map((row) => [...row]);
    setHistory([initial]);
    setHistoryStep(0);
  }, []);

  // Draw background grid
  useEffect(() => {
    const ctx = getCanvasCtx(gridCanvasRef.current);
    drawBackgroundGrid(ctx, logicHeight, logicWidth, pixelSize);
  }, []);

  // Redraw pixel layer
  const drawPixelCanvas = () => {
    const ctx = getCanvasCtx(pixelCanvasRef.current);
    ctx.clearRect(0, 0, visualWidth, visualHeight);

    for (let row = 0; row < logicHeight; row++) {
      for (let col = 0; col < logicWidth; col++) {
        ctx.fillStyle = pixels[row][col];
        ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
      }
    }
  };

  // Redraw ghost brush
  const drawGhostBrush = () => {
    const ctx = getCanvasCtx(ghostCanvasRef.current);
    ctx.clearRect(0, 0, visualWidth, visualHeight);

    if (hoverPos && !isDrawing && !isGrab) {
      const { row, col } = hoverPos;
      ctx.fillStyle =
        selectedTool === "eraser" ? "transparent" : hsvToCss(selectedColor);

      for (let dy = 0; dy < penSize; dy++) {
        for (let dx = 0; dx < penSize; dx++) {
          const center = (penSize - 1) / 2;
          const dist = Math.sqrt((dx - center) ** 2 + (dy - center) ** 2);

          if (dist > center) continue;

          const r = row + dy;
          const c = col + dx;

          if (r >= 0 && r < logicHeight && c >= 0 && c < logicWidth) {
            ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
          }
        }
      }
    }
  };

  useLayoutEffect(() => {
    drawPixelCanvas();
  }, [pixels]);

  useLayoutEffect(() => {
    drawGhostBrush();
  }, [hoverPos, isDrawing]);

  const getCell = (evt: React.MouseEvent) => {
    const rect = pixelCanvasRef.current!.getBoundingClientRect();
    const x = (evt.clientX - rect.left) / zoom;
    const y = (evt.clientY - rect.top) / zoom;
    return {
      col: Math.floor(x / pixelSize),
      row: Math.floor(y / pixelSize),
    };
  };

  const drawPixel = (row: number, col: number) => {
    if (isGrab) return;

    setPixels((prev) => {
      const next = prev.map((r) => [...r]);
      for (let dy = 0; dy < penSize; dy++) {
        for (let dx = 0; dx < penSize; dx++) {
          const center = (penSize - 1) / 2;
          const dist = Math.sqrt((dx - center) ** 2 + (dy - center) ** 2);

          if (dist > center) continue;

          const r = row + dy;
          const c = col + dx;

          if (r >= 0 && r < logicHeight && c >= 0 && c < logicWidth) {
            next[r][c] =
              selectedTool === "eraser"
                ? "transparent"
                : hsvToCss(selectedColor);
          }
        }
      }
      return next;
    });
  };

  // Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const { row, col } = getCell(e);
    drawPixel(row, col);
    setIsDrawing(true);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    const newPixels = pixels.map((row) => [...row]);

    setHistory((prev) => [...prev.slice(0, historyStep + 1), newPixels]);
    setHistoryStep((prev) => prev + 1);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { row, col } = getCell(e);
    setHoverPos({ row, col });

    if (isDrawing) {
      drawPixel(row, col);
    }
  };

  const handleMouseLeave = () => {
    setHoverPos(null);
    setIsDrawing(false);
  };

  // Undo with CTRL+Z
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        setHistoryStep((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Apply undo history
  useEffect(() => {
    if (history[historyStep]) {
      setPixels(history[historyStep].map((row) => [...row]));
    }
  }, [historyStep]);

  return (
    <div
      className="relative"
      style={{
        width: visualWidth,
        height: visualHeight,
        transform: `scale(${zoom})`,
        transformOrigin: "center center",
      }}
    >
      <canvas
        ref={gridCanvasRef}
        width={visualWidth}
        height={visualHeight}
        className="absolute -z-10"
      />
      <canvas
        ref={pixelCanvasRef}
        width={visualWidth}
        height={visualHeight}
        className={`absolute ${getCursor("canvas", isGrab, isGrabbing)}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
      <canvas
        ref={ghostCanvasRef}
        width={visualWidth}
        height={visualHeight}
        className="absolute z-10"
        style={{
          pointerEvents: "none", // Prevent from blocking interactions
        }}
      />
    </div>
  );
}
