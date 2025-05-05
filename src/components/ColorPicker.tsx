import React, { useRef, useEffect, useState } from "react";

const SIZE = 200; // Canvas size in pixels
const RADIUS = SIZE / 2;

const HueWheel = ({ onChange }: { onChange: (color: string) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(0);

  // Draw hue circle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = ctx.createImageData(SIZE, SIZE);
    const center = RADIUS;

    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const dx = x - center;
        const dy = y - center;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > center || distance < center - 20) continue;

        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        if (angle < 0) angle += 360;

        const color = `hsl(${angle}, 100%, 50%)`;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left - RADIUS;
    const y = e.clientY - rect.top - RADIUS;
    const angle = Math.atan2(y, x) * (180 / Math.PI);
    const hue = (angle + 360) % 360;
    setAngle(hue);
    onChange(`hsl(${hue}, 100%, 50%)`);
  };

  return (
    <div style={{ position: "relative", width: SIZE, height: SIZE }}>
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        onClick={handleClick}
        style={{ borderRadius: "50%", cursor: "crosshair" }}
      />
      {/* Optional: Draw a selector dot here */}
    </div>
  );
};

export default HueWheel;
