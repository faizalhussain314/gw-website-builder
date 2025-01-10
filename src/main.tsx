import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter as Router } from "react-router-dom";
import store from "./store/store.ts";
import App from "./App.tsx";
import ErrorBoundary from "./infrastructure/error/ErrorBoundary.tsx";
import "./index.css";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";

const root = ReactDOM.createRoot(document.getElementById("root")!);
const options = {
  api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST,
};

posthog.init(process.env.REACT_APP_PUBLIC_POSTHOG_KEY, {
  api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST,
  debug: true,
});

root.render(
  <PostHogProvider client={posthog}>
    <Provider store={store}>
      <Router>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </Router>
    </Provider>
  </PostHogProvider>
);
