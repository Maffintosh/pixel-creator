import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useSelectedToolContext } from "../store/SelectedToolContext";

export default function CustomColorPicker() {
  const { setSelectedColor } = useSelectedToolContext();
  const [hue, setHue] = useState(0);
  const [sv, setSV] = useState({ s: 0, v: 0 });

  const svCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const hueCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const hueSize = 300;
  const svSize = 150;
  const center = hueSize / 2;
  const ringInnerRadius = svSize / 2 + 10;
  const ringOuterRadius = svSize / 2 + 30;

  const drawHueRing = (ctx: CanvasRenderingContext2D) => {
    const image = ctx.createImageData(hueSize, hueSize);

    for (let y = 0; y < hueSize; y++) {
      for (let x = 0; x < hueSize; x++) {
        const dx = x - center;
        const dy = y - center;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist >= ringInnerRadius && dist <= ringOuterRadius) {
          const angle = Math.atan2(dy, dx);
          const hueAngle = (angle * 180) / Math.PI;
          const h = (hueAngle + 360) % 360;
          const [r, g, b] = hslToRgb(h / 360, 1, 0.5);
          const idx = (y * hueSize + x) * 4;

          image.data[idx] = r;
          image.data[idx + 1] = g;
          image.data[idx + 2] = b;
          image.data[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(image, 0, 0);

    // Draw hue marker
    const angleRad = (hue * Math.PI) / 180;
    const rx = Math.cos(angleRad) * ((ringInnerRadius + ringOuterRadius) / 2);
    const ry = Math.sin(angleRad) * ((ringInnerRadius + ringOuterRadius) / 2);

    ctx.beginPath();
    ctx.arc(center + rx, center + ry, 4, 0, 2 * Math.PI);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center + rx, center + ry, 5, 0, Math.PI * 2);
    ctx.strokeStyle = "black";
    ctx.stroke();
  };

  const drawSV = (ctx: CanvasRenderingContext2D) => {
    const width = svSize;
    const height = svSize;

    // Base color
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(0, 0, width, height);

    const whiteGradient = ctx.createLinearGradient(0, 0, width, height);
    whiteGradient.addColorStop(0, "white");
    whiteGradient.addColorStop(1, "transparent");
    ctx.fillStyle = whiteGradient;
    ctx.fillRect(0, 0, width, height);

    const blackGradient = ctx.createLinearGradient(0, 0, 0, height);
    blackGradient.addColorStop(0, "transparent");
    blackGradient.addColorStop(1, "black");
    ctx.fillStyle = blackGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw SV marker
    const x = sv.s * width;
    const y = (1 - sv.v) * height;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.strokeStyle = "white";
    ctx.stroke();
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
  };

  const handleSVMouseDown = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = svCanvasRef.current;
    if (!canvas) return;

    const move = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setSV({
        s: Math.max(0, Math.min(1, x / svSize)),
        v: Math.max(0, Math.min(1, 1 - y / svSize)),
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

  const handleHueMouseDown = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = hueCanvasRef.current;
    if (!canvas) return;

    const move = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - center;
      const y = e.clientY - rect.top - center;
      const dist = Math.sqrt(x * x + y * y);

      if (dist >= ringInnerRadius && dist <= ringOuterRadius) {
        const angle = Math.atan2(y, x);
        let h = (angle * 180) / Math.PI;
        if (h < 0) h += 360;
        setHue(h);
      }
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
    const ctx = svCanvasRef.current?.getContext("2d");
    if (ctx) drawSV(ctx);
    setSelectedColor(`hsl(${hue}, ${sv.s * 100}%, ${sv.v * 50}%)`);
  }, [hue, sv]);

  useEffect(() => {
    const ctx = hueCanvasRef.current?.getContext("2d");
    if (ctx) drawHueRing(ctx);
    setSelectedColor(`hsl(${hue}, ${sv.s * 100}%, ${sv.v * 50}%)`);
  }, [hue]);

  return ReactDOM.createPortal(
    <div className="fixed top-4 right-8">
      <div className="relative w-[300px] h-[300px] z-15">
        <canvas
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          ref={hueCanvasRef}
          width={300}
          height={300}
          onMouseDown={handleHueMouseDown}
        />
        <canvas
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          ref={svCanvasRef}
          width={120}
          height={120}
          onMouseDown={handleSVMouseDown}
        />
      </div>
      <ColorPreview hue={hue} sv={sv} />
    </div>,
    document.getElementById("color-pallete")!,
  );
}

function ColorPreview({ hue, sv }: ColorPreviewProps) {
  return (
    <>
      <div
        className="absolute top-0  right-0 w-[90px] h-[90px] mt-2 mb-5 mx-auto z-5"
        style={{
          backgroundColor: `hsl(${hue}, ${sv.s * 100}%, ${sv.v * 50}%)`,
        }}
      ></div>
      <div className="absolute top-1 right-0 rounded-full w-[300px] h-[300px] bg-gray-600 z-10"></div>
    </>
  );
}

interface ColorPreviewProps {
  hue: number;
  sv: { s: number; v: number };
}
