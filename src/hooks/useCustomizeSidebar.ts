import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFont, setColor, setWidth } from "@Slice/activeStepSlice";
import { RootState } from "@store/store";
import useStoreContent from "@hooks/useStoreContent ";
import { SelectedColor, SelectedFont } from "types/customdesign.type";
import { Font } from "types/activeStepSlice.type";
import { sendIframeMessage } from "@utils/sendIframeMessage.utils";
import { CustomizeSidebarService } from "@api/wordpress-api/customizeSidebarService";
import { useDebounce } from "use-debounce";

export const useCustomizeSidebar = () => {
  const dispatch = useDispatch();
  const storeContent = useStoreContent();
  const customizeSidebarService = useMemo(
    () => new CustomizeSidebarService(),
    []
  );

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
  const darkTheme = useSelector(
    (state: RootState) => state.userData.templateList.dark_theme
  );

  const initialStyles = useSelector((state: RootState) => ({
    primaryColor: state.userData.style.defaultColor.primary,
    secondaryColor: state.userData.style.defaultColor.secondary,
    primaryFont: state.userData.style.defaultFont.primary,
    secondaryFont: state.userData.style.defaultFont.secondary,
    logoUrl: state.userData.logo,
  }));

  const [value, setValue] = useState<number>(150);
  const [debouncedValue] = useDebounce(value, 300);

  const handleFontChange = async (fontCombination: SelectedFont) => {
    setSelectedFont(fontCombination);
    dispatch(setFont(fontCombination));
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

  const handleWidthChange = (newValue: number) => {
    setValue(newValue);
    dispatch(setWidth(newValue));
    sendIframeMessage("changeLogoSize", { size: newValue });
  };

  const resetStyles = async (resetType: "color" | "font" | "both") => {
    if (resetType === "color" || resetType === "both") {
      const color = {
        primary: initialStyles.primaryColor,
        secondary: initialStyles.secondaryColor,
      };
      dispatch(setColor(color));
      setSelectedColor(color);
      await storeContent({ color });
      sendIframeMessage("changeGlobalColors", color);
    }

    if (resetType === "font" || resetType === "both") {
      const font = {
        primary: initialStyles.primaryFont,
        secondary: initialStyles.secondaryFont,
      };
      dispatch(setFont(font));
      await storeContent({ font });
      sendIframeMessage("changeFont", { font });
      setSelectedFont(font);
    }
  };

  // Update logo width with debounced value
  useEffect(() => {
    const updateLogoWidth = async () => {
      try {
        await customizeSidebarService.setLogoWidth(debouncedValue);
      } catch (error) {
        console.error("Error while setting logo width:", error);
      }
    };

    if (debouncedValue) {
      updateLogoWidth();
    }
  }, [customizeSidebarService, debouncedValue]);

  // Business name effect
  useEffect(() => {
    if (businessName) {
      window.parent.postMessage(
        {
          type: "businessName",
          text: businessName,
          dark_theme: darkTheme ?? false,
        },
        "*"
      );
    }
  }, [businessName, darkTheme]);

  return {
    selectedColor,
    setSelectedColor,
    selectedFont,
    setSelectedFont,
    fontCombinations,
    colorCombinations,
    businessName,
    initialStyles,
    value,
    setValue,
    handleFontChange,
    handleColorChange,
    handleWidthChange,
    resetStyles,
  };
};
