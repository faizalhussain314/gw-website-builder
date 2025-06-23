import React, { forwardRef } from "react";

interface PreviewIframeProps {
  src: string;
  onLoad: () => void;
  isLoading: boolean;
  isContentGenerating: boolean;
  viewMode: string;
}

const PreviewIframe = forwardRef<HTMLIFrameElement, PreviewIframeProps>(
  ({ src, onLoad, isLoading, isContentGenerating, viewMode }, ref) => {
    const getIframeStyles = () => {
      const baseStyles =
        "h-full transition-fade shadow-lg rounded-lg z-10 absolute top-0";
      const opacityClass =
        isLoading && !isContentGenerating ? "opacity-0" : "opacity-100";

      let sizeStyles = "w-full";
      if (viewMode === "tablet") {
        sizeStyles = "w-[768px]";
      } else if (viewMode === "mobile") {
        sizeStyles = "w-[375px]";
      }

      return `${baseStyles} ${sizeStyles} ${opacityClass}`;
    };

    return (
      <iframe
        ref={ref}
        src={src}
        title="website"
        id="myIframe"
        onLoad={onLoad}
        className={getIframeStyles()}
      />
    );
  }
);

PreviewIframe.displayName = "PreviewIframe";

export default PreviewIframe;
