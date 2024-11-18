import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import GravityWriteLogo from "../../../assets/logo.svg";
import MenuIcon from "../../../assets/menu.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpgradePopup from "../../component/dialogs/UpgradePopup";
import { Link, useNavigate } from "react-router-dom";
import useIframeMessage from "../../../hooks/useIframeMessage";
import { ChangeLogoMessage } from "../../../types/iframeMessages.type";
import ViewModeSwitcher from "../../component/finalpreview/ViewModeSwitcher";
import PageSelector from "../../component/finalpreview/PageSelector";
import CloseIcon from "@mui/icons-material/Close";
import popupimg from "../../../assets/popupimg.svg";
import { Page } from "../../../types/page.type";
import PlumberPageSkeleton from "../../component/PlumberPageSkeleton ";
import GwLoader from "../../component/loader/gwLoader";
import useDomainEndpoint from "../../../hooks/useDomainEndpoint";
// import usePageData from "../../../hooks/usePageData";
import { savePagesToDB } from "../../../infrastructure/api/wordpress-api/final-preview/savePagesApi.api";
import {
  setColor,
  setFont,
  updateReduxPage,
} from "../../../Slice/activeStepSlice";
import CustomizePopup from "../../component/dialogs/CustomizePopup";
import { deletePage } from "../../../infrastructure/api/wordpress-api/final-preview/deletePage.api";
import { deleteStyle } from "../../../infrastructure/api/wordpress-api/final-preview/deleteStyle.api";
import { sendIframeMessage } from "../../../core/utils/sendIframeMessage.utils.ts";

const FinalPreview: React.FC = () => {
  const reduxPages =
    useSelector((state: RootState) => state.userData?.templateList.pages) || [];

  const validReduxPages: Page[] = useMemo(() => {
    if (!reduxPages.length) return [];
    return reduxPages.map((page) => ({
      name: page.title,
      status: "", // Set a default status for each page
      slug: page.slug,
      selected: false, // Default selected state
    }));
  }, [reduxPages]);

  // Default pages if reduxPages is empty
  const defaultPages: Page[] = [
    { name: "Home", status: "", slug: "home", selected: false },
    { name: "About", status: "", slug: "about", selected: false },
    { name: "Services", status: "", slug: "service", selected: false },
    { name: "Blog", status: "", slug: "blog", selected: false },
    { name: "Contact Us", status: "", slug: "contact", selected: false },
  ];

  const dispatch = useDispatch();

  // Use reduxPages if it's not empty; otherwise, fallback to defaultPages
  const [pages, setPages] = useState<Page[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState("desktop");
  const [isLoading, setIsLoading] = useState(true);
  const [isContentGenerating, setIsContentGenerating] = useState(false);
  const [isPageGenerated, setIsPageGenerated] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>("Home");
  const [showGwLoader, setShowGwLoader] = useState(false);
  const [oldNewContent, setOldNewContent] = useState<Record<string, any>>({});
  const [generatedPagesList, setGeneratedPagesList] = useState<Page[]>([]);
  const [generatedPage, setGeneratedPage] = useState<any>({});
  const [pageContents, setPageContents] = useState<any>({});
  const [showPopup, setShowPopup] = useState(false);
  const [resetPopup, setresetPopup] = useState(false);
  const [previousClicked, setPreviousClicked] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [iframeSrc, setIframeSrc] = useState<string>("");
  const [currentContent, setCurrentContent] = useState<string>("");
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [showIframe, setShowIframe] = useState(true);
  const [Loaded, setLoaded] = useState(false);
  const [contentForBackend, setContentForBackend] = useState<any[]>([]);
  const [findIndex, setfindIndex] = useState<number>();
  const [importLoad, setImportLoad] = useState(false);
  const contactDetails = useSelector(
    (state: RootState) => state.userData.contactform
  );
  const currentUrl =
    useSelector(
      (state: RootState) => state.userData?.templateList?.pages[0]?.iframe_url
    ) || "";

  const businessName = useSelector(
    (state: RootState) => state.userData?.businessName
  );
  const Description = useSelector(
    (state: RootState) => state.userData.description1
  );
  const templateName: string = useSelector(
    (state: RootState) => state.userData.templatename
  );
  const fontFamily = useSelector((state: RootState) => state.userData.font);
  const Color = useSelector((state: RootState) => state.userData.color);
  const logoUrl = useSelector((state: RootState) => state.userData.logo);
  const templateList = useSelector(
    (state: RootState) => state.userData.templateList
  );
  const [loadedPages, setLoadedPages] = useState<{ [key: string]: boolean }>({
    Blog: false,
    Contact: false,
  });
  // const isFormDetailsLoaded = useSelector(
  //   (state: RootState) => state.userData.isFormDetailsLoaded
  // );

  const currentPages = useSelector((state: RootState) => state.userData.pages);

  // const [pages, setPages] = useState<Page[]>([
  //   { name: "Home", status: "", slug: "homepage", selected: false },
  //   { name: "About Us", status: "", slug: "about", selected: false },
  //   { name: "Services", status: "", slug: "service", selected: false },
  //   { name: "Blog", status: "", slug: "blog", selected: false },
  //   { name: "Contact", status: "", slug: "contact", selected: false },
  // ]);

  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { sendMessage, sendMessageToIframe } = useIframeMessage(iframeRef);
  const { getDomainFromEndpoint } = useDomainEndpoint();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleContinue = () => {
    setresetPopup(false);
  };
  const handleCustomize = async () => {
    deleteGeneratedPage();
  };
  const handleViewChange = (mode: string) => {
    setViewMode(mode);
    setIsOpen(false);
  };

  const changeLogo = (logoUrl: string) => {
    const message: ChangeLogoMessage = { type: "changeLogo", logoUrl };
    sendMessageToIframe(message);
  };

  const showWarningToast = () => {
    toast.warn("Please wait while content is being generated.");
  };

  const showSuccessToast = () => {
    toast.success("Content generation complete!");
    updatePageStatus(selectedPage!, "Generated", false);
  };

  // useEffect(() => {
  //   // const fetchGeneratedPageStatus = async () => {
  //   //   try {
  //   //     const endpoint = getDomainFromEndpoint(
  //   //       "/wp-json/custom/v1/get-generated-page-status"
  //   //     );
  //   //     if (!endpoint) {
  //   //       console.error("Endpoint is not available.");
  //   //       return;
  //   //     }

  //   //     const response = await axios.post(endpoint);
  //   //     if (response.status === 200) {
  //   //       const { data } = response;

  //   //       if (data && Array.isArray(data)) {
  //   //         const updatedPages = data.map((page) => ({
  //   //           name: page.page_name,
  //   //           slug: page.page_slug,
  //   //           status: page.page_status,
  //   //           selected: page.selected === "1",
  //   //         }));

  //   //         // Update pages state with status from the API
  //   //         setPages(updatedPages);

  //   //         // Automatically select the first non-generated/skipped page
  //   //         const nextPage = updatedPages.find(
  //   //           (page) => page.status !== "Generated" && page.status !== "Skipped"
  //   //         );
  //   //         if (nextPage) {
  //   //           setSelectedPage(nextPage.name);
  //   //         }
  //   //       }
  //   //     }
  //   //   } catch (error) {
  //   //     console.error("Error fetching generated page status:", error);
  //   //   }
  //   // };

  //   // Call the function to fetch status when the component loads for the first time
  //   fetchGeneratedPageStatus();
  // }, [getDomainFromEndpoint]);

  // Ensure the effect runs when fetchGeneratedPageStatus is updated

  // Fetch the list of already generated pages
  // const fetchGeneratedPages = useCallback(async () => {
  //   try {
  //     const endpoint = getDomainFromEndpoint(
  //       "/wp-json/custom/v1/get-html-data-details"
  //     );
  //     if (!endpoint) {
  //       console.error("Endpoint is not available.");
  //       return;
  //     }

  //     const response = await axios.post(endpoint);

  //     if (response.status === 200) {
  //       setGeneratedPagesList(response.data);
  //       response.data.forEach(
  //         (page: {
  //           page_name: string;
  //           template_name: string;
  //           version_name: string;
  //         }) => {
  //           fetchAndStorePageData(
  //             page.page_name,
  //             page.template_name,
  //             page.version_name
  //           );
  //         }
  //       );
  //     } else {
  //       console.error("Failed to fetch generated pages:", response);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching generated pages:", error);
  //   }
  // }, [getDomainFromEndpoint]);

  const storeHtmlContent = useCallback(
    async (pageName: string, htmlContent: string) => {
      try {
        const endpoint = getDomainFromEndpoint(
          "/wp-json/custom/v1/save-generated-html-data"
        );
        if (!endpoint) {
          console.error("Endpoint is not available.");
          return;
        }

        const response = await axios.post(endpoint, {
          version_name: "5.5",
          page_name: pageName,
          template_name: templateName,
          html_data: JSON.stringify(htmlContent),
        });

        // if (response.status === 200) {
        //   console.log("HTML content stored successfully:", response.data);
        // } else {
        //   console.error("Failed to store HTML content:", response);
        // }
      } catch (error) {
        // console.error("Error storing HTML content:", error);
      }
    },
    [getDomainFromEndpoint, templateName]
  );

  // Fetch and store HTML content for each page
  const fetchAndStorePageData = useCallback(
    async (pageName: string, templateName: string, versionName: string) => {
      try {
        const endpoint = getDomainFromEndpoint(
          "/wp-json/custom/v1/get-saved-html-data"
        );
        if (!endpoint) {
          console.error("Endpoint is not available.");
          return;
        }
        const currentPageIndex = pages.findIndex(
          (page) => page.name === selectedPage
        );
        const response = await axios.post(endpoint, {
          version_name: versionName,
          page_name: pageName,
          template_name: templateName,
        });

        if (
          response.status === 200 &&
          response.data &&
          response.data.length > 0
        ) {
          const rawHtmlContent = response.data[0].html_data;
          const cleanedHtmlContent = rawHtmlContent
            .replace(/^"(.*)"$/, "$1")
            .replace(/\\"/g, '"')
            .replace(/\\n/g, "")
            .replace(/\\t/g, "")
            .replace(/\\\\/g, "");

          // Store the parsed HTML content in the state
          setGeneratedPage((prevPages: any) => {
            const updatedPages = {
              ...prevPages,
              spinner: false,
              [pageName]: {
                0: cleanedHtmlContent, // Store the parsed HTML
              },
            };
            updatePageStatus(pageName, "Generated", true);

            // If the fetched page matches the selected page, update the iframe source
            if (selectedPage === pageName) {
              updateIframeSrc(cleanedHtmlContent);
              setShowIframe(false);
              setIsPageGenerated(true);
            }

            return updatedPages;
          });

          // Store the HTML content
          storeHtmlContent(pageName, cleanedHtmlContent);
        } else {
          console.error("Failed to store page data:", response);
          return false;
        }
      } catch (error) {
        console.error("Error storing page data:", error);
      }
    },
    [getDomainFromEndpoint, selectedPage, storeHtmlContent]
  );

  // useEffect(() => {
  //   fetchGeneratedPages();
  // }, [fetchGeneratedPages]);

  const storeOldNewContent = useCallback(
    async (
      pageName: string,
      jsonContent: Record<string, any>,
      wordCount: number
    ) => {
      try {
        const endpoint = getDomainFromEndpoint(
          "/wp-json/custom/v1/save-generated-data"
        );
        if (!endpoint) {
          console.error("Endpoint is not available.");
          return;
        }

        const response = await axios.post(endpoint, {
          version_name: "5.5",
          page_name: pageName, // Use the current pageName instead of selectedPage
          template_name: templateName,
          json_content:
            pageName == "Home" || pageName == "About" || pageName == "Service"
              ? jsonContent
              : "",
        });

        if (response.status === 200) {
          console.log(
            "Old and new content stored successfully:",
            response.data
          );
        } 
      } catch (error) {
        // console.error("Error storing old and new content:", error);
      }
    },
    [getDomainFromEndpoint, templateName]
  );

  const handleOldNewContent = useCallback(
    (pageName: string, content: Record<string, any>, wordCount: number) => {
      // Store old and new content for the selected page
      setOldNewContent((prevContent) => ({
        ...prevContent,
        [pageName]: content,
      }));

      // Store the old and new content in the backend
      storeOldNewContent(pageName, content, wordCount);
    },
    [storeOldNewContent]
  );

  const handlePageStatusUpdate = async (
    pageName: string,
    newStatus: string,
    isSelected: boolean
  ) => {
    try {
      const endpoint = getDomainFromEndpoint(
        "/wp-json/custom/v1/save-generated-page-status"
      );
      if (!endpoint) {
        console.error("Endpoint is not available.");
        return;
      }

      const updatedPages = pages.map((page) =>
        page.name === pageName
          ? { ...page, status: newStatus, selected: isSelected }
          : page
      );

      setPages(updatedPages);

      // Dispatch to update Redux
      dispatch(
        updateReduxPage({
          name: pageName,
          status: newStatus,
          selected: isSelected,
        })
      );

      // Save status to DB
      await axios.post(endpoint, {
        page_name: pageName,
        page_status: newStatus,
        selected: isSelected ? "1" : "0",
      });
    } catch (error) {
      console.error("Error updating page status:", error);
    }
  };

  const selectNextPage = (currentPage:any) => {
    const currentPageIndex = pages.findIndex(
      (page) => page.name === currentPage
    );
    let arrayVal = rearrangeArray(pages, currentPageIndex);

    if(arrayVal?.length > 0){
    const nextPage = arrayVal.find(
      (page) => page.status !== "Generated" && page.status !== "Skipped" && page.status !== "Added"
    );    
    if (nextPage) {
      setSelectedPage(nextPage.name);
    }
  }
  };

  // Example usage
  // handlePageStatusUpdate("Home", "Generated", true); // Correct usage

  const fetchGeneratedPageStatus = useCallback(async () => {
    try {
      const endpoint = getDomainFromEndpoint(
        "/wp-json/custom/v1/get-generated-page-status"
      );
      if (!endpoint) {
        console.error("Endpoint is not available.");
        return;
      }

      const response = await axios.post(endpoint);

      if (response.status === 200) {
        const { data } = response;
        if (data && Array.isArray(data)) {
          setPages((prevPages) => {
            // Merge existing pages with API response data
            const updatedPages = prevPages.map((page) => {
              const matchingPage = data.find(
                (apiPage: any) => apiPage.page_name === page.name
              );

              if (matchingPage) {
                // Dispatch the Redux action to update the status and selection in the store
                dispatch(
                  updateReduxPage({
                    name: page.name,
                    status: matchingPage.page_status,
                    selected: matchingPage.selected === "1",
                  })
                );

                return {
                  ...page,
                  status: matchingPage.page_status,
                  selected: matchingPage.selected === "1",
                };
              }

              return page; // If no match, return the original page
            });

            return updatedPages;
          });
        }
      } else {
        console.error("Failed to fetch generated page status:", response);
      }
    } catch (error) {
      console.error("Error fetching generated page status:", error);
    }
  }, [getDomainFromEndpoint, dispatch]); // Ensure dispatch is included in the dependencies

  useEffect(() => {
    // if (isFormDetailsLoaded) {
    fetchGeneratedPageStatus(); // Call the API only when form details are loaded
    // }
  }, []);

  // useEffect(() => {
  //   fetchGeneratedPageStatus(); // Fetch the status when the component mounts
  // }, [fetchGeneratedPageStatus]);

  const updateContactDetails = (email, phone, address) => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "updateContactDetails",
          email,
          phone,
          address,
        },
        "*"
      );
    }
  };

  // Example usage:
  // Replace these values with the actual email, phone, and address to be updated

  const onLoadMsg = async () => {
    const iframe = iframeRef.current;
    const currentPage = pages.find((page) => page.name === selectedPage);
    const currentPageIndex = pages.findIndex(
      (page) => page.name === selectedPage
    );

    updateContactDetails(
      contactDetails?.email,
      contactDetails?.phoneNumber,
      contactDetails?.address
    );
    setfindIndex(currentPageIndex);
    sendNonClickable();

    if (!iframe) return;

    if (
      selectedPage === "Blog" ||
      selectedPage === "Contact" ||
      selectedPage === "Contact Us"
    ) {
      setLoadedPages((prev) => ({
        ...prev,
        [selectedPage]: true,
      }));
    }

    setLoaded(true);

    if (fontFamily) {

      iframe.contentWindow.postMessage(
        { type: "changeFont", font: fontFamily },
        "*"
      );
    }


    if (Color.primary && Color.secondary) {
      iframe.contentWindow.postMessage(
        {
          type: "changeGlobalColors",
          primaryColor: Color.primary,
          secondaryColor: Color.secondary,
        },
        "*"
      );
    }

    if (logoUrl) {
      changeLogo(logoUrl);
    } else if (businessName) {
      sendIframeMessage("bussinessName", businessName);
    }

    if (selectedPage && generatedPage[selectedPage]) {
      const existingContent = generatedPage[selectedPage][0];
      updateIframeSrc(existingContent);
      setShowIframe(false);
    } else if (selectedPage && !generatedPage[selectedPage]) {
      const fetchresult = await fetchAndStorePageData(
        selectedPage,
        templateName,
        "5.5"
      );
      if (Color.primary && Color.secondary) {
        iframe.contentWindow.postMessage(
          {
            type: "changeGlobalColors",
            primaryColor: Color.primary,
            secondaryColor: Color.secondary,
          },
          "*"
        );
      }
      if (!fetchresult) {
        if (selectedPage === "Home" && pages[0].status !== "Generated") {
          iframe.contentWindow.postMessage(
            {
              type: "start",
              templateName: templateName,
              pageName: currentPage?.slug,
              bussinessname: businessName,
              description: Description,
            },
            "*"
          );
        }
        // if (
        //   selectedPage !== "Home" &&
        //   currentPage &&
        //   currentPage.status !== "Generated" &&
        //   currentPage.status !== "Skipped"
        // ) {
        //   setTimeout(() => {
        //     setShowPopup(true);
        //   }, 100);
        // } else if (fetchresult) {
        //   console.log("fetchresult is true");
        //   // updatePageStatus(selectedPage, "Generated");
        // }
      }
    } else {
      if (selectedPage && generatedPage[selectedPage] && isPageGenerated) {
        const existingContent = generatedPage[selectedPage][0];
        updateIframeSrc(existingContent);
        setShowIframe(false);
      } else if (selectedPage === "Home" && pages[0].status !== "Generated") {
        iframe.contentWindow.postMessage(
          {
            type: "start",
            templateName: templateName,
            pageName: currentPage?.slug,
            bussinessname: businessName,
            description: Description,
          },
          "*"
        );
      }

      // if (
      //   selectedPage !== "Home" &&
      //   currentPage &&
      //   currentPage.status !== "Generated" &&
      //   currentPage.status !== "Skipped"
      // ) {
      //   setTimeout(() => {
      //     setShowPopup(true);
      //   }, 100);
      // }
    }

    // Additional handling based on the page type and generation status
    // if (selectedPage && generatedPage[selectedPage] && isPageGenerated) {
    //   const existingContent = generatedPage[selectedPage][0];
    //   updateIframeSrc(existingContent);
    //   setShowIframe(false);
    // } else if (selectedPage === "Home" && pages[0].status !== "Generated") {
    //   iframe.contentWindow.postMessage(
    //     {
    //       type: "start",
    //       templateName: templateName,
    //       pageName: currentPage?.slug,
    //       bussinessname: businessName,
    //       description: Description,
    //     },
    //     "*"
    //   );
    // }

    if (!isContentGenerating) {
      setIsLoading(false);
    }
  };

  const updateIframeSrc = (content: string) => {
    // const selectedTemplatePage = templateList?.pages?.find(
    //   (page: any) => page.slug === pageSlug
    // );

    // if (selectedTemplatePage) {
    //   setIframeSrc(selectedTemplatePage.iframe_url);
    // }

    if (content !== currentContent) {
      setCurrentContent(content);
      const newBlob = new Blob([content], { type: "text/html" });
      const newBlobUrl = URL.createObjectURL(newBlob);

      setIframeSrc((prevSrc) => {
        if (prevSrc) {
          URL.revokeObjectURL(prevSrc);
        }
        return newBlobUrl;
      });
    }
  };

  const togglePage = (page: string) => {
    if (page === selectedPage) return; // Prevent reselecting the same page

    setSelectedPage(page);

    const existingContent = generatedPage[page];

    if (existingContent) {
      // If the content for the page is already generated
      updateIframeSrc(existingContent[0]); // Update the iframe source with the generated content
      setShowIframe(false);
      setIsPageGenerated(true);
    } else {
      // If the page content is not yet generated
      setShowIframe(true);
      setIsPageGenerated(false);
      setIsLoading(true);

      // Dynamically update the iframe source based on the page slug from template
      // const selectedTemplatePage = templateList?.pages?.find(
      //   (templatePage) => templatePage.slug === page
      // );

      // if (selectedTemplatePage) {
      //   setIframeSrc(selectedTemplatePage.iframe_url); // Use iframe URL from the selected template page
      // }
    }
  };

  const handlePageNavigation = (
    action: "next" | "skip" | "add",
    currentPage: any
  ) => {
    if (isContentGenerating) {
      showWarningToast();
      return;
    }

    const currentPageIndex = pages.findIndex(
      (page) => page.name === currentPage
    );
    if (currentPageIndex !== -1) {
      const updatedPages = [...pages];
      if (
        action === "next" &&
        currentPage !== "Contact Us" &&
        currentPage !== "Blog"
      ) {
        updatedPages[currentPageIndex].status = "Generated";
        updatedPages[currentPageIndex].selected = true;

        dispatch(
          updateReduxPage({
            name: updatedPages[currentPageIndex].name, // Page name
            status: "Generated", // Mark as generated
            selected: true, // Set as selected
          })
        );
      } else if (action === "skip") {
        updatedPages[currentPageIndex].status = "Skipped";
        updatedPages[currentPageIndex].selected = false;
      } else if (
        action === "add" ||
        currentPage !== "Contact Us" ||
        currentPage !== "Blog"
      ) {
        if (currentPages[currentPageIndex].status == "") {
          updatedPages[currentPageIndex].status = "Added";
          updatedPages[currentPageIndex].selected = true;
          dispatch(
            updateReduxPage({
              name: updatedPages[currentPageIndex].name, // Page name
              status: "Added", // Mark as Added
              selected: true, // Set as selected
            })
          );
        } else if (
          currentPages[currentPageIndex].status == "Added" &&
          currentPage !== "Contact Us" &&
          currentPage !== "Blog"
        ) {
          updatedPages[currentPageIndex].status = "";
          updatedPages[currentPageIndex].selected = false;
          dispatch(
            updateReduxPage({
              name: updatedPages[currentPageIndex].name, // Page name
              status: "", // Mark as Added
              selected: false, // Set as not selected
            })
          );
        }
      }
      setPages(updatedPages);

      const nextPageIndex = currentPageIndex + 1;
      if (
        nextPageIndex < updatedPages.length &&
        currentPage != updatedPages[currentPageIndex]?.name
      ) {
        setSelectedPage(updatedPages[nextPageIndex].name);

        const nextPageContent = generatedPage[updatedPages[nextPageIndex].name];
        if (nextPageContent) {
          updateIframeSrc(nextPageContent[0]);
          setShowIframe(false);
        } else {
          setShowIframe(true);
          setIsPageGenerated(false);
          setIsLoading(true);
          const iframe: null | HTMLIFrameElement = iframeRef.current;
          const nextPageSlug = updatedPages[nextPageIndex].slug;
          if (iframe) {
            iframe.src = `${iframeSrc}/${nextPageSlug}`;
          }
        }

        if (currentPageIndex === 0) {
          setPreviousClicked(true);
        }
      }
    }
  };

  const updatePageStatus = (
    pageName: string,
    status: string,
    selected: boolean
  ) => {
    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.name === pageName) {
          // Debugging log to check if the condition matches
          // console.log(
          //   `Updating ${pageName}: status=${status}, selected=${selected}`
          // );
          return { ...page, status, selected };
        }
        return page;
      })
    );
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const sendNonClickable = () => {
    const iframe = document.getElementById("myIframe") as HTMLIFrameElement;
    iframe.contentWindow?.postMessage(
      {
        type: "nonClickable",
        transdiv: `<div id="overlay" style="position:fixed;width: 100vw;height: 100vh;z-index: 1000000;top: 0;left: 0;"></div>`,
      },
      "*"
    );
  };
  const handleGeneratePage = async () => {
    if (isContentGenerating) {
      // showWarningToast();
      return;
    }
    setShowPopup(false);
    setIsLoading(true);
    setShowGwLoader(true);
    setIsContentGenerating(true);

    // try {
    //   const endpoint = getDomainFromEndpoint(
    //     "/wp-json/custom/v1/get-generated-page-status"
    //   );
    //   if (!endpoint) {
    //     console.error("Endpoint is not available.");
    //     return;
    //   }

    //   const response = await axios.get(endpoint);
    //   const {data} = response?.status;

    //   if(data)
    //   {
    //     const iframe = iframeRef.current;
    //     const currentPage = pages.find((page) => page.name === selectedPage);
    //     if (currentPage && currentPage.status !== "Generated") {
    //       iframe.contentWindow.postMessage(
    //         {
    //           type: "start",
    //           templateName: templateName,
    //           pageName: currentPage?.slug,
    //           bussinessname: businessName,
    //           description: Description,
    //         },
    //         "*"
    //       );
    //     }
    //   }

    // } catch (error) {
    //   console.error("error on");
    // }

    const iframe = iframeRef.current;
    const currentPage = pages.find((page) => page.name === selectedPage);
    if (currentPage && currentPage.status !== "Generated") {
      iframe.contentWindow.postMessage(
        {
          type: "start",
          templateName: templateName,
          pageName: currentPage?.slug,
          bussinessname: businessName,
          description: Description,
        },
        "*"
      );
    }
  };

  const handlePrevious = () => {
    if (!previousClicked && !isContentGenerating) {
      navigate("/custom-design");
      return;
    } else if (!previousClicked) {
      showWarningToast();
    }

    const currentPageIndex = pages.findIndex(
      (page) => page.name === selectedPage
    );
    if (currentPageIndex > 0) {
      const prevPageIndex = currentPageIndex - 1;
      setSelectedPage(pages[prevPageIndex].name);

      const iframe = iframeRef.current;
      const prevPageSlug = pages[prevPageIndex].slug;
      if (iframe) {
        iframe.src = `${currentUrl}${prevPageSlug}`;
      }
      setShowIframe(true);
      setIsLoading(true);
      setIsPageGenerated(false);
    }
  };
  const rearrangeArray = (array, startIndex) => {
    if (startIndex < 0 || startIndex >= array.length) {
        throw new Error("Index out of bounds");
    }

    // Rearrange the array
    const part1 = array.slice(startIndex); // From startIndex to the end
    const part2 = array.slice(0, startIndex); // From the beginning to startIndex
    return part1.concat(part2); // Combine the two parts
}


  const handleNext = (page: string) => {
    handlePageNavigation("next", page);
    selectNextPage(page);
  };

  const handleSkipPage = (page: string) => {
    handlePageNavigation("skip", page);
  };

  const handleAddPage = (page: string) => {
    handlePageNavigation("add", page);
  };

  // Effect to handle iframe resizing based on view mode
  useEffect(() => {
    if (iframeRef.current) {
      if (viewMode === "desktop") {
        iframeRef.current.style.width = "100%";
        iframeRef.current.style.height = "100%";
      } else if (viewMode === "tablet") {
        iframeRef.current.style.width = "768px";
        iframeRef.current.style.height = "100%";
      } else if (viewMode === "mobile") {
        iframeRef.current.style.width = "375px";
        iframeRef.current.style.height = "100%";
      }
    }
  }, [viewMode]);

  useEffect(() => {
    const receiveMessage = (event: MessageEvent) => {
      if (event.data.type === "contentLoaded") {
        setIsLoading(false);
      } else if (event.data.type === "saveContentResponse") {
        setPageContents((prevContents) => ({
          ...prevContents,
          [selectedPage!]: event.data.content,
        }));
      } else if (event.data.type === "generationStatus") {
        setIsContentGenerating(event.data.isGenerating);
        setIsLoading(event.data.isGenerating);
        if (event.data.isGenerating) {
          setShowGwLoader(false);
        }
      } else if (event.data.type === "generatedContent") {
        const pageName = event.data.pageName || selectedPage || "";
        const htmlContent = event.data.content;

        setGeneratedPage((prevPages: any) => {
          const updatedPages = {
            ...prevPages,
            spinner: false,
            [pageName]: {
              0: htmlContent,
            },
          };
          return updatedPages;
        });

        // Store the HTML content
        storeHtmlContent(pageName, htmlContent);

        if (!event.data.isGenerating) {
          showSuccessToast();
        }
      } else if (event.data.type === "oldNewContent") {
        const pageName = event.data.pageName || selectedPage || "";
        const wordCount = calculateWordCount(event.data.content);
        handleOldNewContent(pageName, event.data.content, wordCount);
      }
    };
    function calculateWordCount(contentObject: object) {
      let totalWordCount = 0;

      Object.values(contentObject).forEach((value) => {
        const wordCount = value.split(/\s+/).filter((word) => word).length;
        totalWordCount += wordCount;
      });

      return totalWordCount;
    }
    window.addEventListener("message", receiveMessage);
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [Color, fontFamily, selectedPage, storeHtmlContent, handleOldNewContent]);

  const handleImportSelectedPage = async () => {
    setImportLoad(true);
    // try {
    //   const endpoint = getDomainFromEndpoint(
    //     "/wp-json/custom/v1/get-generated-page-status"
    //   );
    //   if (!endpoint) {
    //     console.error("Endpoint is not available.");
    //     return;
    //   }

    //   const response = await axios.post(endpoint);

    //   if (response.status === 200) {
    //     setImportLoad(false);
    //     navigate("/processing", { state: { pageName: selectedPage } });
    //   }
    // } catch (error) {
    //   console.error("error while calling the import tempalte avaiablity api");
    //   setImportLoad(false);
    // }

    navigate("/processing", { state: { pageName: selectedPage } });
  };

  const handlePageUpdate = (
    slug: string,
    newStatus: string,
    isSelected: boolean
  ) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.slug === slug
          ? { ...page, status: newStatus, selected: isSelected }
          : page
      )
    );
  };

  const savePageEndPoint = getDomainFromEndpoint(
    "/wp-json/custom/v1/save-generated-page-status"
  );
  const deletePageEndPoint = getDomainFromEndpoint(
    "/wp-json/custom/v1/remove-all-generated-data"
  );
  const deleteStyleEndPoint = getDomainFromEndpoint(
    "/wp-json/custom/v1/delete-all-styles"
  );
  useEffect(() => {
    const storePagesInDB = async () => {
      if (savePageEndPoint) {
        try {
          await savePagesToDB(savePageEndPoint, pages, findIndex); // Pass the endpoint and pages to savePagesToDB
        } catch (error) {
          console.error("Failed to store pages:", error);
        }
      }
    };

    storePagesInDB();
  }, [savePageEndPoint, pages]);

  useEffect(() => {
    if (validReduxPages.length > 0) {
      setPages(validReduxPages); // Always take validReduxPages when available
    }
  }, [validReduxPages]);

  const deleteGeneratedPage = async () => {
    setButtonLoader(true);

    dispatch(setColor({ primary: "", secondary: "" }));
    dispatch(setFont({ primary: "", secondary: "" }));
    if (deleteStyleEndPoint) {
      try {
        await deleteStyle(deleteStyleEndPoint); // delete style
        if (deletePageEndPoint) {
          try {
            const response = await deletePage(deletePageEndPoint); // delete generated file
            if (response) {
              setButtonLoader(false);
              navigate("/custom-design");
              setresetPopup(false);
            }
          } catch (error) {
            console.error("Failed to delete pages:", error);
          }
        }
      } catch (error) {
        console.error("Failed to delete pages:", error);
      }
    }
  };

  return (
    <div className="h-screen flex font-[inter] w-screen">
      <div className="w-[23%] lg:w-[30%]">
        <aside className="z-10 fixed">
          <div className="bg-white min-h-screen w-[23vw] lg:w-[30vw] z-10 border-r border-[#DFEAF6]">
            <div className="flex items-center justify-between py-4 border-b cursor-pointer pr-7 ps-3 sidebar-header border-[#DFEAF6]">
              <img
                src={GravityWriteLogo}
                alt="gravity write logo"
                className="h-10 p-2 rounded-md cursor-pointer hover:bg-palatinate-blue-50"
              />
              <div className="relative border-gray-100 group flex items-center justify-between py-4 border-b cursor-pointer pr-7 ps-3 sidebar-header">
                <img
                  src={MenuIcon}
                  alt="menu"
                  className="w-5 h-auto group hidden"
                />
              </div>
            </div>
            <div className="px-5 py-4 w-full flex flex-col justify-center">
              <div className="flex items-center justify-between pb-2.5">
                <h1 className="text-xl font-semibold">Website Preview</h1>
                {/* <Link to={"/custom-design"}> */}
                <button
                  className="bg-button-bg-secondary hover:bg-palatinate-blue-600 hover:text-white px-4 font-medium py-2 rounded-md text-sm cursor-pointer"
                  onClick={() => {
                    setresetPopup(true);
                  }}
                >
                  Back
                </button>
                {/* </Link> */}
              </div>
              <span className="text-base text-[#88898A] font-normal">
                Preview your website’s potential with our interactive
                demonstration.
              </span>
            </div>
            <PageSelector
              pages={pages}
              selectedPage={selectedPage}
              isContentGenerating={isContentGenerating}
              togglePage={togglePage}
              handleNext={handleNext}
              handleSkipPage={handleSkipPage}
              handleAddPage={handleAddPage}
              setShowPopup={setShowPopup}
              previousClicked={previousClicked}
              handlePrevious={handlePrevious}
              lateloader={setLoaded}
              handleImportSelectedPage={handleImportSelectedPage}
              updatePageStatus={updatePageStatus}
              handlePageUpdate={handlePageUpdate}
              setPages={setPages}
              handleGeneratePage={handleGeneratePage}
              isLoading={isLoading}
              importLoad={importLoad}
            />
          </div>
        </aside>
      </div>
      <div className="w-[77%] flex-last bg-[#F9FCFF] overflow-x-hidden relative">
        <main className="px-12">
          {showPopup &&
            selectedPage !== "Blog" &&
            pages.find((p) => p.name === selectedPage)?.status !==
              "Generated" &&
            Loaded &&
            selectedPage !== "Contact" && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg text-center absolute">
                  <div className="absolute right-0">
                    <CloseIcon
                      className="top-0 m-2 cursor-pointer"
                      onClick={handleClosePopup}
                    />
                  </div>
                  <div className="py-8 px-12">
                    <img
                      src={popupimg}
                      alt="Generate Page"
                      className="mb-2 mx-auto"
                    />
                    <button
                      className="tertiary px-[30px] py-[10px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-md"
                      onClick={handleGeneratePage}
                    >
                      Generate this Page
                    </button>
                  </div>
                </div>
              </div>
            )}

          {showUpgradePopup && (
            <UpgradePopup
              onClose={() => setShowUpgradePopup(false)}
              alertType="regenerate"
            />
          )}
          <div className="relative  text-left my-4 flex justify-between">
            <ViewModeSwitcher
              isOpen={isOpen}
              viewMode={viewMode}
              toggleDropdown={toggleDropdown}
              handleViewChange={handleViewChange}
            />
          </div>

          <div className="w-full h-screen flex justify-center items-center relative">
            {/* Show GwLoader only when showGwLoader is true */}
            {showGwLoader && (
              <div className="absolute inset-0 bg-white flex justify-center items-center z-20">
                <GwLoader />
              </div>
            )}

            {/* Skeleton Loader Layer */}
            {isLoading &&
              !isContentGenerating &&
              !loadedPages[selectedPage!] && <PlumberPageSkeleton />}

            {/* Generated Content Iframe */}
            {generatedPage[selectedPage!] && isPageGenerated && (
              <iframe
                ref={iframeRef}
                src={iframeSrc}
                title="website"
                id="myIframe"
                onLoad={onLoadMsg}
                className={`h-full w-full transition-fade shadow-lg rounded-lg z-10 absolute top-0  ${
                  isLoading && !isContentGenerating
                    ? "opacity-0"
                    : "opacity-100"
                }`}
              />
            )}

            {/* Non-Generated Content Iframe */}
            {(!generatedPage[selectedPage!] || !isPageGenerated) && (
              <iframe
                ref={iframeRef}
                src={`${currentUrl}/${
                  pages.find((page) => page.name === selectedPage)?.slug
                }`}
                title="website"
                id="myIframe"
                onLoad={onLoadMsg}
                className={`h-full w-full transition-fade shadow-lg rounded-lg z-10 absolute top-0 ${
                  isLoading && !isContentGenerating
                    ? "opacity-0"
                    : "opacity-100"
                }`}
              />
            )}
          </div>
        </main>
      </div>
      <ToastContainer />
      {resetPopup && (
        <CustomizePopup
          onClose={() => setresetPopup(false)}
          alertType="websiteCreation"
          onContinue={handleContinue}
          buttonLoader={buttonLoader}
          onCreateFromScratch={handleCustomize}
        />
      )}
    </div>
  );
};

export default FinalPreview;
