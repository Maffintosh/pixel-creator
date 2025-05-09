import ReactDOM from "react-dom";
import BrushIcon from "../ui/icons/brush";
import EraserIcon from "../ui/icons/Eraser";

interface ToolsPanelProps {
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  setSelectedTool: React.Dispatch<React.SetStateAction<string>>;
}

export default function ToolsPanel({
  selectedColor,
  setSelectedColor,
  setSelectedTool,
}: ToolsPanelProps) {
  const handleSetBrush = () => {
    setSelectedTool("brush");
    setSelectedColor("#000");
  };
  const handleSetEraser = () => {
    setSelectedTool("eraser");
    setSelectedColor("transparent");
  };
  return ReactDOM.createPortal(
    <div className="fixed top-4 left-4 flex flex-col gap-4 z-10">
      <button className="cursor-pointer" onClick={handleSetBrush}>
        <BrushIcon size={32} color="black" />
      </button>
      <button className="cursor-pointer" onClick={handleSetEraser}>
        <EraserIcon size={32} color="black" />
      </button>
      <div>
        <input
          className="w-[32px] h-[32px]"
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        />
      </div>
    </div>,
    document.getElementById("tools-panel")!,
  );
}
