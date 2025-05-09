import { useEffect, useLayoutEffect, useRef, useState } from "react";

import Wrapper from "./components/layout/Wrapper";
import PixelCanvas from "./components/PixelCanvas";
import ToolsPanel from "./components/ToolsPanel";

export default function App() {
  const [isGrab, setIsGrab] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [pixelSize, setPixelSize] = useState(16);
  const [zoom, setZoom] = useState(1);
  const [selectedTool, setSelectedTool] = useState<string>("brush");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const grabRef = useRef(false);
  const grabbingRef = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const scrollBy = (dx: number, dy: number) => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollLeft += dx;
      wrapperRef.current.scrollTop += dy;
    }
  };

  useLayoutEffect(() => {
    if (wrapperRef.current) {
      const wrapper = wrapperRef.current;

      const x = (wrapper.scrollWidth - wrapper.clientWidth) / 2;
      const y = (wrapper.scrollHeight - wrapper.clientHeight) / 2;

      wrapper.scrollLeft = x;
      wrapper.scrollTop = y;
    }
  }, []);

  useEffect(() => {
    grabbingRef.current = isGrabbing;
  }, [isGrabbing]);

  useEffect(() => {
    grabRef.current = isGrab;
  }, [isGrab]);

  useLayoutEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((prev) => Math.min(Math.max(prev + delta, 0.1), 5));
    };

    if (wrapperRef.current) {
      wrapperRef.current.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!grabRef.current || !grabbingRef.current) return;
      e.preventDefault();
      console.log("Moving");

      const dx = lastPos.current.x - e.clientX;
      const dy = lastPos.current.y - e.clientY;
      scrollBy(dx, dy);
      lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsGrab(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsGrab(false);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (grabRef.current) {
        lastPos.current = { x: e.clientX, y: e.clientY };
        setIsGrabbing(true);
      }
    };

    const handleMouseUp = () => {
      setIsGrabbing(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      if (wrapperRef.current) {
        wrapperRef.current.removeEventListener("wheel", handleWheel);
      }
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <Wrapper ref={wrapperRef} isGrab={isGrab} isGrabbing={isGrabbing}>
        <PixelCanvas
          zoom={zoom}
          pixelSize={pixelSize}
          isGrab={isGrab}
          isGrabbing={isGrabbing}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
      </Wrapper>
      <ToolsPanel
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        setSelectedTool={setSelectedTool}
      />
    </>
  );
}
