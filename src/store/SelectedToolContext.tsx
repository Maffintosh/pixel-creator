import { createContext, type ReactNode, useContext, useState } from "react";
import { SSA } from "../util/types";

interface SelectedToolProviderProps {
  children: ReactNode;
}

interface SelectedToolContext {
  penSize: number;
  selectedTool: string;
  selectedColor: string;
  setPenSize: SSA<number>;
  setSelectedTool: SSA<string>;
  setSelectedColor: SSA<string>;
}

const SelectedToolContext = createContext<SelectedToolContext | null>(null);

export default function SelectedToolProvider({
  children,
}: SelectedToolProviderProps) {
  const [penSize, setPenSize] = useState(1);
  const [selectedTool, setSelectedTool] = useState("brush");
  const [selectedColor, setSelectedColor] = useState("#000");
  return (
    <SelectedToolContext.Provider
      value={{
        penSize,
        selectedTool,
        selectedColor,
        setPenSize,
        setSelectedTool,
        setSelectedColor,
      }}
    >
      {children}
    </SelectedToolContext.Provider>
  );
}

export const useSelectedToolContext = () => {
  const ctx = useContext(SelectedToolContext);

  if (!ctx) {
    throw new Error(
      "SelectedToolContext must be used within the SelectedToolProvider",
    );
  }

  return ctx;
};
