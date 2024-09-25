import React, { useState, useEffect, useRef } from "react";
import GravityWriteLogo from "../../assets/logo.svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFont, setColor, setLogo } from "../../Slice/activeStepSlice";
import { RootState } from "../../store/store";
import useDomainEndpoint from "../../hooks/useDomainEndpoint";
import useStoreContent from "../../hooks/useStoreContent ";

type FontCombination = {
  label: string;
  primaryFont: string;
};

type SelectedColor = {
  primary: string;
  secondary: string;
};

interface ColorCombination {
  primary: string;
  secondary: string;
}

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

const colorCombination: ColorCombination[] = [
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
    const sendMessageToIframes = (type, payload) => {
      console.log(payload, "098790870969sd6");
      const iframes = document.getElementsByTagName("iframe");

      if (iframes.length > 0) {
        for (let i = 0; i < iframes.length; i++) {
          const iframe = iframes[i];

          iframe.onload = () => {
            if (type == "changeGlobalColors") {
              const iframes = document.getElementsByTagName("iframe");
              for (let i = 0; i < iframes.length; i++) {
                const iframe = iframes[i];
                iframe?.contentWindow?.postMessage(
                  {
                    type: "changeGlobalColors",
                    primaryColor: payload.primary,
                    secondaryColor: payload.secondary,
                  },
                  "*"
                );
              }
            }

            iframe?.contentWindow?.postMessage({ type, ...payload }, "*");
            console.log(`Iframe loaded, sending ${type}:`, payload);
          };

          if (iframe?.contentWindow) {
            if (type == "changeGlobalColors") {
              const iframes = document.getElementsByTagName("iframe");
              for (let i = 0; i < iframes.length; i++) {
                const iframe = iframes[i];
                iframe?.contentWindow?.postMessage(
                  {
                    type: "changeGlobalColors",
                    primaryColor: payload.primary,
                    secondaryColor: payload.secondary,
                  },
                  "*"
                );
              }
            }
            iframe?.contentWindow?.postMessage({ type, ...payload }, "*");
            console.log(`Iframe is already loaded, sending ${type}:`, payload);
          }
        }
      } else {
        console.log("No iframes found");
      }
    };

    const fetchInitialData = async () => {
      const url = getDomainFromEndpoint("/wp-json/custom/v1/get-form-details");
      // const url =
      //   "https://solitaire-sojourner-02c.zipwp.link/wp-json/custom/v1/get-form-details";
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fields: ["color", "font", "logo"] }),
        });
        const result = await response.json();

        if (result) {
          if (result.color) {
            const resultColor = JSON.parse(result.color);
            const postmsg: SelectedColor = {
              // Fixing the type here
              primary: resultColor.primary,
              secondary: resultColor.secondary,
            };

            dispatch(setColor(resultColor));
            setSelectedColor({
              primary: resultColor.primary,
              secondary: resultColor.secondary,
            });
            if (postmsg.primary) {
              handleColorChange(postmsg, false);
              console.log("post message was sent successfull", postmsg);
            } else {
              console.log("postmsg was empty");
            }
            console.log("result.color:", resultColor.primary);

            // Send message to iframes for color change
            sendMessageToIframes("changeGlobalColors", postmsg);
          }

          if (result.font) {
            const fontCombination = fontCombinations.find(
              (font) => font.primaryFont === result.font
            );
            setSelectedFont(fontCombination || null);
            dispatch(setFont(result.font));

            // Send message to iframes for font change
            sendMessageToIframes("changeFont", { font: result.font });
          }

          if (result.logo) {
            const logoUrl = result.logo;
            const resultColor = JSON.parse(result.color);
            setLogoUrl(logoUrl);
            dispatch(setLogo(logoUrl));

            await storeContent({ logo: logoUrl });

            // Send message to iframes for logo change
            sendMessageToIframes("changeGlobalColors", {
              primaryColor: resultColor.primary,
              secondaryColor: resultColor.secondary,
            });
            sendMessageToIframes("changeLogo", { logoUrl });
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [dispatch, getDomainFromEndpoint]);

  const handleFontChange = async (fontCombination: FontCombination) => {
    setSelectedFont(fontCombination);
    dispatch(setFont(fontCombination.primaryFont));
    setIsDropdownOpen(false);

    await storeContent({ font: fontCombination.primaryFont });

    const iframes = document.getElementsByTagName("iframe");
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];
      iframe?.contentWindow?.postMessage(
        { type: "changeFont", font: fontCombination.primaryFont },
        "*"
      );
    }
  };

  const handleColorChange = async (color: SelectedColor, store: boolean) => {
    setSelectedColor(color);
    dispatch(setColor(color));
    console.log("color from handleColorChange", color);

    if (store) {
      console.log("true was executed");
      await storeContent({ color });
    }

    if (color.primary && color.secondary) {
      const iframes = document.getElementsByTagName("iframe");
      for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i];
        iframe?.contentWindow?.postMessage(
          {
            type: "changeGlobalColors",
            primaryColor: color.primary,
            secondaryColor: color.secondary,
          },
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
        const logoUrl: string = result.url;

        setLogoUrl(logoUrl);
        dispatch(setLogo(logoUrl));

        await storeContent({ logo: logoUrl });

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
    dispatch(setFont(initialStyles.fontFamily));

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
  }, []);

  return (
    <div className="bg-white w-full min-h-screen h-screen z-10 border-2 flex flex-col justify-between">
      <>
        {/* Header Section */}
        <div className="flex items-center justify-between p-4">
          <img
            src={GravityWriteLogo}
            alt="Gravity Write Logo"
            className="h-10 cursor-pointer w-44"
          />
        </div>
        {/* Main Section */}
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
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Uploaded Logo"
                className="mt-2 h-10 cursor-pointer"
              />
            )}
          </div>
          {/* Font Choosing Section */}
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
                className="w-full p-2 border rounded-md flex items-center justify-between bg-white text-left focus:border-palatinate-blue-600 active:border-palatinate-blue-600"
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
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto p-2.5">
                  {fontCombinations.map((fontCombination) => (
                    <div
                      key={fontCombination.label}
                      className={`p-2.5 hover:bg-[#F9FAFB] cursor-pointer ${
                        selectedFont?.label === fontCombination.label
                          ? "bg-[#F9FAFB]"
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
          {/* Color Selection Section */}
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
              {colorCombination.map((color) => (
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
                    onClick={() => handleColorChange(color, true)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
      {/* CTA Button Section */}
      <div className="w-full flex items-center gap-4 p-4">
        <Link to={"/design"} className="w-full">
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
