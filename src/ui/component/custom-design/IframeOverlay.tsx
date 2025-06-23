import React from "react";

interface IframeOverlayProps {
  onLoad: () => void;
  currentUrl: string;
  limitReached: boolean;
}

const IframeOverlay: React.FC<IframeOverlayProps> = ({
  onLoad,
  currentUrl,
  limitReached,
}) => {
  return (
    <iframe
      src={currentUrl}
      title="website"
      id="myIframe"
      className={`h-full w-full transition-fade shadow-lg rounded-lg ${
        limitReached && "hidden"
      }`}
      onLoad={onLoad}
    />
  );
};

export default IframeOverlay;
