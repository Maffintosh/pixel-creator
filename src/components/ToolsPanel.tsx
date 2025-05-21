import ReactDOM from "react-dom";
import BrushIcon from "../ui/icons/brush";
import EraserIcon from "../ui/icons/Eraser";
import { useSelectedToolContext } from "../store/SelectedToolContext";
import hsvToCss from "../util/helpers/hsvToCss";

export default function ToolsPanel() {
  const { selectedTool, setSelectedTool, selectedColor } =
    useSelectedToolContext();

  const applySelectedStyles = (context: string) => {
    return selectedTool === context
      ? "outline-2 outline-cyan-500 rounded-sm"
      : "";
  };

  const handleSetBrush = () => {
    setSelectedTool("brush");
  };

  const handleBrushIconColor = () => {
    if (selectedTool !== "brush") return "black";

    return selectedColor.v < 0.3 || selectedColor.s < 0.3 ? "white" : "black";
  };

  const handleSetEraser = () => {
    setSelectedTool("eraser");
  };

  return ReactDOM.createPortal(
    <div className="fixed top-4 left-4 flex flex-col items-center px-2 py-4 gap-4 z-10 rounded-sm bg-neutral-300">
      <button
        style={{
          backgroundColor:
            selectedTool === "brush" ? hsvToCss(selectedColor) : "transparent",
        }}
        className={`relative ${applySelectedStyles("brush")} p-[2px] cursor-pointer`}
        onClick={handleSetBrush}
      >
        <BrushIcon size={32} color={handleBrushIconColor()} />
      </button>
      <button
        className={`${applySelectedStyles("eraser")} p-[2px] cursor-pointer`}
        onClick={handleSetEraser}
      >
        <EraserIcon size={32} color="black" />
      </button>
    </div>,
    document.getElementById("tools-panel")!,
  );
}
