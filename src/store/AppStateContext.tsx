import { createContext, useContext, useState, type ReactNode } from "react";
import { SSA } from "../util/types";

interface AppStateProviderProps {
  children: ReactNode;
}

interface AppStateContext {
  isCanvasCreated: boolean;
  isModalActive: boolean;
  isGrab: boolean;
  isGrabbing: boolean;
  isCtrlPressed: boolean;
  setIsCanvasCreated: SSA<boolean>;
  setIsModalActive: SSA<boolean>;
  setIsGrab: SSA<boolean>;
  setIsGrabbing: SSA<boolean>;
  setIsCtrlPressed: SSA<boolean>;
}

const AppStateContext = createContext<AppStateContext | null>(null);

export default function AppStateProvider({ children }: AppStateProviderProps) {
  const [isCanvasCreated, setIsCanvasCreated] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [isGrab, setIsGrab] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  return (
    <AppStateContext.Provider
      value={{
        isCanvasCreated,
        isModalActive,
        isGrab,
        isGrabbing,
        isCtrlPressed,
        setIsCanvasCreated,
        setIsModalActive,
        setIsGrab,
        setIsGrabbing,
        setIsCtrlPressed,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export const useAppStateContext = () => {
  const ctx = useContext(AppStateContext);

  if (!ctx) {
    throw new Error("AppStateContext must be used within the AppStateProvider");
  }

  return ctx;
};
