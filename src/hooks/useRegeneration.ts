import { useState } from "react";
import { toast } from "react-toastify";

const useRegeneration = (iframeRef: React.RefObject<HTMLIFrameElement>) => {
  const [isContentGenerating, setIsContentGenerating] = useState(false);

  const handleRegenerate = (templateName: string, pageSlug: string) => {
    if (isContentGenerating) {
      toast.warn("Please wait while content is being generated.");
      return;
    }

    setIsContentGenerating(true);
    toast.info("Regeneration started for " + pageSlug);

    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "start",
          templateName: templateName,
          pageName: pageSlug,
        },
        "*"
      );

      window.addEventListener("message", handleIframeMessage);
    }
  };

  const handleIframeMessage = (event: MessageEvent) => {
    if (event.data.type === "generationCompleted") {
      setIsContentGenerating(false);
      toast.success("Regeneration completed.");

      window.removeEventListener("message", handleIframeMessage);
    } else if (event.data.type === "generationFailed") {
      setIsContentGenerating(false);
      toast.error("Regeneration failed. Please try again.");

      window.removeEventListener("message", handleIframeMessage);
    }
  };

  return { handleRegenerate, isContentGenerating };
};

export default useRegeneration;
