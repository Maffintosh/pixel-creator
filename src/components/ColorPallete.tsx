import { useState } from "react";
import { useSelectedToolContext } from "../store/SelectedToolContext";

export default function ColorPallete() {
  const [pallete, setPallet] = useState<string[]>([
    "white",
    "black",
    "blue",
    "indigo",
    "pink",
  ]);
  const [activePalleteCell, setActivePalleteCell] = useState(pallete[0]);
  return (
    <div className="flex flex-wrap w-[150px] mx-auto">
      {pallete.map((color, idx) => (
        <PalleteCell key={`${color}-${idx}`} color={color} />
      ))}
    </div>
  );
}

interface PalleteCellProps {
  color: string;
}

function PalleteCell({ color }: PalleteCellProps) {
  const { setSelectedColor } = useSelectedToolContext();
  return (
    <div
      onClick={() => setSelectedColor(color)}
      style={{ backgroundColor: color }}
      className="w-10 h-10 border border-neutral-500 cursor-pointer"
    ></div>
  );
}
