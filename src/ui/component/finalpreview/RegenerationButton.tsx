import React, { useRef } from "react";
import CachedIcon from "@mui/icons-material/Cached";
import { useRegeneration } from "@hooks/useRegeneration";

const RegenerationButton: React.FC<{
  templateName: string;
  pageSlug: string;
}> = ({ templateName, pageSlug }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { handleRegenerate, isContentGenerating } = useRegeneration(iframeRef);

  return (
    <button
      className="flex items-center px-4 py-2 gap-1 bg-[#EBF4FF] text-black rounded"
      onClick={() => handleRegenerate(templateName, pageSlug)}
      disabled={isContentGenerating}
    >
      <CachedIcon />
      {isContentGenerating ? "Generating..." : "Regenerate page"}
    </button>
  );
};

export default RegenerationButton;
