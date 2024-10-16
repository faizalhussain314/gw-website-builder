import React from "react";
import { FontCombination } from "../../../types/customdesign.type";

interface FontSelectorProps {
  fontCombinations: FontCombination[];
  selectedFont: FontCombination | null;
  handleFontChange: (font: FontCombination) => void;
  resetStyles: () => void;
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
        <label className="block text-base font-semibold">Font Pair</label>
        <span
          onClick={resetStyles}
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
          {selectedFont ? selectedFont.label : "Choose Your Font"}
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
                key={font.label}
                className={`p-2.5 hover:bg-[#F9FAFB] cursor-pointer ${
                  selectedFont?.label === font.label ? "bg-[#F9FAFB]" : ""
                }`}
                onClick={() => handleFontChange(font)}
              >
                {font.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FontSelector;
