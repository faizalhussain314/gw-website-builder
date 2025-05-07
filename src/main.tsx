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
const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY || "";
const POSTHOG_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // debug: true,
  });
} else {
  console.error("No PostHog key found, skipping PostHog initialization.");
}

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
