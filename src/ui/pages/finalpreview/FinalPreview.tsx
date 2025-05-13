import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import MenuIcon from "../../../assets/menu.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpgradePopup from "../../component/dialogs/UpgradePopup";
import { useNavigate } from "react-router-dom";
import ViewModeSwitcher from "../../component/finalpreview/ViewModeSwitcher";
import PageSelector from "../../component/finalpreview/PageSelector";
import CloseIcon from "@mui/icons-material/Close";
import { Page } from "../../../types/page.type";
import PlumberPageSkeleton from "../../component/PlumberPageSkeleton ";
import GwLoader from "../../component/loader/gwLoader";
import useDomainEndpoint from "../../../hooks/useDomainEndpoint";
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
import ImportWarning from "../../component/dialogs/importWarning.tsx";
import PlanExpired from "../../component/dialogs/PlanExpired.tsx";
import { usePostHog } from "posthog-js/react";
import {
  ApiPage,
  GeneratedPageState,
} from "../../../types/generatedContent.type.ts";
import { checkImageCount } from "../../../infrastructure/api/wordpress-api/final-preview/checkImageCount.api.ts";
import ImagLimitWarning from "../../component/dialogs/ImageLimitWarning.tsx";
import SomethingWrong from "../../component/dialogs/SomethingWrong.tsx";
import { generateAndDisplayEcomProducts } from "./ecomDetails.ts";

const Mode = import.meta.env.VITE_MODE;

const FinalPreview: React.FC = () => {
  const reduxPages = useSelector(
    (state: RootState) => state.userData?.templateList.pages
  );

  const validReduxPages: Page[] = useMemo(() => {
    const pages = reduxPages || [];
    return pages.map((page) => ({
      name: page.title,
      status: "",
      slug: page.slug,
      selected: false,
    }));
  }, [reduxPages]);

  const dispatch = useDispatch();

  // Use reduxPages if it's not empty; otherwise, fallback to defaultPages
  const [pages, setPages] = useState<Page[]>([
    { name: "Home", status: "", slug: "home", selected: false },
    { name: "About Us", status: "", slug: "about", selected: false },
    { name: "Services", status: "", slug: "service", selected: false },
    { name: "Blog", status: "", slug: "blog", selected: false },
    { name: "Contact Us", status: "", slug: "contact-us", selected: false },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState("desktop");
  const [isLoading, setIsLoading] = useState(false);
  const [planExpired, setPlanExpired] = useState(false);
  const [isContentGenerating, setIsContentGenerating] = useState(false);
  const [isPageGenerated, setIsPageGenerated] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>("Home");
  const [showGwLoader, setShowGwLoader] = useState(false);
  const [generatedPage, setGeneratedPage] = useState<GeneratedPageState>({
    spinner: false,
  });
  const [generatedPageName, setGeneratedPageName] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [resetPopup, setresetPopup] = useState(false);
  const [previousClicked, setPreviousClicked] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [iframeSrc, setIframeSrc] = useState<string>("");
  const [currentContent, setCurrentContent] = useState<string>("");
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [Loaded, setLoaded] = useState(false);
  const [findIndex, setfindIndex] = useState<number>();
  const [importLoad, setImportLoad] = useState(false);
  const [apiIssue, setapiIssue] = useState(false);
  const [wordCountAlert, setwordCountAlert] = useState(false);
  const [afterContact, setAfterContact] = useState(false);
  const [showImportWarning, setshowImportWarning] = useState(false);
  const [showImageWarning, setshowImageWarning] = useState(false);
  const [showImportWarningDialouge, setshowImportWarningDialouge] =
    useState(false);
  const [isImportLoading, setIsImportLoading] = useState(false);
  const [updateCountError, setupdateCountError] = useState(false);

  const contactDetails = useSelector(
    (state: RootState) => state.userData.contactform
  );
  const [issue, setIssue] = useState(false);
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
  const stepDescription = useSelector(
    (state: RootState) => state.userData.description2
  );
  const templateName: string = useSelector(
    (state: RootState) => state.userData.templatename
  );
  const template_id: number = useSelector(
    (state: RootState) => state.userData.templateid
  );
  const fontFamily = useSelector((state: RootState) => state.userData.font);
  const Color = useSelector((state: RootState) => state.userData.color);

  const logoUrl = useSelector((state: RootState) => state.userData.logo);
  const logoWidth = useSelector((state: RootState) => state.userData.logoWidth);
  const templateList = useSelector(
    (state: RootState) => state.userData.templateList
  );

  const bearer_token = useSelector((state: RootState) => state.user.wp_token);

  const posthog = usePostHog();

  const currentPages = useSelector((state: RootState) => state.userData.pages);

  const initialColor = useSelector((state: RootState) => ({
    primaryColor: state.userData.style.defaultColor.primary,
    secondaryColor: state.userData.style.defaultColor.secondary,
  }));

  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
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

  const showWarningToast = () => {
    toast.warn("Please wait while we are generating.");
  };

  const showSuccessToast = useCallback(() => {
    setIsContentGenerating(false);
    setIsLoading(false);
    toast.success("generation complete!");

    updatePageStatus(selectedPage!, "Generated", true);
  }, [selectedPage]);

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

  const storeHtmlContent = useCallback(
    async (pageName: string, htmlContent: string) => {
      try {
        if (issue) return;
        const endpoint = getDomainFromEndpoint(
          "/wp-json/custom/v1/save-generated-html-data"
        );
        if (!endpoint) {
          console.error("Endpoint is not available.");
          return;
        }

        await axios.post(endpoint, {
          version_name: "5.5",
          page_name: pageName,
          template_name: templateName,
          html_data: JSON.stringify(htmlContent),
        });
      } catch (error) {
        console.error("Error storing HTML content:", error);
      }
    },
    [getDomainFromEndpoint, issue, templateName]
  );

  const updateIframeSrc = useCallback(
    (content: string) => {
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
    },
    [currentContent, setCurrentContent, setIframeSrc] // Add dependencies
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
          return false;
        }

        setIsLoading(true);
        if (!pageName || !templateName) {
          console.error("page name is not available ");
          return false;
        }

        const response = await axios.post(endpoint, {
          version_name: versionName,
          page_name: pageName,
          template_name: templateName,
        });

        if (response.status === 200 && response.data?.data) {
          const rawHtmlContent = response.data.data[0]?.html_data;
          if (!rawHtmlContent) {
            console.error("HTML data is empty or undefined.");
            return false;
          }

          const cleanedHtmlContent = rawHtmlContent
            .replace(/^"(.*)"$/, "$1")
            .replace(/\\"/g, '"')
            .replace(/\\n/g, "")
            .replace(/\\t/g, "")
            .replace(/\\\\/g, "");

          setGeneratedPage(
            (prevPages: GeneratedPageState): GeneratedPageState => {
              const updatedPages = {
                ...prevPages,
                spinner: false,
                [pageName]: {
                  0: cleanedHtmlContent,
                },
              };
              updatePageStatus(pageName, "Generated", true);

              setShowGwLoader(false);

              if (selectedPage === pageName) {
                updateIframeSrc(cleanedHtmlContent);

                setShowGwLoader(false);
                setIsPageGenerated(true);
              }

              return updatedPages;
            }
          );

          return true;
        } else {
          console.error("Failed to store page data:", response);
          return false;
        }
      } catch (error) {
        console.error("Error storing page data:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [getDomainFromEndpoint, selectedPage, updateIframeSrc]
  );

  const storeOldNewContent = useCallback(
    async (
      pageName: string,
      jsonContent: Record<string, string>,
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
          setapiIssue(true);
          console.error(
            "Failed to update word count(issue on gravitywrite api):",
            updateResponse.data
          );
          return;
        }

        const saveContentEndpoint = getDomainFromEndpoint(
          "/wp-json/custom/v1/save-generated-data"
        );

        if (!saveContentEndpoint) {
          console.error("Save content endpoint is not available.");
          return;
        }

        await axios.post(saveContentEndpoint, {
          version_name: "5.5",
          page_name: pageName,
          template_name: templateName,
          json_content: jsonContent,
        });

        // if (saveResponse.status === 200) {
        //   console.log(
        //     "Old and new content stored successfully:",
        //     saveResponse.data
        //   );
        // } else {
        //   console.error(
        //     "Failed to store old and new content:",
        //     saveResponse.data
        //   );
        // }
      } catch (error) {
        setapiIssue(true);
        console.error(
          "Failed to update word count(issue on gravitywrite api):",
          error
        );
      }
    },
    [getDomainFromEndpoint, templateList.id, templateName]
  );

  const handleOldNewContent = useCallback(
    (pageName: string, content: Record<string, string>, wordCount: number) => {
      storeOldNewContent(pageName, content, wordCount);
    },
    [storeOldNewContent]
  );

  const selectNextPage = (currentPage: string) => {
    const currentPageIndex = pages.findIndex(
      (page) => page.name === currentPage
    );

    const arrayVal = rearrangeArray(pages, currentPageIndex);

    if (arrayVal?.length > 0) {
      const nextPage = arrayVal.find(
        (page: Page) =>
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
        (page: Page) =>
          page.status !== "Generated" &&
          page.status !== "Skipped" &&
          page.status !== "Added"
      );
      if (nextPage) {
        setSelectedPage(nextPage.name);
      }
    }
  };

  const fetchGeneratedPageStatus = useCallback(async () => {
    try {
      // Build the API endpoint URL
      const endpoint = getDomainFromEndpoint(
        "/wp-json/custom/v1/get-generated-page-status"
      );
      if (!endpoint) {
        console.error("Endpoint is not available.");
        return;
      }

      // Make the API request
      const response = await axios.post(endpoint);

      // Check for a successful response
      if (response.status === 200) {
        const { data } = response.data; // assuming response.data.data contains the array
        if (data && Array.isArray(data)) {
          // Update local state by merging the API data with existing pages
          setPages((prevPages) => {
            const updatedPages = prevPages.map((page) => {
              const matchingPage = data.find(
                (apiPage: ApiPage) => apiPage.page_name === page.name
              );
              if (matchingPage) {
                // Dispatch Redux action to update the page in the global store
                dispatch(
                  updateReduxPage({
                    name: page.name,
                    status: matchingPage.page_status,
                    selected: matchingPage.selected === "1",
                  })
                );

                // Return the updated page object
                return {
                  ...page,
                  status: matchingPage.page_status,
                  selected: matchingPage.selected === "1",
                };
              }
              // Return the original page if no matching API record is found
              return page;
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
  }, [getDomainFromEndpoint, dispatch]);

  const updateContactDetails = (
    email: string,
    phone: string,
    address: string
  ) => {
    if (iframeRef.current) {
      if (!email || !phone || !address) {
        return;
      }
      iframeRef?.current?.contentWindow?.postMessage(
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
    setIsContentGenerating(false);
    // setIsLoading(true);
    setLoaded(true);

    const iframe = iframeRef.current;

    if (!selectedPage || !templateName) {
      console.warn("Required parameters not available. Waiting for values...");
      // Optionally, you could set a state flag to retry when these values update.
      return;
    }

    // Ensure that the pages state has been updated with a page matching selectedPage.
    if (!pages.find((page) => page.name === selectedPage)) {
      // Await updating local pages via the status API
      await fetchGeneratedPageStatus();
    }

    const currentPage = pages.find((page) => page.name === selectedPage);

    const currentPageIndex = pages.findIndex(
      (page) => page.name === selectedPage
    );

    updateContactDetails(
      contactDetails?.email || "",
      contactDetails?.phoneNumber || "",
      contactDetails?.address || ""
    );

    setfindIndex(currentPageIndex);
    sendNonClickable();

    if (!iframe) return;

    if (fontFamily) {
      iframe?.contentWindow?.postMessage(
        { type: "changeFont", font: fontFamily },
        "*"
      );
    }

    if (Color.primary && Color.secondary) {
      iframe?.contentWindow?.postMessage(
        {
          type: "changeGlobalColors",
          primaryColor: Color.primary,
          secondaryColor: Color.secondary,
        },
        "*"
      );
    }
    // updateIframeLogo(logoUrl, logoWidth);
    if (logoUrl) {
      updateIframeLogo(logoUrl, logoWidth);
    } else if (businessName) {
      sendIframeMessage("bussinessName", businessName);
    }

    if (
      selectedPage &&
      generatedPage[selectedPage] &&
      Array.isArray(generatedPage[selectedPage])
    ) {
      const existingContent = (generatedPage[selectedPage] as string[])[0];
      updateIframeSrc(existingContent);
    } else if (selectedPage && !generatedPage[selectedPage]) {
      setwordCountAlert(false);

      if (!selectedPage && !templateName) {
        return;
      }
      const fetchResult = await fetchAndStorePageData(
        selectedPage,
        templateName,
        "5.5"
      );

      if (fetchResult) {
        // setShowGwLoader(false);
        setwordCountAlert(false);
        return;
      }

      if (!fetchResult) {
        if (selectedPage === "Home" && pages[0].status !== "Generated") {
          setShowPopup(false);
          setIsLoading(false);
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

            // setIsLoading(true);
            if (response?.data?.status === true) {
              const imageCount = await checkImageCount(
                selectedPage,
                template_id,
                setapiIssue
              );

              if (!imageCount) {
                setIsLoading(false);

                setIsContentGenerating(false);
                setIsLoading(false);
                setShowGwLoader(false);

                setshowImageWarning(true);

                return;
              }
              const iframe = iframeRef.current;
              const currentPage = pages.find(
                (page) => page.name === selectedPage
              );

              if (currentPage && currentPage.status !== "Generated") {
                setShowGwLoader(true);
                iframe?.contentWindow?.postMessage(
                  {
                    type: "start",
                    templateName: templateName,
                    pageName: currentPage?.slug,
                    bussinessname: businessName,
                    description: Description,
                    stepdescription: stepDescription,
                    template_id: templateList?.id,
                    bearer_token: bearer_token,
                    primaryColor: Color.primary || initialColor.primaryColor,
                    secondaryColor:
                      Color.secondary || initialColor.secondaryColor,
                    stagging: Mode === "staging" ? true : false,
                    dark_theme: templateList.dark_theme,
                  },
                  "*"
                );
              }
            } else if (response?.data?.status === false) {
              setIsContentGenerating(false);
              setwordCountAlert(true);
              // setShowGwLoader(false);
              // setIsLoading(false);
            }
          } catch (error) {
            console.error("Error while calling the word count API:", error);
            setapiIssue(true);
          } finally {
            setIsLoading(false);
            // setShowGwLoader(false);
          }
        }
      }
    } else {
      if (selectedPage && generatedPage[selectedPage] && isPageGenerated) {
        const existingContent = generatedPage[selectedPage][0];
        updateIframeSrc(existingContent);

        setShowGwLoader(false);
      } else if (selectedPage === "Home" && pages[0].status !== "Generated") {
        setShowGwLoader(true);
        iframe?.contentWindow?.postMessage(
          {
            type: "start",
            templateName: templateName,
            pageName: currentPage?.slug,
            bussinessname: businessName,
            stepdescription: stepDescription,
            description: Description,
            template_id: templateList?.id,
            primaryColor: Color.primary || initialColor.primaryColor,
            secondaryColor: Color.secondary || initialColor.secondaryColor,
            stagging: Mode === "staging" ? true : false,
            color: Color,
            dark_theme: templateList.dark_theme,
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

  const togglePage = (page: string) => {
    // setIsLoading(true);
    if (page === selectedPage) return;
    setAfterContact(false);

    setSelectedPage(page);
    setwordCountAlert(false);

    const existingContent = generatedPage[page];

    if (existingContent) {
      updateIframeSrc(existingContent[0]);
      if (showImageWarning) {
        setshowImageWarning(false);
      }
      setIsPageGenerated(true);
      setShowGwLoader(false);
    } else {
      setIsPageGenerated(false);
      // setIsLoading(true);
    }
  };

  const handlePageNavigation = (
    action: "next" | "skip" | "add",
    currentPage: string
  ) => {
    if (isContentGenerating) {
      // showWarningToast();
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
            name: updatedPages[currentPageIndex].name,
            status: "Generated",
            selected: true,
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
              name: updatedPages[currentPageIndex].name,
              status: "Added",
              selected: true,
            })
          );
        } else if (currentPages[currentPageIndex].status == "Added") {
          updatedPages[currentPageIndex].status = "";
          updatedPages[currentPageIndex].selected = false;
          dispatch(
            updateReduxPage({
              name: updatedPages[currentPageIndex].name,
              status: "",
              selected: false,
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
        } else {
          setIsLoading(true);
          setIsPageGenerated(false);

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
        setSelectedPage(updatedPages[nextPageIndex].name);

        const nextPageContent = generatedPage[updatedPages[nextPageIndex].name];

        setIsPageGenerated(false);
        setIsLoading(true);
        if (nextPageContent) {
          updateIframeSrc(nextPageContent[0]);
        } else {
          setIsPageGenerated(false);
          setIsLoading(true);
          const iframe: null | HTMLIFrameElement = iframeRef.current;
          const nextPageSlug = updatedPages[nextPageIndex].slug;
          if (iframe) {
            iframe.src = `${iframeSrc}/${nextPageSlug}`;
          }
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
        const imageCount = await checkImageCount(
          selectedPage,
          template_id,
          setapiIssue
        );

        if (!imageCount) {
          console.error("image count is exeed");

          if (isContentGenerating || isLoading || showGwLoader) {
            setIsContentGenerating(false);
            setIsLoading(false);
            setShowGwLoader(false);
          }
          setIsContentGenerating(false);
          setIsLoading(false);
          setShowGwLoader(false);
          setshowImageWarning(true);

          return;
        }

        const iframe = iframeRef.current;
        const currentPage = pages.find((page) => page.name === selectedPage);

        if (currentPage && currentPage.status !== "Generated") {
          iframe?.contentWindow?.postMessage(
            {
              type: "start",
              templateName: templateName,
              pageName: currentPage?.slug,
              bussinessname: businessName,
              description: Description,
              stepdescription: stepDescription,
              template_id: templateList?.id,
              bearer_token: bearer_token,
              primaryColor: Color.primary || initialColor.primaryColor,
              secondaryColor: Color.secondary || initialColor.secondaryColor,
              stagging: Mode === "staging" ? true : false,
              dark_theme: templateList.dark_theme,
            },
            "*"
          );
        }
      } else if (
        response?.data?.status === "pending" ||
        response?.data?.status === "canceled" ||
        response?.data?.status === "overdue" ||
        response?.data?.status === "expired"
      ) {
        setIsLoading(false);
        setIsContentGenerating(false);
        setShowGwLoader(false);
        setPlanExpired(true);
      } else if (response?.data?.status === false) {
        setShowGwLoader(false);
        setIsContentGenerating(false);
        setIsLoading(false);
        if (selectedPage === generatedPage[selectedPage]) {
          setwordCountAlert(false);
          setIsContentGenerating(false);
          setIsLoading(false);
        }
        setwordCountAlert(true);
      } else {
        setapiIssue(true);
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

      setIsLoading(true);
      setIsPageGenerated(false);
    }
  };
  const rearrangeArray = (array: Page[], startIndex: number) => {
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
      } else if (event.data.type === "generationStatus") {
        if (event.data.isGenerating) {
          setIsContentGenerating(true);
          setIsLoading(false);
        }
        setIsLoading(event.data.isGenerating);
        if (event.data.isGenerating) {
          setShowGwLoader(false);
        }
      } else if (event.data.type === "somethingwentWrong") {
        setIssue(true);
      } else if (event.data.type === "generatedContent") {
        if (apiIssue) return;
        const pageName = selectedPage || "";
        const htmlContent = event.data.content;

        const currentPageIndex = pages.findIndex(
          (page) => page?.name === selectedPage
        );

        dispatch(
          updateReduxPage({
            name: pages[currentPageIndex].name,
            status: "Generated",
            selected: true,
          })
        );

        setGeneratedPage((prevPages: GeneratedPageState) => {
          const updatedPages = {
            ...prevPages,
            spinner: false,
            [pageName]: {
              0: htmlContent,
            },
          };
          return updatedPages;
        });
        storeHtmlContent(pageName, htmlContent);
      } else if (event.data.type === "oldNewContent") {
        posthog?.capture("Genearted Page", {
          Generatedpage: selectedPage,
        });
        if (updateCountError) {
          return;
        }

        const pageName = selectedPage;
        const wordCount = calculateWordCount(event.data.content);
        handleOldNewContent(pageName, event.data.content, wordCount);
      } else if (event.data.type === "streamingError") {
        setupdateCountError(true);
        setapiIssue(true);
      }
      // else if (event.data.type === "image-failure") {
      //   console.log("log from image-failure", event.data.failures, "even.data");
      //   setImageFailure(event.data.failures);
      //   setImageError(true);
      // }
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
  }, [
    Color,
    fontFamily,
    selectedPage,
    storeHtmlContent,
    handleOldNewContent,
    pages,
    dispatch,
    showSuccessToast,
    posthog,
    updateCountError,
    apiIssue,
  ]);

  const handleImportSelectedPage = async () => {
    posthog?.capture("import selected page", {
      installedTemplate: templateList.name,
    });

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
        const confirmEndpoint = getDomainFromEndpoint(
          "/wp-json/custom/v1/check-previous-import"
        );
        const confirmResponse = await axios.post(confirmEndpoint, {
          value: true,
        });

        if (confirmResponse?.data?.value === true) {
          setshowImportWarningDialouge(true);
        } else {
          posthog?.capture("import selected page", {
            installedTemplate: templateList.name,
          });
          setImportLoad(false);

          navigate("/processing", { state: { pageName: selectedPage } });
        }
      } else if (
        response?.data?.status === "pending" ||
        response?.data?.status === "canceled" ||
        response?.data?.status === "overdue" ||
        response?.data?.status === "expired"
      ) {
        setPlanExpired(true);
      } else {
        setImportLoad(false);
        setshowImportWarning(true);
      }
    } catch (error) {
      console.error("Error during the import process:", error);
      setImportLoad(false);
      setapiIssue(true);
    }
  };

  const handleContinueImport = async () => {
    setIsImportLoading(true);
    posthog?.capture("import selected page", {
      installedTemplate: templateList.name,
    });
    try {
      await axios.delete(
        getDomainFromEndpoint("/wp-json/custom/v1/delete-theme-and-plugins")
      );
      await axios.delete(
        getDomainFromEndpoint("/wp-json/custom/v1/delete-all-posts")
      );

      setIsImportLoading(false);
      setshowImportWarningDialouge(false);
      setImportLoad(false);
      navigate("/processing", { state: { pageName: selectedPage } });
    } catch (error) {
      console.error("Error during the cleanup process:", error);
      setIsImportLoading(false);
      setImportLoad(false);
    }
  };

  // Function to handle popup close
  const handleCloseWarning = () => {
    setshowImportWarningDialouge(false);
    setImportLoad(false);
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
  }, [fetchGeneratedPageStatus, validReduxPages]);

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
    const pageNames = Object.keys(generatedPage).filter(
      (key) => key !== "spinner" && typeof generatedPage[key] === "object"
    );
    setGeneratedPageName(pageNames);
  }, [generatedPage]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isContentGenerating || showGwLoader) {
        event.preventDefault();
        event.returnValue = ""; // Most browsers ignore custom messages but require this to trigger the alert.
        // Show custom warning popup
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isContentGenerating, showGwLoader]);

  useEffect(() => {
    const receiveMessage = async (event: MessageEvent) => {
      // Check for the oldNewImages message from the iframe
      if (event.data.type === "oldNewImages") {
        try {
          const saveImageEndpoint = getDomainFromEndpoint(
            "/wp-json/custom/v1/save-generated-image"
          );
          if (!saveImageEndpoint) {
            console.error("Save image endpoint is not available.");
            return;
          }

          const cleanedImageMapping = Object.values(event.data.images).reduce<
            Record<string, string>
          >(
            (acc, mapping) => ({
              ...acc,
              ...(mapping as Record<string, string>),
            }),
            {}
          );

          // Post the cleaned image data to the API.
          const saveResponse = await axios.post(saveImageEndpoint, {
            version_name: "5.5",
            page_name: selectedPage, // or use selectedPage if needed
            template_name: templateName,
            json_content: cleanedImageMapping,
          });

          if (saveResponse.status === 200) {
            console.log("Image data saved successfully:", saveResponse.data);
            showSuccessToast();
          } else {
            console.error("Failed to save image data:", saveResponse.data);
          }
        } catch (error) {
          console.error("Error saving image data:", error);
        }
      }
    };

    window.addEventListener("message", receiveMessage);
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [getDomainFromEndpoint, selectedPage, showSuccessToast, templateName]);

  return (
    <div className="h-screen flex font-[inter] w-screen">
      <div className="w-[23%] lg:w-[30%]">
        <aside className="fixed z-10">
          <div className="bg-white min-h-screen w-[23vw] lg:w-[30vw] z-10 border-r border-[#DFEAF6]">
            <div className="flex items-center justify-between py-4 border-b cursor-pointer pr-7 ps-3 sidebar-header border-[#DFEAF6]">
              <img
                src="https://plugin.mywpsite.org/logo.svg"
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
              <span
                onClick={() => setIsLoading(false)}
                className="text-base text-[#88898A] font-normal"
              >
                Preview your website’s potential with our interactive
                demonstration.
              </span>
              <button
                onClick={() => {
                  generateAndDisplayEcomProducts(
                    businessName,
                    Description,
                    6,
                    iframeRef,
                    setShowGwLoader
                  );
                  // setIsLoading(false);
                }}
                className="px-4 py-2 text-sm font-medium rounded-md cursor-pointer text-white bg-palatinate-blue-600 hover:bg-palatinate-blue-600 hover:text-white"
              >
                Generate products
              </button>
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
              generatedPageName={generatedPageName}
              planExpired={planExpired}
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
                      src="https://plugin.mywpsite.org/popupimg.svg"
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

          {issue && <SomethingWrong />}

          {showImportWarning && (
            <UpgradePopup
              onClose={() => setshowImportWarning(false)}
              alertType="importLimit"
            />
          )}
          {showImportWarningDialouge && (
            <ImportWarning
              onClose={handleCloseWarning}
              continueImport={handleContinueImport}
              isimportLoading={isImportLoading}
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
            {/* 
{imageError && (
              <div className="absolute inset-0 z-20 flex items-center justify-center ">
                <ImageGenerationFailed />
              </div>
            )} */}

            {showImageWarning && (
              <div className="absolute inset-0 z-20 flex items-center justify-center ">
                <ImagLimitWarning
                  onClose={() => {
                    setshowImageWarning(false);
                  }}
                />
              </div>
            )}

            {apiIssue && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
                <ApiErrorPopup alertType="contentError" />
              </div>
            )}

            {/* Skeleton Loader Layer */}
            {/* {isLoading && !isContentGenerating && <PlumberPageSkeleton />} */}

            {wordCountAlert && <WordLimit />}
            {planExpired && <PlanExpired />}

            {/* Generated Content Iframe */}
            {generatedPage[selectedPage] && isPageGenerated && (
              <iframe
                ref={iframeRef}
                // src={iframeSrc}
                src="https://coffeeshop.mywpsite.org/shop/"
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
                // src={`${currentUrl}/${
                //   pages.find((page) => page.name === selectedPage)?.slug
                // }`}
                src="https://coffeeshop.mywpsite.org/shop/"
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
