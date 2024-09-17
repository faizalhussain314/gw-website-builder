import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter as Router } from "react-router-dom";
import store from "./store/store.ts";
import App from "./App.tsx";
import ErrorBoundary from "./infrastructure/error/ErrorBoundary.tsx";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </Router>
    </Provider>
  </React.StrictMode>
);
