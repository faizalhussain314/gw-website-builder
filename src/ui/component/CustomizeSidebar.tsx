import React, { useState, useEffect, useRef } from "react";
import GravityWriteLogo from "../../assets/logo.svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFont, setColor, setLogo } from "../../Slice/activeStepSlice";
import { RootState } from "../../store/store";
import useDomainEndpoint from "../../hooks/useDomainEndpoint";
import useStoreContent from "../../hooks/useStoreContent ";
import { SelectedColor, SelectedFont } from "../../types/customdesign.type";
import FontSelector from "../component/custom-design/FontSelector";
import ColorSelector from "../component/custom-design//ColorSelector";
import { fetchInitialCustomizationData } from "../../core/utils/design.utils";
import { Font } from "../../types/activeStepSlice.type";
import { Slider } from "@mui/material";
import { sendIframeMessage } from "../../core/utils/sendIframeMessage.utils";
import { uploadLogo } from "../../core/utils/customizesidebar/logoUploadUtils";
import uploadLogoIcon from "../../assets/icons/uploadfile.svg";

const CustomizeSidebar: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<SelectedColor>({
    primary: "",
    secondary: "",
  });
  const fontCombinations = useSelector(
    (state: RootState) => state.userData.style.fonts || null
  );
  const previousFont = useSelector((state: RootState) => state.userData.font);

  const [selectedFont, setSelectedFont] = useState<Font>(previousFont);
  const colorCombinations = useSelector(
    (state: RootState) => state.userData?.style.color || []
  );
  const businessName = useSelector(
    (state: RootState) => state.userData.businessName
  );

  const [logoSize, setLogoSize] = useState<number>(150);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getDomainFromEndpoint } = useDomainEndpoint();
  const storeContent = useStoreContent();

  const initialStyles = useSelector((state: RootState) => ({
    primaryColor: state.userData.style.defaultColor.primary,
    secondaryColor: state.userData.style.defaultColor.secondary,
    primaryFont: state.userData.style.defaultFont.primary,
    secondaryFont: state.userData.style.defaultFont.secondary,
    logoUrl: state.userData.logo,
  }));

  const [value, setValue] = React.useState<number>(150);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);

    sendIframeMessage("changeLogoSize", { size: newValue });
  };

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

  useEffect(() => {
    if (businessName) {
      console.log("event started");
      window.parent.postMessage(
        { type: "businessName", text: businessName },
        "*"
      );
    }
  }, [businessName]);
  const handleFontChange = async (fontCombination: SelectedFont) => {
    setSelectedFont(fontCombination);
    dispatch(setFont(fontCombination));
    setIsDropdownOpen(false);

    await storeContent({ font: fontCombination });

    sendIframeMessage("changeFont", { font: fontCombination });
  };

  const handleColorChange = async (color: SelectedColor, store = true) => {
    setSelectedColor(color);
    dispatch(setColor(color));

    if (store) {
      await storeContent({ color });
    }
    sendIframeMessage("changeGlobalColors", color);
  };

  const extractFileName = (url: string): string => {
    return url?.split("/").pop() || "Unknown file";
  };
  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadLogo(
        file,
        getDomainFromEndpoint,
        setLogoUrl,
        setError,
        setSuccessMessage,
        setLoading,
        dispatch,
        storeContent,
        sendIframeMessage
      );
    }
  };

  const resetStyles = async (resetType: "color" | "font" | "both") => {
    if (resetType === "color" || resetType === "both") {
      const color = {
        primary: initialStyles.primaryColor,
        secondary: initialStyles.secondaryColor,
      };
      dispatch(
        setColor({
          primary: initialStyles.primaryColor,
          secondary: initialStyles.secondaryColor,
        })
      );
      setSelectedColor(color);
      await storeContent({ color });
      sendIframeMessage("changeGlobalColors", {
        primary: initialStyles.primaryColor,
        secondary: initialStyles.secondaryColor,
      });
    }

    if (resetType === "font" || resetType === "both") {
      const font = {
        primary: initialStyles.primaryFont,
        secondary: initialStyles.secondaryFont,
      };
      dispatch(setFont(font));
      await storeContent({ font });
      sendIframeMessage("changeFont", {
        font: font,
      });
      setSelectedFont(font);
    }
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
  useEffect(() => {
    const savedLogoUrl = localStorage.getItem("logoUrl");
    if (savedLogoUrl) {
      setLogoUrl(savedLogoUrl);
    }
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
            className="w-full p-3 border border-[#DFEAF6] rounded-md hidden"
            onChange={handleLogoChange}
            ref={inputRef}
            name={extractFileName(logoUrl)}
            // value={logoUrl}
            placeholder={extractFileName(logoUrl)}
          />
          <button
            onClick={() => {
              inputRef.current.click();
            }}
            className="p-3 border border-[#DFEAF6] w-full rounded-md text-[#88898A] font-medium flex items-center gap-2 flex-1"
          >
            <img src={uploadLogoIcon} className="w-5" />
            <span>
              {logoUrl ? extractFileName(logoUrl) : "upload file here"}
            </span>
          </button>

          {loading && (
            <p className="text-sm text-blue-500 mt-2">Uploading logo...</p>
          )}
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          {successMessage && (
            <p className="text-sm text-green-500 mt-2">{successMessage}</p>
          )}
          {logoUrl && (
            <div className="bg-white p-2.5 mt-2.5 border border-[#DFEAF6] rounded-md shadow-lg">
              <img
                src={logoUrl}
                alt="Uploaded Logo"
                className="mt-2 h-6 cursor-pointer"
              />
              <div className="h-8 mt-4 custom-slider">
                <Slider
                  aria-label="Logo Size"
                  value={value}
                  onChange={handleChange}
                  min={10}
                  max={200}
                />
              </div>
            </div>
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
          onClick={nextPage}
          className="px-2 py-3 text-white rounded-md tertiary text-sm sm:mt-2 w-full"
        >
          Start Building
        </button>
      </div>
    </div>
  );
};

export default CustomizeSidebar;
