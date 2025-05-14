import { Fragment, useEffect, useLayoutEffect, useRef } from "react";

import Wrapper from "./components/layout/Wrapper";
import PixelCanvas from "./components/PixelCanvas/PixelCanvas";
import ToolsPanel from "./components/ToolsPanel";
import CreateCanvasModal from "./components/CreateCanvasModal";
import { useAppStateContext } from "./store/AppStateContext";
import { useSelectedToolContext } from "./store/SelectedToolContext";
import { useCanvasSettingsContext } from "./store/CanvasSettingsContext";
import { scrollToCenter } from "./util/helpers/scrollToCenter";

export default function App() {
  const {
    isCanvasCreated,
    isModalActive,
    isGrab,
    isGrabbing,
    isCtrlPressed,
    setIsCanvasCreated,
    setIsModalActive,
    setIsGrab,
    setIsGrabbing,
    setIsCtrlPressed,
  } = useAppStateContext();
  const { setPenSize, setSelectedTool, setSelectedColor } =
    useSelectedToolContext();
  const { setZoom } = useCanvasSettingsContext();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef(false);
  const ctrlRef = useRef(false);
  const grabRef = useRef(false);
  const grabbingRef = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    modalRef.current = isModalActive;
  }, [isModalActive]);

  useEffect(() => {
    ctrlRef.current = isCtrlPressed;
  }, [isCtrlPressed]);

  useEffect(() => {
    grabbingRef.current = isGrabbing;
  }, [isGrabbing]);

  useEffect(() => {
    grabRef.current = isGrab;
  }, [isGrab]);

  useLayoutEffect(() => {
    scrollToCenter(wrapperRef);
  }, []);

  const scrollBy = (dx: number, dy: number) => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollLeft += dx;
      wrapperRef.current.scrollTop += dy;
    }
  };

  // HANDLERS
  const handleMouseMove = (e: MouseEvent) => {
    if (!grabRef.current || !grabbingRef.current) return;
    e.preventDefault();

    const dx = lastPos.current.x - e.clientX;
    const dy = lastPos.current.y - e.clientY;
    scrollBy(dx, dy);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;

    if (ctrlRef.current) {
      setPenSize((prev) => Math.max(1, prev + delta * 10));
    } else {
      setZoom((prev) => Math.min(Math.max(prev + delta, 0.1), 5));
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.altKey && e.code === "KeyN") {
      setIsModalActive(true);
      setIsCanvasCreated(false);
      scrollToCenter(wrapperRef);
    }

    if (modalRef.current && e.code === "Escape") {
      setIsModalActive(false);
    }

    if (e.code === "Space") {
      e.preventDefault();
      setIsGrab(true);
    }
    if (e.code === "KeyB") {
      setSelectedTool("brush");
      setSelectedColor("#000");
    }
    if (e.code === "KeyE") {
      setSelectedTool("eraser");
      setSelectedColor("transparent");
    }
    if (e.code === "ControlLeft") {
      setIsCtrlPressed(true);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault();
      setIsGrab(false);
    }

    if (e.code === "ControlLeft") {
      setIsCtrlPressed(false);
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

  useLayoutEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }

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
      <Wrapper ref={wrapperRef}>
        {isCanvasCreated ? (
          <PixelCanvas />
        ) : isModalActive ? (
          <Fragment />
        ) : (
          <div className="text-center text-neutral-300 font-mono">
            <h1 className="text-3xl">Create new Canvas</h1>
            <p className="text-xl text-cyan-400">Press Alt + N</p>
          </div>
        )}
      </Wrapper>
      {isCanvasCreated ? <ToolsPanel /> : <Fragment />}
      {isModalActive ? <CreateCanvasModal /> : <Fragment />}
    </>
  );
}
