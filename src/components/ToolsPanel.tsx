import ReactDOM from "react-dom";
import BrushIcon from "../ui/icons/brush";
import EraserIcon from "../ui/icons/Eraser";

export default function ToolsPanel() {
  return ReactDOM.createPortal(
    <div className="fixed top-4 left-4 flex flex-col gap-4 z-10">
      <button className="cursor-pointer">
        <BrushIcon size={32} color="black" />
      </button>
      <button className="cursor-pointer">
        <EraserIcon size={32} color="black" />
      </button>
    </div>,
    document.getElementById("tools-panel")!,
  );
}
