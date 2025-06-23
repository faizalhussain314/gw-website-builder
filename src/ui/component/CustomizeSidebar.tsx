import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontSelector, ColorSelector, LogoSection } from "@components";
import { nextPage, fetchInitialCustomizationData } from "@utils";
import { useStoreContent, useCustomizeSidebar } from "@hooks";
import { useDispatch } from "react-redux";

const CustomizeSidebar: React.FC<{
  setLimitReached: React.Dispatch<React.SetStateAction<boolean>>;
  setPlanExpired: React.Dispatch<React.SetStateAction<boolean>>;
  setIssue: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setLimitReached, setPlanExpired, setIssue }) => {
  const [wordCountLoader, setWordCountLoader] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const storeContent = useStoreContent();
  const dispatch = useDispatch();
  const {
    selectedColor,
    setSelectedColor,
    selectedFont,
    setSelectedFont,
    fontCombinations,
    colorCombinations,
    businessName,
    value,
    handleFontChange,
    handleColorChange,
    handleWidthChange,
    resetStyles,
  } = useCustomizeSidebar();

  useEffect(() => {
    fetchInitialCustomizationData(
      dispatch,
      setSelectedColor,
      setSelectedFont,
      () => {},
      storeContent
    );
  }, []);

  const handleNextPage = async () => {
    await nextPage(
      setWordCountLoader,
      setLimitReached,
      setPlanExpired,
      setIssue,
      navigate
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white w-full min-h-screen h-screen z-10 border-2 flex flex-col justify-between">
      <div className="flex items-center justify-between p-4">
        <img
          src="https://plugin.mywpsite.org/logo.svg"
          alt="Gravity Write Logo"
          className="h-10 cursor-pointer w-44"
        />
      </div>

      <div className="mb-auto p-4">
        <h2 className="text-xl font-semibold">Customize</h2>
        <p className="text-sm text-gray-500 mt-2.5">
          Add your own Logo, Change Color and Fonts
        </p>

        <LogoSection
          businessName={businessName}
          value={value}
          onWidthChange={handleWidthChange}
        />

        <FontSelector
          fontCombinations={fontCombinations}
          selectedFont={selectedFont}
          handleFontChange={handleFontChange}
          resetStyles={resetStyles}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          dropdownRef={dropdownRef}
        />

        <ColorSelector
          colorCombinations={colorCombinations}
          selectedColor={selectedColor}
          handleColorChange={handleColorChange}
          resetStyles={resetStyles}
        />
      </div>

      <div className="w-full flex items-center gap-4 p-4">
        <Link to="/design" className="w-full">
          <button className="border previous-btn flex px-2 py-3 text-sm text-white sm:mt-2 rounded-md gap-2.5 justify-center w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="14"
              viewBox="0 0 20 14"
              fill="none"
            >
              <path
                d="M0.863604 6.3636C0.512132 6.71508 0.512132 7.28492 0.863604 7.6364L6.59117 13.364C6.94264 13.7154 7.51249 13.7154 7.86396 13.364C8.21543 13.0125 8.21543 12.4426 7.86396 12.0912L2.77279 7L7.86396 1.90883C8.21543 1.55736 8.21543 0.987511 7.86396 0.636039C7.51249 0.284567 6.94264 0.284567 6.59117 0.636039L0.863604 6.3636ZM19.5 6.1H1.5V7.9H19.5V6.1Z"
                fill="#1E2022"
              />
            </svg>
            Previous
          </button>
        </Link>
        <button
          onClick={handleNextPage}
          className="px-2 py-3 text-white rounded-md tertiary text-sm sm:mt-2 w-full"
        >
          {wordCountLoader ? (
            <div className="flex min-w-[65px] justify-center items-center">
              <svg
                className="w-5 h-5 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            </div>
          ) : (
            "Start Building"
          )}
        </button>
      </div>
    </div>
  );
};

export default CustomizeSidebar;
