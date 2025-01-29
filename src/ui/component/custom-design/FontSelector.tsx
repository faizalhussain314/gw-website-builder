import React from "react";
// import { Font } from "../../../types/activeStepSlice.type";

interface Font {
  primary: string;
  secondary: string;
}

interface FontSelectorProps {
  fontCombinations: Font[];
  selectedFont: Font | null;
  handleFontChange: (font: Font) => void;
  resetStyles: (resetType: "color" | "font" | "both") => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

const FontSelector: React.FC<FontSelectorProps> = ({
  fontCombinations,
  selectedFont,
  handleFontChange,
  resetStyles,
  isDropdownOpen,
  setIsDropdownOpen,
  dropdownRef,
}) => {
  return (
    <div className="mt-6">
      <div className="flex w-full justify-between items-center mb-2.5">
        <label className="block text-base font-semibold">Font Style</label>
        <span
          onClick={() => resetStyles("font")}
          className="text-gray-400 text-base font-medium cursor-pointer hover:text-palatinate-blue-600"
        >
          Reset
        </span>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full p-2 border rounded-md flex items-center justify-between bg-white text-left focus:border-palatinate-blue-600"
        >
          {selectedFont && (selectedFont.primary || selectedFont.secondary)
            ? `${selectedFont.primary}/${selectedFont.secondary}`
            : "Choose Your Font"}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={`${
              isDropdownOpen && "rotate-180"
            } transition-all duration-300 ease-in-out`}
          >
            <path
              d="M7 10L12 15L17 10"
              stroke="#88898A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {isDropdownOpen && (
          <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto p-2.5">
            {fontCombinations.map((font) => (
              <div
                key={font.primary}
                className={`p-2.5 hover:bg-[#F9FAFB] cursor-pointer ${
                  selectedFont?.primary === font.primary ? "bg-[#F9FAFB]" : ""
                }`}
                onClick={() => handleFontChange(font)}
              >
                {font.primary}/{font.secondary}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FontSelector;
