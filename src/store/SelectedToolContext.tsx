import { createContext, type ReactNode, useContext, useState } from "react";
import { SSA } from "../util/types";

export type HSV = {
  h: number;
  s: number;
  v: number;
};

interface SelectedToolProviderProps {
  children: ReactNode;
}

interface SelectedToolContext {
  penSize: number;
  selectedTool: string;
  selectedColor: HSV;
  setPenSize: SSA<number>;
  setSelectedTool: SSA<string>;
  setSelectedColor: SSA<HSV>;
}

const SelectedToolContext = createContext<SelectedToolContext | null>(null);

export default function SelectedToolProvider({
  children,
}: SelectedToolProviderProps) {
  const [penSize, setPenSize] = useState(1);
  const [selectedTool, setSelectedTool] = useState("brush");
  const [selectedColor, setSelectedColor] = useState<HSV>({
    h: 0,
    s: 0.1,
    v: 0.1,
  });
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
