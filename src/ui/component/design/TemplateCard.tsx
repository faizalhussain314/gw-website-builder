// TemplateCard.tsx
import React from "react";
import { Tooltip } from "@mui/material";
import { Template } from "../../../types/design.type";
import info from "../../../assets/icons/info.svg";

interface TemplateCardProps {
  template: Template;
  index: number;
  isActive: boolean;
  isLoading: boolean;
  onTemplateSelection: (index: number, template: Template) => void;
  onIframeLoad: (templateId: number) => void;
  onIframeLoadStart: (templateId: number) => void;
  onMouseEnter: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  index,
  isActive,
  isLoading,
  onTemplateSelection,
  onIframeLoad,
  onIframeLoadStart,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      className={`w-[310px] h-auto rounded-t-xl rounded-b-lg ${
        isActive ? "ring ring-palatinate-blue-600 rounded-lg " : ""
      } `}
      onClick={() => {
        onTemplateSelection(template?.id, template);
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`w-full rounded-t-xl`}>
        {/* Iframe Content */}
        <div className="w-full aspect-[164/179] relative overflow-hidden bg-neutral-300 rounded-t-xl">
          <div className="w-full h-full select-none relative shadow-md overflow-hidden bg-neutral-300">
            <iframe
              id="myIframe"
              title={`Template ${index + 1}`}
              className={`absolute left-0 top-0 select-none transition-opacity duration-300 border-0 ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              style={{
                width: "1400px",
                height: "3000px",
                transform: "scale(0.22)",
                transformOrigin: "top left",
                pointerEvents: "none",
              }}
              src={template?.pages?.[0]?.iframe_url}
              onLoad={() => onIframeLoad(template.id)}
              onLoadStart={() => onIframeLoadStart(template.id)}
            />
          </div>
          {/* Premium Label */}
          {template.is_premium && (
            <div className="absolute top-3 right-3 text-[10px] font-medium py-0.5 text-white flex items-center justify-center rounded-3xl bg-[#FE8E01] px-2.5 pointer-events-none z-20">
              Premium
            </div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 w-full h-full bg-transparent cursor-pointer z-10"></div>
        </div>

        {/* Bottom Info */}
        <div className="relative h-14">
          <div className="absolute bottom-0 flex items-center justify-between w-full px-5 bg-white rounded-b-lg h-14 shadow-template-info">
            <div className="capitalize zw-base-semibold text-app-heading">
              {template.name}
            </div>
            <Tooltip
              placement="top"
              title={
                <div className="flex flex-col">
                  {template.pages.map((page, index) => (
                    <div className="px-2 py-1" key={index}>
                      {page.title}
                    </div>
                  ))}
                </div>
              }
            >
              <img src={info} alt="info-icon" />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
