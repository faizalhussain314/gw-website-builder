import { useState, useCallback, useRef } from "react";

export const useIframeManagement = () => {
  const [iframeSrc, setIframeSrc] = useState<string>("");
  const [currentContent, setCurrentContent] = useState<string>("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const updateIframeSrc = useCallback(
    (content: string) => {
      if (content !== currentContent) {
        setCurrentContent(content);

        const newBlob = new Blob([content], { type: "text/html" });
        const newBlobUrl = URL.createObjectURL(newBlob);

        setIframeSrc((prevSrc) => {
          if (prevSrc) {
            URL.revokeObjectURL(prevSrc);
          }
          return newBlobUrl;
        });
      }
    },
    [currentContent]
  );

  const updateContactDetails = useCallback(
    (email: string, phone: string, address: string) => {
      if (iframeRef.current && email && phone && address) {
        iframeRef.current.contentWindow?.postMessage(
          {
            type: "updateContactDetails",
            email,
            phone,
            address,
          },
          "*"
        );
      }
    },
    []
  );

  const sendNonClickable = useCallback(() => {
    const iframe = document.getElementById("myIframe") as HTMLIFrameElement;
    iframe.contentWindow?.postMessage(
      {
        type: "nonClickable",
        transdiv: `<div id="overlay" style="position:fixed;width: 100vw;height: 100vh;z-index: 1000000;top: 0;left: 0;"></div>`,
      },
      "*"
    );
  }, []);

  return {
    iframeSrc,
    setIframeSrc,
    currentContent,
    iframeRef,
    updateIframeSrc,
    updateContactDetails,
    sendNonClickable,
  };
};
