import { useEffect, useState } from "react";
import { HSV, useSelectedToolContext } from "../store/SelectedToolContext";
import hsvToCss from "../util/helpers/hsvToCss";

export default function ColorPallete() {
  const { selectedColor, setSelectedColor } = useSelectedToolContext();
  const [colors, setColors] = useState<HSV[]>([
    { h: 120, s: 1, v: 0.5 },
    { h: 35, s: 1, v: 0.5 },
    { h: 180, s: 1, v: 0.5 },
    { h: 79, s: 1, v: 0.5 },
    { h: 290, s: 1, v: 0.5 },
  ]);

  const [activeCell, setActiveCell] = useState(0);

  useEffect(() => {
    setColors((prev) => {
      const newColors = [...prev].map((clr, idx) => {
        if (idx !== activeCell) return clr;
        return selectedColor;
      });

      return newColors;
    });
  }, [selectedColor]);

  const handleClick = () => {
    setColors((prev) => {
      const newColors = [...prev];
      newColors.push({
        h: Math.floor(Math.random() * 360),
        s: Math.random(),
        v: Math.random(),
      });
      setSelectedColor(newColors.slice(-1)[0]);
      return newColors;
    });

    setActiveCell(colors.length);
  };

  return (
    <div className="fixed bottom-8 right-8 flex flex-wrap w-[200px] p-4 rounded-lg bg-neutral-300 gap-[1px]">
      {colors.map((clr, idx) => (
        <PalleteCell
          key={`${clr}-${idx}`}
          clr={clr}
          isActiveCell={activeCell === idx}
          onClick={() => {
            setActiveCell(idx);
            setSelectedColor(colors[idx]);
          }}
        />
      ))}
      <button
        className="w-[40px] h-[40px] text-3xl border rounded-lg cursor-pointer"
        onClick={handleClick}
      >
        +
      </button>
    </div>
  );
}

function PalleteCell({ clr, isActiveCell, onClick }: PalleteCellProps) {
  return (
    <div
      onClick={onClick}
      style={{ backgroundColor: hsvToCss(clr) }}
      className={`w-[40px] h-[40px] border rounded-sm cursor-pointer ${isActiveCell ? "border-neutral-100 border-2" : ""}`}
    ></div>
  );
}

interface PalleteCellProps {
  clr: HSV;
  isActiveCell: boolean;
  onClick: () => void;
}
