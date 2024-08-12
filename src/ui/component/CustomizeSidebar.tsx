import React, { useState, useEffect, useRef } from "react";
import GravityWriteLogo from "../../assets/logo.svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFont, setColor, setLogo } from "../../Slice/activeStepSlice";
import { RootState } from "../../store/store";

type FontCombination = {
  label: string;
  primaryFont: string;
};

type SelectedColor = {
  primary: string;
  secondary: string;
};

const fontCombinations: FontCombination[] = [
  { label: "Lora/Lato", primaryFont: "Lora" },
  { label: "Lato/Inter", primaryFont: "Lato" },
  { label: "Manrope/Inter", primaryFont: "Manrope" },
  { label: "Red Hat Display/Inter", primaryFont: "Red Hat Display" },
  { label: "Merriweather/Inter", primaryFont: "Merriweather" },
  { label: "PT Serif/Inter", primaryFont: "PT Serif" },
  { label: "Montserrat/Inter", primaryFont: "Montserrat" },
  { label: "Plus Jakarta Sans/Inter", primaryFont: "Plus Jakarta Sans" },
  { label: "Open Sans/Inter", primaryFont: "Open Sans" },
  { label: "Work Sans/Inter", primaryFont: "Work Sans" },
  { label: "Rubik/Inter", primaryFont: "Rubik" },
  { label: "Mulish/Inter", primaryFont: "Mulish" },
  { label: "Kaushan Script/Inter", primaryFont: "Kaushan Script" },
  { label: "Figtree/Inter", primaryFont: "Figtree" },
];

const CustomizeSidebar: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<SelectedColor>({
    primary: "",
    secondary: "",
  });
  const [selectedFont, setSelectedFont] = useState<FontCombination | null>(
    null
  );
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialStyles = useSelector((state: RootState) => ({
    primaryColor: state.userData.color.primary,
    secondaryColor: state.userData.color.secondary,
    fontFamily: state.userData.font,
    logoUrl: state.userData.logo,
  }));

  useEffect(() => {
    // Set the initial color if it has changed
    if (
      initialStyles.primaryColor !== selectedColor.primary ||
      initialStyles.secondaryColor !== selectedColor.secondary
    ) {
      setSelectedColor({
        primary: initialStyles.primaryColor,
        secondary: initialStyles.secondaryColor,
      });
    }

    // Set the initial font if it has changed
    const currentFontCombination = fontCombinations.find(
      (font) => font.primaryFont === initialStyles.fontFamily
    );
    if (currentFontCombination && currentFontCombination !== selectedFont) {
      setSelectedFont(currentFontCombination);
    }

    // Set the initial logo if it exists
    if (initialStyles.logoUrl && initialStyles.logoUrl !== logoUrl) {
      setLogoUrl(initialStyles.logoUrl);
    }
  }, [initialStyles, selectedColor, selectedFont, logoUrl]);

  const handleFontChange = (fontCombination: FontCombination) => {
    setSelectedFont(fontCombination);
    dispatch(setFont(fontCombination.primaryFont));
    setIsDropdownOpen(false);

    // Send message to iframe to change the font
    const iframes = document.getElementsByTagName("iframe");
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];
      iframe?.contentWindow?.postMessage(
        { type: "changeFont", font: fontCombination.primaryFont },
        "*"
      );
    }
  };

  const handleColorChange = (color: SelectedColor) => {
    setSelectedColor(color);
    dispatch(setColor(color));

    const primaryColor = color.primary;
    const secondaryColor = color.secondary;

    // Send message to iframe to change the global colors only if they are not empty
    if (primaryColor && secondaryColor) {
      const iframes = document.getElementsByTagName("iframe");
      for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i];
        iframe?.contentWindow?.postMessage(
          { type: "changeGlobalColors", primaryColor, secondaryColor },
          "*"
        );
      }
    }
  };

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch(
          "http://localhost/wordpress/wp-json/custom/v1/upload-logo",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const result = await response.json();
        const logoUrl: string = result.url;

        setLogoUrl(logoUrl);
        dispatch(setLogo(logoUrl));

        // Send message to iframe to change the logo
        const iframes = document.getElementsByTagName("iframe");
        for (let i = 0; i < iframes.length; i++) {
          const iframe = iframes[i];
          iframe?.contentWindow?.postMessage(
            { type: "changeLogo", logoUrl },
            "*"
          );
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const nextPage = () => {
    navigate("/final-preview");
  };

  const resetStyles = () => {
    // Dispatch default font to Redux store if necessary
    dispatch(setFont(initialStyles.fontFamily));

    // Send message to iframe to reset the styles
    const iframes = document.getElementsByTagName("iframe");
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];
      iframe?.contentWindow?.postMessage(
        {
          type: "resetStyles",
          primaryColor: initialStyles.primaryColor || "",
          secondaryColor: initialStyles.secondaryColor || "",
          fontFamily: initialStyles.fontFamily || "",
          logoUrl: initialStyles.logoUrl || "",
        },
        "*"
      );
    }
  };

  useEffect(() => {
    // Send message to iframe to set the logo if it exists
    if (initialStyles.logoUrl) {
      const iframes = document.getElementsByTagName("iframe");
      for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i];
        iframe?.contentWindow?.postMessage(
          { type: "changeLogo", logoUrl: initialStyles.logoUrl },
          "*"
        );
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [initialStyles.logoUrl]);

  return (
    <div className="bg-white min-h-screen h-screen z-10 border-2">
      <div className="flex items-center justify-between p-4">
        <img
          src={GravityWriteLogo}
          alt="Gravity Write Logo"
          className="h-10 cursor-pointer w-44"
        />
      </div>
      <div className={`p-4 block lg:block`}>
        <h2 className="text-xl font-bold">Customize</h2>
        <p className="text-sm text-gray-500">
          Add your own Logo, Change Color and Fonts
        </p>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Site Logo</label>
          <input
            type="file"
            className="w-full px-3 py-2 border rounded-md"
            onChange={handleLogoChange}
          />
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Uploaded Logo"
              className="mt-2 h-10 cursor-pointer"
            />
          )}
        </div>
        <div className="mt-6">
          <div className="flex w-full justify-between">
            <label className="block text-base font-medium mb-2">
              Font Pair
            </label>
            <span
              onClick={resetStyles}
              className="text-gray-400 text-base font-medium leading-5 cursor-pointer"
            >
              Reset
            </span>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-2 border rounded-md bg-white text-left"
            >
              {selectedFont ? selectedFont.label : "Choose Your Font"}
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto">
                {fontCombinations.map((fontCombination) => (
                  <div
                    key={fontCombination.label}
                    className={`p-2 hover:bg-gray-200 cursor-pointer ${
                      selectedFont?.label === fontCombination.label
                        ? "bg-gray-200"
                        : ""
                    }`}
                    onClick={() => handleFontChange(fontCombination)}
                  >
                    {fontCombination.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Color</label>
          <div className="border-2 border-[#DFEAF6] p-3 rounded-md">
            <div className="grid grid-cols-5 mac:gap-4 gap-3">
              {[
                { primary: "#FF2F86", secondary: "#FDF4FF" },
                { primary: "#7F27FF", secondary: "#F5F3FF" },
                { primary: "#5755FE", secondary: "#F2F2FE" },
                { primary: "#E421F4", secondary: "#FEF6FF" },
                { primary: "#16A34A", secondary: "#F0FDF4" },
                { primary: "#3D065A", secondary: "#F9ECFF" },
                { primary: "#FF8329", secondary: "#FFF7ED" },
                { primary: "#0E17FB", secondary: "#F6F6FF" },
                { primary: "#009FF1", secondary: "#F0F9FF" },
                { primary: "#FF5151", secondary: "#FEF2F2" },
              ].map((color) => (
                <div
                  key={color.primary}
                  className={`${
                    selectedColor.primary === color.primary
                      ? "border-2 border-palatinate-blue-500 rounded-md"
                      : ""
                  } flex items-center justify-center mac:p-1`}
                >
                  <button
                    className="w-4 h-4 rounded-full mac:w-6 mac:h-6"
                    style={{ backgroundColor: color.primary }}
                    onClick={() => handleColorChange(color)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 max-w-[18%] flex absolute bottom-0 justify-between">
          <div className="mb-4 w-full flex justify-between gap-2">
            <Link to={"/design"}>
              <button className="border previous-btn flex px-4 py-3 text-base sm:text-sm text-white mt-8 sm:mt-2 rounded-md gap-2 mac:gap-3 justify-center">
                <ArrowBackIcon /> Previous
              </button>
            </Link>
            <button
              onClick={nextPage}
              className="px-6 py-3 bg-blue-500 text-white rounded-md tertiary text-lg sm:text-sm mt-8 sm:mt-2"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeSidebar;
