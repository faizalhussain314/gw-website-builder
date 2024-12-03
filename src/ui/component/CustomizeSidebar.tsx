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
    logoUrl: state.userData.logo,
  }));

  // slider

  const [value, setValue] = React.useState<number>(30);

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

  const generateBusinessLogo = (businessName: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");

    // Add background
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Define a function to adjust font size and split text into lines if necessary
    const fitTextToCanvas = (text, maxWidth) => {
      let fontSize = 24;
      ctx.font = `bold ${fontSize}px Arial`;

      // Reduce font size if text is too wide
      while (ctx.measureText(text).width > maxWidth && fontSize > 8) {
        fontSize -= 1;
        ctx.font = `bold ${fontSize}px Arial`;
      }

      // Split text if it is still too wide
      const words = text.split(" ");
      const lines = [];
      let line = "";

      for (let i = 0; i < words.length; i++) {
        const testLine = line + (line ? " " : "") + words[i];
        if (ctx.measureText(testLine).width > maxWidth) {
          lines.push(line);
          line = words[i];
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      return { fontSize, lines };
    };

    // Fit the business name to the canvas width and get lines
    const maxWidth = canvas.width - 10; // Padding
    const { fontSize, lines } = fitTextToCanvas(businessName, maxWidth);

    // Set the final font size
    ctx.font = `bold ${fontSize}px Arial`;

    // Draw each line on the canvas
    const lineHeight = fontSize + 4;
    const yOffset = (canvas.height - lineHeight * lines.length) / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, yOffset + index * lineHeight);
    });

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

      sendIframeMessage("changeLogo", { logoUrl: newLogoUrl });
    } catch (err) {
      setError("Error uploading generated logo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!validImageTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPG, PNG, or GIF).");
        return; // Prevent further processing if file type is not valid
      }
      const formData = new FormData();
      formData.append("image", file);
      const url = getDomainFromEndpoint("/wp-json/custom/v1/upload-logo");

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

        // Send the logo URL to the iframe
        // window.parent.postMessage(
        //   { type: "changeLogo", logoUrl: newLogoUrl },
        //   "*"
        // );
        sendIframeMessage("changeLogo", { logoUrl: newLogoUrl });
      } catch (err) {
        console.error("Error uploading image:", err);
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
