import axios from "axios";

export async function handleOnLoadMsg({
  setwordCountAlert,
  setIsLoading,
  setLoaded,
  iframeRef,
  pages,
  selectedPage,
  updateContactDetails,
  setfindIndex,
  sendNonClickable,
  fontFamily,
  Color,
  logoUrl,
  updateIframeLogo,
  businessName,
  sendIframeMessage,
  generatedPage,
  updateIframeSrc,
  setShowIframe,
  fetchAndStorePageData,
  setShowGwLoader,
  setShowPopup,
  getDomainFromEndpoint,
  setIsContentGenerating,
  setapiIssue,
  setLoadedPages,
  Description,
  stepDescription,
  templateList,
  bearer_token,
  templateName,
  isPageGenerated,
}: {
  setwordCountAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  pages: any[];
  selectedPage: string | null;
  updateContactDetails: (email: string, phone: string, address: string) => void;
  setfindIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  sendNonClickable: () => void;
  fontFamily: string;
  Color: { primary: string; secondary: string };
  logoUrl: string;
  updateIframeLogo: (url: string, width: number) => void;
  businessName: string;
  sendIframeMessage: (type: string, value: any) => void;
  generatedPage: Record<string, any>;
  updateIframeSrc: (content: string) => void;
  setShowIframe: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAndStorePageData: (
    pageName: string,
    templateName: string,
    version: string
  ) => Promise<boolean>;
  setShowGwLoader: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  getDomainFromEndpoint: (endpoint: string) => string | null;
  setIsContentGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  setapiIssue: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadedPages: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  Description: string;
  stepDescription: string;
  templateList: { id: string };
  bearer_token: string;
  templateName: string;
  isPageGenerated: boolean;
}) {
  setwordCountAlert(false);
  setIsLoading(true);
  setLoaded(true);

  const iframe = iframeRef.current;
  const currentPage = pages.find((page) => page.name === selectedPage);
  const currentPageIndex = pages.findIndex(
    (page) => page.name === selectedPage
  );

  updateContactDetails(
    currentPage?.email,
    currentPage?.phoneNumber,
    currentPage?.address
  );

  setfindIndex(currentPageIndex);
  sendNonClickable();

  if (!iframe) return;

  if (["Blog", "Contact", "Contact Us"].includes(selectedPage)) {
    setLoadedPages((prev) => ({
      ...prev,
      [selectedPage]: true,
    }));
  }

  if (fontFamily) {
    iframe.contentWindow?.postMessage(
      { type: "changeFont", font: fontFamily },
      "*"
    );
  }

  if (Color.primary && Color.secondary) {
    iframe.contentWindow?.postMessage(
      {
        type: "changeGlobalColors",
        primaryColor: Color.primary,
        secondaryColor: Color.secondary,
      },
      "*"
    );
  }

  if (logoUrl) {
    updateIframeLogo(logoUrl, 150); // Assuming a default logo width
  } else if (businessName) {
    sendIframeMessage("businessName", businessName);
  }

  if (selectedPage && generatedPage[selectedPage]) {
    const existingContent = generatedPage[selectedPage][0];
    updateIframeSrc(existingContent);
    setShowIframe(false);
  } else if (selectedPage && !generatedPage[selectedPage]) {
    const fetchResult = await fetchAndStorePageData(
      selectedPage,
      templateName,
      "5.5"
    );
    if (fetchResult) return;

    const endpoint = getDomainFromEndpoint(
      "wp-json/custom/v1/check-word-count"
    );
    if (!endpoint) return;

    try {
      const response = await axios.get(endpoint);
      if (response?.data?.status) {
        iframe.contentWindow?.postMessage(
          {
            type: "start",
            templateName,
            pageName: currentPage?.slug,
            businessName,
            description: Description,
            stepDescription,
            template_id: templateList?.id,
            bearer_token,
          },
          "*"
        );
      } else {
        setIsContentGenerating(false);
        setwordCountAlert(true);
      }
    } catch (error) {
      console.error("Error while calling the word count API:", error);
      setapiIssue(true);
    } finally {
      setIsLoading(false);
    }
  }
}
