export const fetchAndReplaceImages = async (
  iframeRef: React.RefObject<HTMLIFrameElement>,
  generateAIImage: (originalUrl: string) => Promise<string>
): Promise<void> => {
  if (!iframeRef.current) {
    console.error("Iframe reference is null.");
    return;
  }

  const iframe = iframeRef.current;
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

  if (!iframeDoc) {
    console.error("Unable to access iframe content.");
    return;
  }

  const images = iframeDoc.querySelectorAll("img");

  for (const img of images) {
    const originalSrc = img.getAttribute("src");

    if (originalSrc) {
      try {
        // Generate a new AI image URL
        const newImageUrl = await generateAIImage(originalSrc);

        img.setAttribute("src", newImageUrl);
      } catch (error) {
        console.error(`Error replacing image ${originalSrc}:`, error);
      }
    }
  }
};
