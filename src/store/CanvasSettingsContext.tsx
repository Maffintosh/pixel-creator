import { createContext, useContext, useState, type ReactNode } from "react";
import { SSA } from "../util/types";

interface CanvasSettingsProviderProps {
  children: ReactNode;
}

interface Resolution {
  logicWidth: number;
  logicHeight: number;
}

interface ICanvasSettingsContext {
  pixelSize: number;
  resolution: Resolution;
  zoom: number;
  setResolution: SSA<Resolution>;
  setZoom: SSA<number>;
}
const CanvasSettingsContext = createContext<ICanvasSettingsContext | null>(
  null,
);

export default function CanvasSettingsProvider({
  children,
}: CanvasSettingsProviderProps) {
  const pixelSize = 16;
  // REMINDER: don't forget that you changed the rows/cols to width/height
  const [resolution, setResolution] = useState({
    logicWidth: 32,
    logicHeight: 32,
  });
  const [zoom, setZoom] = useState(1);

  return (
    <CanvasSettingsContext.Provider
      value={{ pixelSize, resolution, zoom, setResolution, setZoom }}
    >
      {children}
    </CanvasSettingsContext.Provider>
  );
}

export const useCanvasSettingsContext = () => {
  const ctx = useContext(CanvasSettingsContext);

  if (!ctx) {
    throw new Error(
      "CanvasSettingsContext must be used within the CanvasSettingsProvider",
    );
  }

  return ctx;
};
