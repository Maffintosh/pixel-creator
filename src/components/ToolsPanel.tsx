import ReactDOM from "react-dom";
import BrushIcon from "../ui/icons/brush";
import EraserIcon from "../ui/icons/Eraser";
import { useSelectedToolContext } from "../store/SelectedToolContext";

export default function ToolsPanel() {
  const { selectedTool, selectedColor, setSelectedTool, setSelectedColor } =
    useSelectedToolContext();

  const applySelectedStyles = (context: string) => {
    return selectedTool === context
      ? "outline-2 outline-cyan-500 rounded-sm"
      : "";
  };

  const handleSetBrush = () => {
    setSelectedTool("brush");
    setSelectedColor("#000");
  };

  const handleSetEraser = () => {
    setSelectedTool("eraser");
    setSelectedColor("transparent");
  };

  return ReactDOM.createPortal(
    <div className="fixed top-4 left-4 flex flex-col items-center px-2 py-4 gap-4 z-10 rounded-sm bg-neutral-300">
      <button
        className={`${applySelectedStyles("brush")} p-[2px] cursor-pointer`}
        onClick={handleSetBrush}
      >
        <BrushIcon size={32} color="black" />
      </button>
      <button
        className={`${applySelectedStyles("eraser")} p-[2px] cursor-pointer`}
        onClick={handleSetEraser}
      >
        <EraserIcon size={32} color="black" />
      </button>
      <input
        className="block w-[32px] h-[32px] rounded-full"
        type="color"
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
      />
    </div>,
    document.getElementById("tools-panel")!,
  );
}
