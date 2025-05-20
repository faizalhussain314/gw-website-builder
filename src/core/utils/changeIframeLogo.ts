// utils/changeIframeLogo.ts

import { sendIframeMessage } from "./sendIframeMessage.utils";

/**
 * Updates the iframe's logo and width dynamically using the `sendIframeMessage` utility.
 *
 * @param {string} imageUrl - The URL of the logo image.
 * @param {number} logoWidth - The width of the logo.
 */
export const updateIframeLogo = (imageUrl: string, logoWidth: number) => {
  if (!imageUrl) {
    console.error("Image URL is required to update the logo in the iframe.");
    return;
  }

  // Use the `sendIframeMessage` utility to update the logo
  sendIframeMessage("changeLogo", { logoUrl: imageUrl });

  if (logoWidth) {
    sendIframeMessage("changeLogoSize", { size: logoWidth });
  }
};
