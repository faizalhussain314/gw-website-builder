// import { Dispatch, SetStateAction } from "react";
// import { RootState } from "../../../store/store";
// import { Font } from "../../../types/activeStepSlice.type";
import {
  GetDomainFromEndpoint,
  SetLogoUrl,
  SetError,
  SetSuccessMessage,
  SetLoading,
  DispatchAction,
  StoreContent,
  SendIframeMessage,
} from "../../../types/customdesign.type";

export const uploadLogo = async (
  file: File,
  getDomainFromEndpoint: GetDomainFromEndpoint,
  setLogoUrl: SetLogoUrl,
  setError: SetError,
  setSuccessMessage: SetSuccessMessage,
  setLoading: SetLoading,
  dispatch: DispatchAction,
  storeContent: StoreContent,
  sendIframeMessage: SendIframeMessage
) => {
  const validImageTypes = ["image/jpeg", "image/png", "image/gif"];

  if (!validImageTypes.includes(file.type)) {
    setError("Please upload a valid image file (JPG, PNG, or GIF).");
    return;
  }

  setLoading(true);
  setError(null);
  setSuccessMessage(null);

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
    dispatch({ type: "SET_LOGO", payload: newLogoUrl });
    await storeContent({ logo: newLogoUrl });

    sendIframeMessage("changeLogo", { logoUrl: newLogoUrl });

    setSuccessMessage("Logo uploaded successfully!");
  } catch (err) {
    setError("Error uploading image. Please try again.");
  } finally {
    setLoading(false);
  }
};
