import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import CanvasSettingsProvider from "./store/CanvasSettingsContext.tsx";
import SelectedToolProvider from "./store/SelectedToolContext.tsx";
import AppStateProvider from "./store/AppStateContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppStateProvider>
      <SelectedToolProvider>
        <CanvasSettingsProvider>
          <App />
        </CanvasSettingsProvider>
      </SelectedToolProvider>
    </AppStateProvider>
  </StrictMode>,
);
