import { useLayoutEffect } from "react";
import { Template } from "types/design.type";

/**
 * Custom hook to handle iframe scroll interactions
 * Adds mouse enter/leave event listeners to all iframes on the page
 * @param templateList - Array of templates to trigger re-initialization when changed
 */
const useIframeScrollHandlers = (templateList: Template[]) => {
  useLayoutEffect(() => {
    const handleMouseEnter = (iframe: HTMLIFrameElement) => {
      iframe?.contentWindow?.postMessage(
        { type: "scroll", scrollAmount: 20 },
        "*"
      );
    };

    const handleMouseLeave = (iframe: HTMLIFrameElement) => {
      iframe?.contentWindow?.postMessage(
        { type: "stopScrolling", scrollAmount: 20 },
        "*"
      );
    };

    const iframes = document.getElementsByTagName("iframe");

    const onMouseEnter = (event: Event) =>
      handleMouseEnter(event.currentTarget as HTMLIFrameElement);
    const onMouseLeave = (event: Event) =>
      handleMouseLeave(event.currentTarget as HTMLIFrameElement);

    // Add event listeners to all iframes
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];
      iframe.addEventListener("mouseenter", onMouseEnter);
      iframe.addEventListener("mouseleave", onMouseLeave);
    }

    // Cleanup function to remove event listeners
    return () => {
      for (let i = 0; i < iframes.length; i++) {
        const iframe: HTMLIFrameElement = iframes[i];
        iframe.removeEventListener("mouseenter", onMouseEnter);
        iframe.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, [templateList]);
};

export default useIframeScrollHandlers;
