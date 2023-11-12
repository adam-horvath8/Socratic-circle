import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import mainStore from "./stores/mainStore.ts";
import { Provider } from "react-redux";
import { Toaster } from "./components/ui/toaster.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={mainStore}>
      <App />
      <Toaster />
    </Provider>
  </React.StrictMode>
);
