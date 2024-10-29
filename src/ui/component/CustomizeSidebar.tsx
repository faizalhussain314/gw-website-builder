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
import {
  fetchInitialCustomizationData,
  sendMessageToIframes,
} from "../../core/utils/design.utils";
import { Font } from "../../types/activeStepSlice.type";

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
    primaryColor: state.userData.style.defaultColor.primary,
    secondaryColor: state.userData.style.defaultColor.secondary,
    primaryFont: state.userData.style.defaultFont.primary,
    secondaryFont: state.userData.style.defaultFont.secondary,
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

  const generateBusinessLogo = (businessName: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");

    // Add background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(businessName, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL("image/png");
  };

  const dataURLtoBlob = (dataUrl: string) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const uploadGeneratedLogo = async (businessName: string) => {
    const generatedLogo = generateBusinessLogo(businessName);
    const logoBlob = dataURLtoBlob(generatedLogo);

    const formData = new FormData();
    formData.append("image", logoBlob, `${businessName}-logo.png`);

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
      setError("Error uploading generated logo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessName) {
      uploadGeneratedLogo(businessName);
    }
  }, [businessName]);
  const handleFontChange = async (fontCombination: SelectedFont) => {
    setSelectedFont(fontCombination);
    dispatch(setFont(fontCombination));
    setIsDropdownOpen(false);

    await storeContent({ font: fontCombination });
    console.log("fontCombinationn", fontCombination);
    sendMessageToIframes("changeFont", { font: fontCombination });
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
      sendMessageToIframes("changeGlobalColors", {
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
      sendMessageToIframes("changeFont", {
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
          Start Building
        </button>
      </div>
    </div>
  );
};

export default CustomizeSidebar;
