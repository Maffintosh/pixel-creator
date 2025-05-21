import { useEffect, useRef, useState } from "react";
import { getCanvasCtx } from "../util/helpers/getCanvasContext";
import { useSelectedToolContext } from "../store/SelectedToolContext";

export default function ColorPicker() {
  const { setSelectedColor } = useSelectedToolContext();
  const [hue, setHue] = useState(0);
  const [sv, setSV] = useState({ s: 0, v: 0 });

  const cnvSize = 200;

  const svRef = useRef<HTMLCanvasElement>(null);
  const hueRef = useRef<HTMLCanvasElement>(null);

  const drawHue = () => {
    const ctx = getCanvasCtx(hueRef.current);
    const width = 25;
    const height = cnvSize;

    const hueGradient = ctx.createLinearGradient(0, 0, 0, height);

    for (let i = 0; i <= 360; i++) {
      hueGradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
    }

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = hueGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw HUE selector
    const y = (hue / 360) * height;

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.stroke();
  };

  const drawSV = () => {
    const ctx = getCanvasCtx(svRef.current);

    // Base color
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(0, 0, cnvSize, cnvSize);

    // Tint overlay
    const whiteGradient = ctx.createLinearGradient(0, 0, cnvSize, cnvSize);
    whiteGradient.addColorStop(0, "white");
    whiteGradient.addColorStop(1, "transparent");
    ctx.fillStyle = whiteGradient;
    ctx.fillRect(0, 0, cnvSize, cnvSize);

    // Shade overlay
    const blackGradient = ctx.createLinearGradient(0, 0, 0, cnvSize);
    blackGradient.addColorStop(0, "transparent");
    blackGradient.addColorStop(1, "black");
    ctx.fillStyle = blackGradient;
    ctx.fillRect(0, 0, cnvSize, cnvSize);

    // Draw SV marker
    const x = sv.s * cnvSize;
    const y = (1 - sv.v) * cnvSize;

    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  };

  const handleHueMouseDown = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    const cnv = hueRef.current;
    if (!cnv) return;

    const rect = cnv.getBoundingClientRect();

    const updatehue = (clientY: number) => {
      const y = clientY - rect.top;
      const clampedY = Math.max(0, Math.min(1, y / 200));
      setHue(clampedY * 360);
    };

    const move = (e: MouseEvent) => {
      updatehue(e.clientY);
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    updatehue(evt.clientY);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const handleSvMouseDown = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    const cnv = svRef.current;
    if (!cnv) return;

    const move = (e: MouseEvent) => {
      const rect = cnv.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setSV({
        s: Math.max(0, Math.min(1, x / cnvSize)),
        v: Math.max(0, Math.min(1, 1 - y / cnvSize)),
      });
    };

    move(evt.nativeEvent);

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  useEffect(() => {
    drawSV();
    drawHue();
    setSelectedColor(`hsl(${hue}, ${sv.s * 100}%, ${sv.v * 50}%)`);
  }, [hue, sv]);

  return (
    <div className="fixed top-4 right-8 flex gap-4">
      <canvas
        className="rounded-lg"
        ref={hueRef}
        width={25}
        height={cnvSize}
        onMouseDown={handleHueMouseDown}
      />
      <canvas
        className="rounded-lg"
        ref={svRef}
        width={cnvSize}
        height={cnvSize}
        onMouseDown={handleSvMouseDown}
      />
    </div>
  );
}
