import React from "react";
import {
  SelectedColor,
  ColorCombination,
} from "../../../types/customdesign.type";

interface ColorSelectorProps {
  colorCombinations: ColorCombination[];
  selectedColor: SelectedColor;
  handleColorChange: (color: SelectedColor, store?: boolean) => void;
  resetStyles: () => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  colorCombinations,
  selectedColor,
  handleColorChange,
  resetStyles,
}) => {
  return (
    <div className="mt-4">
      <div className="flex w-full justify-between items-center mb-2.5">
        <label className="block text-base font-semibold">Color</label>
        <span
          onClick={resetStyles}
          className="text-gray-400 text-base font-medium cursor-pointer hover:text-palatinate-blue-600"
        >
          Reset
        </span>
      </div>
      <div className="grid grid-cols-5 gap-x-5 gap-y-4 border border-[#DFEAF6] p-2.5 rounded-md">
        {colorCombinations.map((color) => (
          <div
            key={color.primary}
            className={`${
              selectedColor.primary === color.primary &&
              selectedColor.secondary === color.secondary
                ? "ring-[1.2px] ring-palatinate-blue-600 rounded-md bg-[#F9FAFB]"
                : ""
            } flex items-center justify-center p-1 shrink-0`}
          >
            <button
              className="size-5 rounded-full shrink-0"
              style={{ backgroundColor: color.primary }}
              onClick={() => handleColorChange(color)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
