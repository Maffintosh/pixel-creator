import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useCanvasSettingsContext } from "../store/CanvasSettingsContext";
import { useAppStateContext } from "../store/AppStateContext";

export default function CreateCanvasModal() {
  const { resolution, setResolution, setZoom } = useCanvasSettingsContext();
  const { setIsCanvasCreated, setIsModalActive } = useAppStateContext();

  const modalRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    ctx: string,
  ) => {
    if (ctx === "width") {
      setResolution((prev) => {
        return { ...prev, logicWidth: Number(e.target.value) };
      });
    } else if (ctx === "height") {
      setResolution((prev) => {
        return { ...prev, logicHeight: Number(e.target.value) };
      });
    }
  };

  const handleCreateCanvas = () => {
    setIsModalActive(false);
    setZoom(1);
    setIsCanvasCreated(true);
  };

  return ReactDOM.createPortal(
    <form
      onSubmit={handleCreateCanvas}
      className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-20 bg-neutral-300 px-8 py-4 rounded-lg"
    >
      <div className="flex flex-col font-mono">
        <p className="text-lg text-neutral-900">Set up resolution</p>
        <p className="text-sm text-neutral-600 mb-2">
          It's recommended not to assign more than 256x256 pixels
        </p>
        <div className="flex">
          <label className="flex gap-4">
            Width:
            <input
              ref={modalRef}
              value={resolution.logicWidth}
              onChange={(e) => handleInputChange(e, "width")}
              className="text-sm text-neutral-600 block font-mono focus:outline-none"
            />
          </label>
          <label className="flex gap-4">
            Height:
            <input
              value={resolution.logicHeight}
              onChange={(e) => handleInputChange(e, "height")}
              className="text-sm text-neutral-600  block font-mono focus:outline-none"
            />
          </label>
        </div>
      </div>
      <button
        onClick={handleCreateCanvas}
        className="block font-mono cursor-pointer mx-auto my-8 outline px-15 py-2 rounded-lg"
      >
        Create
      </button>
    </form>,
    document.getElementById("create-canvas-modal")!,
  );
}
