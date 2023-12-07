import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import mainStore from "./redux/stores/mainStore.ts";
import { Provider } from "react-redux";
import { Toaster } from "./components/ui/toaster.tsx";
import AuthObserver from "./components/AuthObserver.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={mainStore}>
      <Toaster />
      <App />
      <AuthObserver />
    </Provider>
  </React.StrictMode>
);
