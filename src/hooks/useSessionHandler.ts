import { useState, useEffect } from "react";

const useSessionHandler = () => {
  const [isSessionActive, setIsSessionActive] = useState<boolean>(() => {
    return !!sessionStorage.getItem("appStarted");
  });

  const setSessionActive = () => {
    sessionStorage.setItem("appStarted", "true");
    setIsSessionActive(true);
  };

  useEffect(() => {
    const clearSessionOnClose = (event: PageTransitionEvent) => {
      if (performance.navigation.type !== 1 && !event.persisted) {
        sessionStorage.removeItem("appStarted");
        setIsSessionActive(false);
      }
    };

    window.addEventListener("pagehide", clearSessionOnClose);
    return () => window.removeEventListener("pagehide", clearSessionOnClose);
  }, []);

  return { isSessionActive, setSessionActive };
};

export default useSessionHandler;
