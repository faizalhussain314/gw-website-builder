import { Dispatch } from "redux";
import { wordpressAxios } from "@config";
import { setColor, setFont, setLogo } from "@Slice/activeStepSlice";
import { SelectedColor, SelectedFont } from "types/customdesign.type";

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

interface IframeMessage {
  type: string;
  primaryColor?: string;
  secondaryColor?: string;
  font?: SelectedFont;
  logoUrl?: string;
}

interface StoreContentParams {
  logo?: string;
  color?: SelectedColor;
  font?: string;
}

export const fetchInitialCustomizationData = async (
  dispatch: Dispatch,
  setSelectedColor: (color: SelectedColor) => void,
  setSelectedFont: (font: SelectedFont | null) => void,
  setLogoUrl: (url: string | null) => void,
  storeContent: (content: StoreContentParams) => Promise<void>
): Promise<void> => {
  try {
    const response = await wordpressAxios.post<FormDetailsResponse>(
      "/wp-json/custom/v1/get-form-details",
      {
        fields: ["color", "font", "logo"],
      }
    );

    const result = response.data;

    if (result) {
      // Handle color data
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
        const selectedFont: SelectedFont = JSON.parse(result.font);
        setSelectedFont(selectedFont);
        dispatch(setFont(selectedFont));
        sendMessageToIframes("changeFont", { font: selectedFont });
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
    console.error("Error fetching initial customization data:", error);
    throw error; // Re-throw to allow caller to handle
  }
};

export const sendMessageToIframes = (
  type: string,
  payload: SendMessagePayload
): void => {
  const iframes = document.getElementsByTagName("iframe");

  if (iframes.length > 0) {
    const message: IframeMessage = {
      type,
      primaryColor: payload.primary,
      secondaryColor: payload.secondary,
      font: payload.font,
      logoUrl: payload.logoUrl,
    };

    // Send message to all iframes
    Array.from(iframes).forEach((iframe) => {
      iframe?.contentWindow?.postMessage(message, "*");
    });
  } else {
    console.warn("No iframes found to send message to");
  }
};

// Alternative: Create a more specific service for this functionality
export class CustomizationDataService {
  async fetchInitialData(): Promise<FormDetailsResponse> {
    const response = await wordpressAxios.post<FormDetailsResponse>(
      "/wp-json/custom/v1/get-form-details",
      {
        fields: ["color", "font", "logo"],
      }
    );
    return response.data;
  }

  processColorData(
    colorData: string,
    dispatch: Dispatch,
    setSelectedColor: (color: SelectedColor) => void
  ): void {
    const resultColor: SelectedColor = JSON.parse(colorData);
    dispatch(setColor(resultColor));
    setSelectedColor(resultColor);
    sendMessageToIframes("changeGlobalColors", {
      primary: resultColor.primary,
      secondary: resultColor.secondary,
    });
  }

  processFontData(
    fontData: string,
    dispatch: Dispatch,
    setSelectedFont: (font: SelectedFont | null) => void
  ): void {
    const selectedFont: SelectedFont = JSON.parse(fontData);
    setSelectedFont(selectedFont);
    dispatch(setFont(selectedFont));
    sendMessageToIframes("changeFont", { font: selectedFont });
  }

  async processLogoData(
    logoData: string,
    dispatch: Dispatch,
    setLogoUrl: (url: string | null) => void,
    storeContent: (content: StoreContentParams) => Promise<void>
  ): Promise<void> {
    setLogoUrl(logoData);
    dispatch(setLogo(logoData));
    sendMessageToIframes("changeLogo", { logoUrl: logoData });
    await storeContent({ logo: logoData });
  }
}

// Updated function signature that removes getDomainFromEndpoint dependency
export const fetchInitialCustomizationDataV2 = async (
  dispatch: Dispatch,
  setSelectedColor: (color: SelectedColor) => void,
  setSelectedFont: (font: SelectedFont | null) => void,
  setLogoUrl: (url: string | null) => void,
  storeContent: (content: StoreContentParams) => Promise<void>
): Promise<void> => {
  const service = new CustomizationDataService();

  try {
    const result = await service.fetchInitialData();

    if (result) {
      // Handle color data
      if (result.color) {
        service.processColorData(result.color, dispatch, setSelectedColor);
      }

      // Handle font data
      if (result.font) {
        service.processFontData(result.font, dispatch, setSelectedFont);
      }

      // Handle logo data
      if (result.logo) {
        await service.processLogoData(
          result.logo,
          dispatch,
          setLogoUrl,
          storeContent
        );
      }
    }
  } catch (error) {
    console.error("Error fetching initial customization data:", error);
    throw error;
  }
};
