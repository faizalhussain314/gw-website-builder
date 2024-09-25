import React, { createContext, useContext, useState, useEffect } from "react";
import useDomainEndpoint from "../../hooks/useDomainEndpoint";

interface CustomizationContextProps {
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  setLogoUrl: (logo: string) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setFontFamily: (font: string) => void;
}

const CustomizationContext = createContext<CustomizationContextProps | null>(
  null
);

export const useCustomization = () => {
  return useContext(CustomizationContext);
};

export const CustomizationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string>("");
  const [secondaryColor, setSecondaryColor] = useState<string>("");
  const [fontFamily, setFontFamily] = useState<string>("");
  const { getDomainFromEndpoint } = useDomainEndpoint();

  useEffect(() => {
    const fetchInitialData = async () => {
      const url = getDomainFromEndpoint("/wp-json/custom/v1/get-form-details");
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fields: ["color", "font", "logo"] }),
        });
        const result = await response.json();

        if (result.color) {
          const colors = JSON.parse(result.color);
          setPrimaryColor(colors.primary);
          setSecondaryColor(colors.secondary);
        }

        if (result.font) {
          setFontFamily(result.font);
        }

        if (result.logo) {
          setLogoUrl(result.logo);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [getDomainFromEndpoint]);

  return (
    <CustomizationContext.Provider
      value={{
        logoUrl,
        primaryColor,
        secondaryColor,
        fontFamily,
        setLogoUrl,
        setPrimaryColor,
        setSecondaryColor,
        setFontFamily,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};
