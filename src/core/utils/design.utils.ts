import { Dispatch } from "redux";
import { setColor, setFont, setLogo } from "../../Slice/activeStepSlice";
import { SelectedColor, SelectedFont } from "../../types/customdesign.type";
import { Font } from "../../types/activeStepSlice.type";

interface FormDetailsResponse {
  color?: string;
  font?: string;
  logo?: string;
}

interface SendMessagePayload {
  primary?: string;
  secondary?: string;
  font?: SelectedFont;
  logoUrl?: string;
}

export const fetchInitialCustomizationData = async (
  getDomainFromEndpoint: (endpoint: string) => string,
  dispatch: Dispatch,
  setSelectedColor: (color: SelectedColor) => void,
  setSelectedFont: (font: SelectedFont | null) => void,
  setLogoUrl: (url: string | null) => void,
  storeContent: (content: {
    logo?: string;
    color?: SelectedColor;
    font?: string;
  }) => Promise<void>
) => {
  const url = getDomainFromEndpoint("wp-json/custom/v1/get-form-details");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: ["color", "font", "logo"] }),
    });

    const result: FormDetailsResponse = await response.json();

    if (result) {
      // Handle color data
      console.log("result:", result);
      if (result.color) {
        const resultColor: SelectedColor = JSON.parse(result.color);
        dispatch(setColor(resultColor));
        setSelectedColor(resultColor);
        sendMessageToIframes("changeGlobalColors", {
          primary: resultColor.primary,
          secondary: resultColor.secondary,
        });
      }

      // Handle font data
      if (result.font) {
        const selectedfont: SelectedFont = JSON.parse(result.font); // Parse the font string to an object

        setSelectedFont(selectedfont);
        dispatch(setFont(selectedfont));
        sendMessageToIframes("changeFont", { font: selectedfont });
      }

      // Handle logo data
      if (result.logo) {
        const logoUrl = result.logo;
        setLogoUrl(logoUrl);
        dispatch(setLogo(logoUrl));
        sendMessageToIframes("changeLogo", { logoUrl });
        await storeContent({ logo: logoUrl });
      }
    }
  } catch (error) {
    console.error("Error fetching initial data:", error);
  }
};

export const sendMessageToIframes = (
  type: string,
  payload: SendMessagePayload
) => {
  const iframes = document.getElementsByTagName("iframe");

  if (iframes.length > 0) {
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];
      const message = {
        type,
        primaryColor: payload.primary,
        secondaryColor: payload.secondary,
        font: payload.font,
        logoUrl: payload.logoUrl,
      };
      iframe?.contentWindow?.postMessage(message, "*");

      console.log(`Iframe sent: type=${type}`, message);
    }
  } else {
    console.log("No iframes found");
  }
};
