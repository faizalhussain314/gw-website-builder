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
      // const url = getDomainFromEndpoint("/wp-json/custom/v1/get-form-details");
      const url =
        "https://solitaire-sojourner-02c.zipwp.link/wp-json/custom/v1/get-form-details";
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
              {colorCombination.map((color) => (
                <div
                  key={color.primary}
                  className={`${
                    selectedColor.primary === color.primary &&
                    selectedColor.secondary === color.secondary
                      ? "border-2 border-palatinate-blue-500 rounded-md"
                      : ""
                  } flex items-center justify-center mac:p-1`}
                >
                  <button
                    className="w-4 h-4 rounded-full mac:w-6 mac:h-6"
                    style={{ backgroundColor: color.primary }}
                    onClick={() => handleColorChange(color, true)}
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
