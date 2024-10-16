import React, { useState, useEffect, useRef } from "react";
import GravityWriteLogo from "../../assets/logo.svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFont, setColor, setLogo } from "../../Slice/activeStepSlice";
import { RootState } from "../../store/store";
import useDomainEndpoint from "../../hooks/useDomainEndpoint";
import useStoreContent from "../../hooks/useStoreContent ";
import {
  FontCombination,
  SelectedColor,
  ColorCombination,
} from "../../types/customdesign.type";
import FontSelector from "../component/custom-design/FontSelector";
import ColorSelector from "../component/custom-design//ColorSelector";
import {
  fetchInitialCustomizationData,
  sendMessageToIframes,
} from "../../core/utils/design.utils";

const fontCombinations: FontCombination[] = [
  { label: "Lora/Lato", primaryFont: "Lora", secondaryFont: "" },
  { label: "Lato/Inter", primaryFont: "Lato", secondaryFont: "" },
  { label: "Manrope/Inter", primaryFont: "Manrope", secondaryFont: "" },
  {
    label: "Red Hat Display/Inter",
    primaryFont: "Red Hat Display",
    secondaryFont: "",
  },
  {
    label: "Merriweather/Inter",
    primaryFont: "Merriweather",
    secondaryFont: "",
  },
  { label: "PT Serif/Inter", primaryFont: "PT Serif", secondaryFont: "" },
  { label: "Montserrat/Inter", primaryFont: "Montserrat", secondaryFont: "" },
  {
    label: "Plus Jakarta Sans/Inter",
    primaryFont: "Plus Jakarta Sans",
    secondaryFont: "",
  },
  { label: "Open Sans/Inter", primaryFont: "Open Sans", secondaryFont: "" },
  { label: "Work Sans/Inter", primaryFont: "Work Sans", secondaryFont: "" },
  { label: "Rubik/Inter", primaryFont: "Rubik", secondaryFont: "" },
  { label: "Mulish/Inter", primaryFont: "Mulish", secondaryFont: "" },
  {
    label: "Kaushan Script/Inter",
    primaryFont: "Kaushan Script",
    secondaryFont: "",
  },
  { label: "Figtree/Inter", primaryFont: "Figtree", secondaryFont: "" },
];

const colorCombinations: ColorCombination[] = [
  { primary: "#1FB68D", secondary: "#EFFFFB" },
  { primary: "#7F27FF", secondary: "#F5F3FF" },
  { primary: "#5755FE", secondary: "#F2F2FE" },
  { primary: "#FFA800", secondary: "#FFFCE5" },
  { primary: "#16A34A", secondary: "#F0FDF4" },
  { primary: "#3D065A", secondary: "#F9ECFF" },
  { primary: "#FF8329", secondary: "#FFF7ED" },
  { primary: "#0E17FB", secondary: "#F6F6FF" },
  { primary: "#009FF1", secondary: "#F0F9FF" },
  { primary: "#FF5151", secondary: "#FEF2F2" },
];

const CustomizeSidebar: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<SelectedColor>({
    primary: "",
    secondary: "",
  });
  const [selectedFont, setSelectedFont] = useState<FontCombination | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getDomainFromEndpoint } = useDomainEndpoint();
  const storeContent = useStoreContent();

  const initialStyles = useSelector((state: RootState) => ({
    primaryColor: state.userData.color.primary,
    secondaryColor: state.userData.color.secondary,
    fontFamily: state.userData.font,
    logoUrl: state.userData.logo,
  }));

  useEffect(() => {
    fetchInitialCustomizationData(
      getDomainFromEndpoint,
      dispatch,
      setSelectedColor,
      setSelectedFont,
      setLogoUrl,
      storeContent
    );
  }, [dispatch, getDomainFromEndpoint]);

  const handleFontChange = async (fontCombination: FontCombination) => {
    setSelectedFont(fontCombination);
    dispatch(setFont(fontCombination.primaryFont));
    setIsDropdownOpen(false);

    await storeContent({ font: fontCombination.primaryFont });
    sendMessageToIframes("changeFont", { font: fontCombination.primaryFont });
  };

  const handleColorChange = async (color: SelectedColor, store = true) => {
    setSelectedColor(color);
    dispatch(setColor(color));

    if (store) {
      await storeContent({ color });
    }
    sendMessageToIframes("changeGlobalColors", color);
  };

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      const url = getDomainFromEndpoint("/wp-json/custom/v1/upload-logo");

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const result = await response.json();
        const newLogoUrl = result.url;

        setLogoUrl(newLogoUrl);
        dispatch(setLogo(newLogoUrl));
        await storeContent({ logo: newLogoUrl });

        sendMessageToIframes("changeLogo", { logoUrl: newLogoUrl });
      } catch (err) {
        setError("Error uploading image. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const resetStyles = () => {
    dispatch(setFont(initialStyles.fontFamily));
    sendMessageToIframes("resetStyles", {
      primary: initialStyles.primaryColor,
      secondary: initialStyles.secondaryColor,
      font: initialStyles.fontFamily,
      logoUrl: initialStyles.logoUrl,
    });
  };

  const nextPage = () => navigate("/final-preview");

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
          src={GravityWriteLogo}
          alt="Gravity Write Logo"
          className="h-10 cursor-pointer w-44"
        />
      </div>
      <div className="mb-auto p-4">
        <h2 className="text-xl font-semibold">Customize</h2>
        <p className="text-sm text-gray-500 mt-2.5">
          Add your own Logo, Change Color and Fonts
        </p>

        {/* Site Logo Section */}
        <div className="mt-6">
          <label className="block text-base font-semibold mb-2.5">
            Site Logo
          </label>
          <input
            type="file"
            className="w-full p-3 border border-[#DFEAF6] rounded-md"
            onChange={handleLogoChange}
          />
          {loading && (
            <p className="text-sm text-blue-500 mt-2">Uploading logo...</p>
          )}
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Uploaded Logo"
              className="mt-2 h-10 cursor-pointer"
            />
          )}
        </div>

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
          <button className="border previous-btn flex px-4 py-3 text-base text-white sm:mt-2 rounded-md gap-2.5 justify-center w-full">
            <ArrowBackIcon fontSize="small" /> Previous
          </button>
        </Link>
        <button
          onClick={nextPage}
          className="px-4 py-3 text-white rounded-md tertiary text-base sm:mt-2 w-full"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CustomizeSidebar;
