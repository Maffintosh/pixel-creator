import { useEffect, useRef, useState } from "react";

import Wrapper from "./components/layout/Wrapper";
import PixelCanvas from "./components/PixelCanvas";
import ToolsPanel from "./components/ToolsPanel";

export default function App() {
  const [isGrab, setIsGrab] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const grabRef = useRef(isGrab);

  useEffect(() => {
    grabRef.current = isGrab;

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

    const handleMouseDown = () => {
      if (grabRef.current) {
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

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isGrab]);

  return (
    <>
      <Wrapper isGrab={isGrab} isGrabbing={isGrabbing}>
        <PixelCanvas isGrab={isGrab} isGrabbing={isGrabbing} />
      </Wrapper>
      <ToolsPanel />
    </>
  );
}
