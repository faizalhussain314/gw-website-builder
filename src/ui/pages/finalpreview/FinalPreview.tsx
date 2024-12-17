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
import ApiErrorPopup from "../../component/dialogs/ApiErrorPopup.tsx";
import WordLimit from "../../component/dialogs/WordLimit.tsx";
import { updateIframeLogo } from "../../../core/utils/changeIframeLogo.ts";

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
  const [pages, setPages] = useState<Page[]>([
    { name: "Home", status: "", slug: "home", selected: false },
    { name: "About", status: "", slug: "about", selected: false },
    { name: "Service", status: "", slug: "service", selected: false },
    { name: "Blog", status: "", slug: "blog", selected: false },
    { name: "Contact Us", status: "", slug: "contact-us", selected: false },
  ]);
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
  const [apiIssue, setapiIssue] = useState(false);
  const [wordCountAlert, setwordCountAlert] = useState(false);
  const [afterContact, setAfterContact] = useState(false);
  const [showRefreshWarning, setShowRefreshWarning] = useState(false);
  const [showImportWarning, setshowImportWarning] = useState(false);
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
  const logoWidth = useSelector((state: RootState) => state.userData.logoWidth);
  const templateList = useSelector(
    (state: RootState) => state.userData.templateList
  );
  const bearer_token = useSelector((state: RootState) => state.user.wp_token);
  const [loadedPages, setLoadedPages] = useState<{ [key: string]: boolean }>({
    Blog: false,
    Contact: false,
  });
  // const isFormDetailsLoaded = useSelector(
  //   (state: RootState) => state.userData.isFormDetailsLoaded
  // );

  const currentPages = useSelector((state: RootState) => state.userData.pages);

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

  useEffect(() => {
    const fetchGeneratedPageStatus = async () => {
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
            const updatedPages = data.map((page) => ({
              name: page.page_name,
              slug: page.page_slug,
              status: page.page_status,
              selected: page.selected === "1",
            }));

            // Update pages state with status from the API
            setPages(updatedPages);

            // Automatically select the first non-generated/skipped page
            const nextPage = updatedPages.find(
              (page) => page.status !== "Generated" && page.status !== "Skipped"
            );
            if (nextPage) {
              setSelectedPage(nextPage.name);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching generated page status:", error);
      }
    };

    // Call the function to fetch status when the component loads for the first time
    fetchGeneratedPageStatus();
  }, [getDomainFromEndpoint]);

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

        console.log("outside the response", response.data.data[0].html_data);

        if (response.status === 200 && response.data) {
          console.log("condition was true");
          const rawHtmlContent = response.data.data[0].html_data;
          const cleanedHtmlContent = rawHtmlContent
            .replace(/^"(.*)"$/, "$1")
            .replace(/\\"/g, '"')
            .replace(/\\n/g, "")
            .replace(/\\t/g, "")
            .replace(/\\\\/g, "");
          console.log("condition was true", response);
          setGeneratedPage((prevPages: any) => {
            const updatedPages = {
              ...prevPages,
              spinner: false,
              [pageName]: {
                0: cleanedHtmlContent,
              },
            };
            updatePageStatus(pageName, "Generated", true);
            if (GwLoader) {
              setShowGwLoader(false);
            }

            if (selectedPage === pageName) {
              updateIframeSrc(cleanedHtmlContent);
              setShowIframe(false);
              setShowGwLoader(false);
              setIsPageGenerated(true);
            }

            return updatedPages;
          });

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
        const updateCountEndpoint = getDomainFromEndpoint(
          "/wp-json/custom/v1/update-count"
        );
        if (!updateCountEndpoint) {
          console.error("Update count endpoint is not available.");
          return;
        }

        const updateResponse = await axios.post(updateCountEndpoint, {
          words: wordCount,
          page_title: pageName,
          template_id: templateList.id,
          sitecount: 0,
          is_type: "words",
        });

        if (updateResponse.status !== 200) {
          console.error("Failed to update word count:", updateResponse.data);
          return;
        }

        const saveContentEndpoint = getDomainFromEndpoint(
          "/wp-json/custom/v1/save-generated-data"
        );
        if (!saveContentEndpoint) {
          console.error("Save content endpoint is not available.");
          return;
        }

        const saveResponse = await axios.post(saveContentEndpoint, {
          version_name: "5.5",
          page_name: pageName,
          template_name: templateName,
          json_content:
            pageName === "Home" ||
            pageName === "About" ||
            pageName === "Service"
              ? jsonContent
              : "",
        });

        if (saveResponse.status === 200) {
          // console.log(
          //   "Old and new content stored successfully:",
          //   saveResponse.data
          // );
        } else {
          console.error(
            "Failed to store old and new content:",
            saveResponse.data
          );
        }
      } catch (error) {
        console.error("Error in storeOldNewContent function:", error);
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

      if (!pageName) {
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

  const selectNextPage = (currentPage: any) => {
    const currentPageIndex = pages.findIndex(
      (page) => page.name === currentPage
    );
    let arrayVal = rearrangeArray(pages, currentPageIndex);

    if (arrayVal?.length > 0) {
      const nextPage = arrayVal.find(
        (page) =>
          page.status !== "Generated" &&
          page.status !== "Skipped" &&
          page.status !== "Added"
      );
      if (nextPage) {
        setSelectedPage(nextPage.name);
      }
    }
    if (currentPageIndex === 4) {
      setAfterContact(true);
      return;
    } else if (arrayVal?.length > 0) {
      setAfterContact(false);
      const nextPage = arrayVal.find(
        (page) =>
          page.status !== "Generated" &&
          page.status !== "Skipped" &&
          page.status !== "Added"
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
        const { data } = response.data;
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

  // useEffect(() => {
  //   // if (isFormDetailsLoaded) {
  //   fetchGeneratedPageStatus(); // Call the API only when form details are loaded
  //   // }
  // }, []);

  // useEffect(() => {
  //   fetchGeneratedPageStatus(); // Fetch the status when the component mounts
  // }, [fetchGeneratedPageStatus]);

  const updateContactDetails = (email, phone, address) => {
    if (iframeRef.current) {
      if (!email || !phone || !address) {
        return;
      }
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
    setwordCountAlert(false);
    setLoaded(true);
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
      updateIframeLogo(logoUrl, logoWidth);
    } else if (businessName) {
      sendIframeMessage("bussinessName", businessName);
    }
    // console.log("selected page", generatedPage[selectedPage]);
    if (selectedPage && generatedPage[selectedPage]) {
      const existingContent = generatedPage[selectedPage][0];
      updateIframeSrc(existingContent);
      setShowIframe(false);
    } else if (selectedPage && !generatedPage[selectedPage]) {
      setwordCountAlert(false);
      const fetchResult = await fetchAndStorePageData(
        selectedPage,
        templateName,
        "5.5"
      );

      console.log("fetch result", fetchResult);

      if (fetchResult) {
        console.log("fetch result is true");
        setShowGwLoader(false);
        setwordCountAlert(false);
        return;
      }

      if (!fetchResult) {
        console.log("result is empty or null");
        if (selectedPage === "Home" && pages[0].status !== "Generated") {
          setShowPopup(false);
          setIsLoading(true);
          setShowGwLoader(true);
          try {
            const endpoint = getDomainFromEndpoint(
              "wp-json/custom/v1/check-word-count"
            );
            if (!endpoint) {
              console.error("Endpoint is not available.");
              setIsLoading(false);
              setShowGwLoader(false);
              setIsContentGenerating(false);
              return;
            }

            const response = await axios.get(endpoint);

            // if (generatedPage[selectedPage] && response?.data.status) {
            //   return;
            // }

            if (response?.data?.status === true) {
              const iframe = iframeRef.current;
              const currentPage = pages.find(
                (page) => page.name === selectedPage
              );

              if (currentPage && currentPage.status !== "Generated") {
                setShowGwLoader(true);
                iframe.contentWindow.postMessage(
                  {
                    type: "start",
                    templateName: templateName,
                    pageName: currentPage?.slug,
                    bussinessname: businessName,
                    description: Description,
                    template_id: templateList?.id,
                    bearer_token: bearer_token,
                  },
                  "*"
                );
              }
            } else if (response?.data?.status === false) {
              setIsContentGenerating(false);
              setwordCountAlert(true);
              setShowGwLoader(false);
              setIsLoading(false);
            }
          } catch (error) {
            console.error("Error while calling the word count API:", error);
            setapiIssue(true);
          } finally {
            setIsLoading(false);
            setShowGwLoader(false);
          }
        }
      }
    } else {
      if (selectedPage && generatedPage[selectedPage] && isPageGenerated) {
        const existingContent = generatedPage[selectedPage][0];
        updateIframeSrc(existingContent);
        setShowIframe(false);
        setShowGwLoader(false);
      } else if (selectedPage === "Home" && pages[0].status !== "Generated") {
        iframe.contentWindow.postMessage(
          {
            type: "start",
            templateName: templateName,
            pageName: currentPage?.slug,
            bussinessname: businessName,
            description: Description,
            template_id: templateList?.id,
          },
          "*"
        );
        // setShowGwLoader(true);
      }
    }

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
    if (page === selectedPage) return;
    setAfterContact(false);

    setSelectedPage(page);
    setwordCountAlert(false);
    const existingContent = generatedPage[page];

    if (existingContent) {
      updateIframeSrc(existingContent[0]);
      setShowIframe(false);
      setIsPageGenerated(true);
      setShowGwLoader(false);
    } else {
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
    if (action == "next" && currentPage == "Contact Us") {
      setAfterContact(true);
    } else {
      setAfterContact(false);
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
      } else if (
        action === "next" &&
        (currentPage == "Contact Us" || currentPage == "Blog")
      ) {
        updatedPages[currentPageIndex].status = "Added";
        updatedPages[currentPageIndex].selected = true;

        dispatch(
          updateReduxPage({
            name: updatedPages[currentPageIndex].name, // Page name
            status: "Added", // Mark as generated
            selected: true,
          })
        );
      } else if (action === "skip") {
        updatedPages[currentPageIndex].status = "Skipped";
        updatedPages[currentPageIndex].selected = false;
        dispatch(
          updateReduxPage({
            name: updatedPages[currentPageIndex].name,
            status: "Skipped",
            selected: false,
          })
        );
      } else if (
        action === "add" ||
        currentPage == "Contact Us" ||
        currentPage == "Blog"
      ) {
        if (
          updatedPages[currentPageIndex].status == "Generated" &&
          updatedPages[currentPageIndex].name != "Home"
        ) {
          updatedPages[currentPageIndex].status = "Not Selected";
          updatedPages[currentPageIndex].selected = false;

          dispatch(
            updateReduxPage({
              name: updatedPages[currentPageIndex].name, // Page name
              status: "Generated", // Mark as generated
              selected: true, // Set as selected
            })
          );
        } else if (updatedPages[currentPageIndex].status == "Not Selected") {
          updatedPages[currentPageIndex].status = "Generated";
          updatedPages[currentPageIndex].selected = true;
          dispatch(
            updateReduxPage({
              name: updatedPages[currentPageIndex].name, // Page name
              status: "Generated", // Mark as Added
              selected: true, // Set as not selected
            })
          );
        } else if (
          currentPages[currentPageIndex].status == "" ||
          currentPages[currentPageIndex].status == "Skipped"
        ) {
          updatedPages[currentPageIndex].status = "Added";
          updatedPages[currentPageIndex].selected = true;
          dispatch(
            updateReduxPage({
              name: updatedPages[currentPageIndex].name, // Page name
              status: "Added", // Mark as Added
              selected: true, // Set as selected
            })
          );
        } else if (currentPages[currentPageIndex].status == "Added") {
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
      } else {
        console.log(
          "if condition not worked",
          nextPageIndex < updatedPages.length &&
            currentPage != updatedPages[currentPageIndex]?.name
        );
        setSelectedPage(updatedPages[nextPageIndex].name);

        const nextPageContent = generatedPage[updatedPages[nextPageIndex].name];
        setShowIframe(true);
        setIsPageGenerated(false);
        setIsLoading(true);
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
        // const iframe: null | HTMLIFrameElement = iframeRef.current;
        // const nextPageSlug = updatedPages[nextPageIndex].slug;
        // if (iframe) {
        //   iframe.src = `${iframeSrc}/${nextPageSlug}`;
        // }
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
    // if (isContentGenerating) {
    //   showWarningToast();
    //   return;
    // }

    setShowPopup(false);
    setIsLoading(true);
    setShowGwLoader(true);
    // setIsContentGenerating(true);

    try {
      const endpoint = getDomainFromEndpoint(
        "wp-json/custom/v1/check-word-count"
      );
      if (!endpoint) {
        console.error("Endpoint is not available.");
        setIsLoading(false);
        setShowGwLoader(false);
        setIsContentGenerating(false);
        setapiIssue(true);
        return;
      }

      const response = await axios.get(endpoint);

      if (response?.data?.status === true) {
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
              template_id: templateList?.id,
              bearer_token: bearer_token,
            },
            "*"
          );
        }
      } else {
        setShowGwLoader(false);
        setIsContentGenerating(false);
        setIsLoading(false);
        if (selectedPage === generatedPage[selectedPage]) {
          console.log("page was true");
          setwordCountAlert(false);
          setIsContentGenerating(false);
          setIsLoading(false);
        }
        setwordCountAlert(true);
      }
    } catch (error) {
      console.error("Error while calling the word count API:", error);
      setapiIssue(true);
    } finally {
      setIsLoading(false);
      // setShowGwLoader(true);
      setIsContentGenerating(false);
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

    const part1 = array.slice(startIndex);
    const part2 = array.slice(0, startIndex);
    return part1.concat(part2);
  };

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
        // const PageList = [...pages];
        const currentPageIndex = pages.findIndex(
          (page) => page?.name === selectedPage
        );
        console.log(
          "pages[findIndex].name",
          pages[currentPageIndex]?.name,
          currentPageIndex
        );
        dispatch(
          updateReduxPage({
            name: pages[currentPageIndex].name,
            status: "Generated",
            selected: true,
          })
        );
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

    try {
      const endpoint = getDomainFromEndpoint(
        "/wp-json/custom/v1/check-site-count"
      );
      if (!endpoint) {
        console.error("Endpoint is not available.");
        setImportLoad(false);
        return;
      }

      const response = await axios.get(endpoint);

      if (response?.data?.status === true) {
        setImportLoad(false);
        navigate("/processing", { state: { pageName: selectedPage } });
      } else {
        setImportLoad(false);
        setshowImportWarning(true);
      }
    } catch (error) {
      console.error(
        "Error while calling the import template availability API:",
        error
      );
      setImportLoad(false);
      setapiIssue(true);
    }
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
  }, [savePageEndPoint, pages, findIndex]);

  useEffect(() => {
    if (validReduxPages.length > 0) {
      setPages(validReduxPages); // Always take validReduxPages when available
      if (
        validReduxPages?.every((page) => {
          return page?.status == "";
        })
      ) {
        fetchGeneratedPageStatus();
      }
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

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isContentGenerating || showGwLoader) {
        event.preventDefault();
        event.returnValue = ""; // Most browsers ignore custom messages but require this to trigger the alert.
        setShowRefreshWarning(true); // Show custom warning popup
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isContentGenerating, showGwLoader]);

  return (
    <div className="h-screen flex font-[inter] w-screen">
      <div className="w-[23%] lg:w-[30%]">
        <aside className="fixed z-10">
          <div className="bg-white min-h-screen w-[23vw] lg:w-[30vw] z-10 border-r border-[#DFEAF6]">
            <div className="flex items-center justify-between py-4 border-b cursor-pointer pr-7 ps-3 sidebar-header border-[#DFEAF6]">
              <img
                src={GravityWriteLogo}
                alt="gravity write logo"
                className="h-10 p-2 rounded-md"
              />
              <div className="relative flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer group pr-7 ps-3 sidebar-header">
                <img
                  src={MenuIcon}
                  alt="menu"
                  className="hidden w-5 h-auto group"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center w-full px-5 py-4">
              <div className="flex items-center justify-between pb-2.5">
                <h1 className="text-xl font-semibold">Website Preview</h1>
                {/* <Link to={"/custom-design"}> */}
                <button
                  className="px-4 py-2 text-sm font-medium rounded-md cursor-pointer bg-button-bg-secondary hover:bg-palatinate-blue-600 hover:text-white"
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
              afterContact={afterContact}
              showGwLoader={showGwLoader}
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
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="absolute text-center bg-white rounded-lg shadow-lg">
                  <div className="absolute right-0">
                    <CloseIcon
                      className="top-0 m-2 cursor-pointer"
                      onClick={handleClosePopup}
                    />
                  </div>
                  <div className="px-12 py-8">
                    <img
                      src={popupimg}
                      alt="Generate Page"
                      className="mx-auto mb-2"
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

          {showImportWarning && (
            <UpgradePopup
              onClose={() => setshowImportWarning(false)}
              alertType="importLimit"
            />
          )}
          {showUpgradePopup && (
            <UpgradePopup
              onClose={() => setShowUpgradePopup(false)}
              alertType="regenerate"
            />
          )}
          <div className="relative flex justify-between my-4 text-left">
            <ViewModeSwitcher
              isOpen={isOpen}
              viewMode={viewMode}
              toggleDropdown={toggleDropdown}
              handleViewChange={handleViewChange}
            />
          </div>

          <div className="relative flex items-center justify-center w-full h-screen">
            {/* Show GwLoader only when showGwLoader is true */}
            {showGwLoader && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
                <GwLoader />
              </div>
            )}

            {apiIssue && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
                <ApiErrorPopup alertType="contentError" />
              </div>
            )}

            {/* Skeleton Loader Layer */}
            {isLoading &&
              !isContentGenerating &&
              !loadedPages[selectedPage!] && <PlumberPageSkeleton />}

            {wordCountAlert && <WordLimit />}

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
