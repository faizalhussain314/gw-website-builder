// src/hooks/useIframeMessage.ts

import { useCallback, RefObject } from "react";
import { IframeMessage } from "../types/iframeMessages.type.ts";

const useIframeMessage = (iframeRef: RefObject<HTMLIFrameElement>) => {
  const sendMessage = useCallback(
    (message: IframeMessage) => {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(message, "*");
      } else {
        console.warn("Iframe not found or not ready");
      }
    },
    [iframeRef]
  );

  const sendMessageToAllIframes = useCallback((message: IframeMessage) => {
    const iframes = document.getElementsByTagName("iframe");
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(message, "*");
      } else {
        console.warn("Iframe not found or not ready");
      }
    }
  }, []);

  return { sendMessage, sendMessageToIframe: sendMessageToAllIframes };
};

export default useIframeMessage;
