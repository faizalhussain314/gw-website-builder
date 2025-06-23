// TemplateGrid.tsx
import React from "react";
import { Template } from "../../../types/design.type";
import TemplateCard from "./TemplateCard";

interface TemplateGridProps {
  templateList: Template[];
  showError: boolean;
  activeIndex: number;
  loadingStates: { [key: number]: boolean };
  onTemplateSelection: (index: number, template: Template) => void;
  onIframeLoad: (templateId: number) => void;
  onIframeLoadStart: (templateId: number) => void;
}

const TemplateGrid: React.FC<TemplateGridProps> = ({
  templateList,
  showError,
  activeIndex,
  loadingStates,
  onTemplateSelection,
  onIframeLoad,
  onIframeLoadStart,
}) => {
  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>): void => {
    const iframe = event.currentTarget.querySelector("iframe");
    if (iframe) {
      iframe?.contentWindow?.postMessage(
        { type: "scroll", scrollAmount: 20 },
        "*"
      );
    }
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>): void => {
    const iframe = event.currentTarget.querySelector("iframe");
    if (iframe) {
      iframe?.contentWindow?.postMessage(
        { type: "stopScrolling", scrollAmount: 40 },
        "*"
      );
    }
  };

  return (
    <div className="relative overflow-auto custom-confirmation-modal-scrollbar md:px-10 lg:px-14 xl:px-15 xl:max-w-full">
      {showError && <div className="text-center ">No templates found</div>}
      <div className="flex flex-wrap items-start justify-start p-1 gap-x-6 gap-y-8">
        {templateList.map((template: Template, index: number) => (
          <TemplateCard
            key={index}
            template={template}
            index={index}
            isActive={activeIndex === template?.id}
            isLoading={loadingStates[template.id]}
            onTemplateSelection={onTemplateSelection}
            onIframeLoad={onIframeLoad}
            onIframeLoadStart={onIframeLoadStart}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>
    </div>
  );
};

export default TemplateGrid;
