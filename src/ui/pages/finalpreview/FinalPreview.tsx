import React, { useState, useEffect, useRef } from "react";
import GravityWriteLogo from "../../../assets/logo.svg";
import MenuIcon from "../../../assets/menu.svg";
import CachedIcon from "@mui/icons-material/Cached";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpgradePopup from "../../component/UpgradePopup";
import { Link, useNavigate } from "react-router-dom";
import useIframeMessage from "../../../hooks/useIframeMessage";
import { ChangeLogoMessage } from "../../../types/iframeMessages.type";
import ViewModeSwitcher from "../../component/finalpreview/ViewModeSwitcher";
import PageSelector from "../../component/finalpreview/PageSelector";
import CloseIcon from "@mui/icons-material/Close";
import popupimg from "../../../assets/popupimg.svg";
import { Page } from "../../../types/page.type";
import PlumberPageSkeleton from "../../component/PlumberPageSkeleton ";

const FinalPreview: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState("desktop");
  const [isLoading, setIsLoading] = useState(true); // Loader state
  const [isContentGenerating, setIsContentGenerating] = useState(false);
  const [isPageGenerated, setIsPageGenerated] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>("Home");

  const businessName = useSelector(
    (state: RootState) => state.userData.businessName
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

  const [pages, setPages] = useState<Page[]>([
    { name: "Home", status: "", slug: "homepage", selected: false },
    { name: "About Us", status: "", slug: "about", selected: false },
    { name: "Services", status: "", slug: "service", selected: false },
    { name: "Blog", status: "", slug: "blog", selected: false },
    { name: "Contact", status: "", slug: "contact", selected: false },
  ]);

  const [pageContents, setPageContents] = useState<any>({});
  const [showPopup, setShowPopup] = useState(false);
  const [previousClicked, setPreviousClicked] = useState(false);
  const [generatedPage, setGeneratedPage] = useState<any>({});
  const [iframeSrc, setIframeSrc] = useState<string>("");
  const [currentContent, setCurrentContent] = useState<string>("");
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [showIframe, setShowIframe] = useState(true);
  const [Loaded, setLoaded] = useState(false);
  const [contentForBackend, setContentForBackend] = useState<any[]>([]);

  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { sendMessage, sendMessageToIframe } = useIframeMessage(iframeRef);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleViewChange = (mode: string) => {
    setViewMode(mode);
    setIsOpen(false);
  };

  const changeLogo = (logoUrl: string) => {
    const message: ChangeLogoMessage = { type: "changeLogo", logoUrl };
    sendMessageToIframe(message);
  };

  const handleRegenerate = () => {
    if (isContentGenerating) {
      showWarningToast();
      return;
    }

    setRegenerateCount(regenerateCount + 1);
    setIsLoading(true); // Show loader before regeneration starts

    if (selectedPage) {
      const currentPage = pages.find((page) => page.name === selectedPage);
      if (currentPage) {
        sendMessage({
          type: "regenerate",
          templateName: templateName,
          pageName: currentPage.slug,
        });
        setShowIframe(true);
      }
    }
  };

  const showWarningToast = () => {
    toast.warn("Please wait while content is being generated.");
  };

  const showSuccessToast = () => {
    toast.success("Content generation complete!");
  };

  const onLoadMsg = () => {
    const iframe = iframeRef.current;
    const currentPage = pages.find((page) => page.name === selectedPage);

    setLoaded(true);

    if (selectedPage === "Blog" || selectedPage === "Contact") {
      setIsLoading(false);
      setLoaded(false);
      setIsLoading(false);
      return;
    }

    if ((Color.primary && Color.secondary) || fontFamily) {
      iframe?.contentWindow?.postMessage(
        { type: "changeFont", font: fontFamily },
        "*"
      );
      iframe?.contentWindow?.postMessage(
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
    }

    if (selectedPage) {
      if (generatedPage[selectedPage] && isPageGenerated) {
        const existingContent = generatedPage[selectedPage][0];
        updateIframeSrc(existingContent);
        setShowIframe(false);
      } else if (selectedPage === "Home" && pages[0].status !== "Generated") {
        iframe?.contentWindow?.postMessage(
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
    }

    if (
      selectedPage !== "Home" &&
      currentPage &&
      currentPage.status !== "Generated" &&
      currentPage.status !== "Skipped"
    ) {
      setTimeout(() => {
        setShowPopup(true);
      }, 100);
    }

    if (!isContentGenerating) {
      setIsLoading(false); // Ensure loader is not shown again after content generation
    }
  };

  const updateIframeSrc = (content: string) => {
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

    setSelectedPage(page);
    const existingContent = generatedPage[page];

    if (existingContent) {
      updateIframeSrc(existingContent[0]);
      setShowIframe(false);
      setIsPageGenerated(true); // Page is now displaying generated content
    } else {
      setShowIframe(true);
      setIsPageGenerated(false); // Reset when user navigates away
      setIsLoading(true); // Show loader when navigating to a new page
    }
  };

  const handlePageNavigation = (action: "next" | "skip") => {
    if (isContentGenerating) {
      showWarningToast();
      return;
    }

    const currentPageIndex = pages.findIndex(
      (page) => page.name === selectedPage
    );
    if (currentPageIndex !== -1) {
      if (action === "next") {
        const iframe = iframeRef.current;
        iframe?.contentWindow?.postMessage({ type: "saveContent" }, "*");
      }

      const updatedPages = [...pages];
      if (action === "next") {
        updatedPages[currentPageIndex].status = "Generated";
      } else if (action === "skip") {
        updatedPages[currentPageIndex].status = "Skipped";
      }
      updatedPages[currentPageIndex].selected = true;

      setPages(updatedPages);

      const nextPageIndex = currentPageIndex + 1;
      if (nextPageIndex < updatedPages.length) {
        setSelectedPage(updatedPages[nextPageIndex].name);

        const nextPageContent = generatedPage[updatedPages[nextPageIndex].name];
        if (nextPageContent) {
          updateIframeSrc(nextPageContent[0]);
          setShowIframe(false);
        } else {
          setShowIframe(true);
          setIsPageGenerated(false); // Reset the generated state
          setIsLoading(true); // Show loader when navigating to the next page
          const iframe: null | HTMLIFrameElement = iframeRef.current;
          const nextPageSlug = updatedPages[nextPageIndex].slug;
          if (iframe) {
            iframe.src = `https://tours.mywpsite.org/${nextPageSlug}`;
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
    const updatedPages = pages.map((page) =>
      page.name === pageName ? { ...page, status, selected } : page
    );
    setPages(updatedPages);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleGeneratePage = () => {
    setShowPopup(false);
    setIsLoading(true); // Show loader immediately when "Generate this Page" is clicked
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
      const updatedPages = [...pages];
      updatedPages.find((page) => page.name === currentPage.name)!.status =
        "Generated";
      updatedPages.find((page) => page.name === currentPage.name)!.selected =
        true;
      setPages(updatedPages);
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
        iframe.src = `https://tours.mywpsite.org/${prevPageSlug}`;
      }
      setShowIframe(true);
      setIsLoading(true);
      setIsPageGenerated(false); // Reset the generated state
    }
  };

  const handleNext = () => {
    handlePageNavigation("next");
  };

  const handleSkipPage = () => {
    handlePageNavigation("skip");
  };

  useEffect(() => {
    const receiveMessage = (event: MessageEvent) => {
      if (event.data.type === "contentLoaded") {
        setLoading(false);
      } else if (event.data.type === "saveContentResponse") {
        setPageContents((prevContents) => ({
          ...prevContents,
          [selectedPage!]: event.data.content,
        }));
      } else if (event.data.type === "generationStatus") {
        setIsContentGenerating(event.data.isGenerating);
        setIsLoading(event.data.isGenerating);
      } else if (event.data.type === "generatedContent") {
        const pageName = event.data.pageName || selectedPage || "";

        setGeneratedPage((prevPages: any) => {
          const updatedPages = {
            ...prevPages,
            spinner: false,
            [pageName]: {
              0: event.data.content,
            },
          };
          return updatedPages;
        });

        if (!event.data.isGenerating) {
          showSuccessToast();
        }
      }
    };

    window.addEventListener("message", receiveMessage);
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [Color, fontFamily, selectedPage]);

  useEffect(() => {
    const receiveMessage = (event: MessageEvent) => {
      if (event.data.type === "contentReady") {
        const iframeHtmlContent: string = event.data.content;
        updateIframeSrc(iframeHtmlContent);
        setShowIframe(false);

        if (iframeRef.current && iframeRef.current.contentWindow) {
          if ((Color.primary && Color.secondary) || fontFamily) {
            iframeRef.current.contentWindow.postMessage(
              { type: "changeFont", font: fontFamily },
              "*"
            );
            iframeRef.current.contentWindow.postMessage(
              {
                type: "changeGlobalColors",
                primaryColor: Color.primary,
                secondaryColor: Color.secondary,
              },
              "*"
            );
          }
          if (logoUrl) {
            iframeRef.current.contentWindow.postMessage(
              { type: "changeLogo", logoUrl },
              "*"
            );
          }
        }
      }
    };

    window.addEventListener("message", receiveMessage);
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [Color, fontFamily, logoUrl]);

  useEffect(() => {
    if (showIframe) {
      const iframe = iframeRef.current;
      if (iframe) {
        iframe.addEventListener("load", onLoadMsg);
      }
      return () => {
        if (iframe) {
          iframe.removeEventListener("load", onLoadMsg);
        }
      };
    }
  }, [Color, fontFamily, logoUrl, selectedPage, showIframe]);

  useEffect(() => {
    if (fontFamily && Color.primary && Color.secondary) {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          { type: "changeFont", font: fontFamily },
          "*"
        );
        iframe.contentWindow.postMessage(
          {
            type: "changeGlobalColors",
            primaryColor: Color.primary,
            secondaryColor: Color.secondary,
          },
          "*"
        );
      }
    }
  }, [fontFamily, Color]);

  useEffect(() => {
    const receiveMessage = (event: MessageEvent) => {
      if (event.data.type === "oldNewContent") {
        const pageName = selectedPage || "unknown";
        const oldNewContent = event.data.content;

        updateBackEndContent(pageName, oldNewContent);
      }
    };

    window.addEventListener("message", receiveMessage);

    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [selectedPage]);

  const updateBackEndContent = (pageName, oldNewContent) => {
    setContentForBackend((prevContent) => {
      const existingPageIndex = prevContent.findIndex(
        (entry) => Object.keys(entry)[0] === pageName
      );

      if (existingPageIndex !== -1) {
        const updatedContent = [...prevContent];
        updatedContent[existingPageIndex] = { [pageName]: oldNewContent };
        return updatedContent;
      } else {
        return [...prevContent, { [pageName]: oldNewContent }];
      }
    });
  };

  const handleImportSelectedPage = () => {
    navigate("/processing", { state: { pageName: selectedPage } });
  };

  return (
    <div className="h-screen flex font-[inter] w-screen">
      <div className="w-[23%] lg:w-[30%]">
        <aside className="z-10 fixed">
          <div className="bg-white min-h-screen w-[23vw] lg:w-[30vw] z-10 border-2">
            <div className="flex items-center justify-between py-4 border-b cursor-pointer pr-7 ps-3 sidebar-header">
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
            <div className="p-4 w-full flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <h1 className="text-xl leading-6 pb-2 mt-4 font-bold">
                  Website Preview
                </h1>
                <Link to={"/custom-design"}>
                  <button className="bg-button-bg-secondary p-2 rounded-md text-sm">
                    Back
                  </button>
                </Link>
              </div>
              <span className="text-sm text-[#88898A] font-light">
                Preview your website’s potential with our interactive
                demonstration.
              </span>
            </div>
            <PageSelector
              pages={pages}
              selectedPage={selectedPage}
              isContentGenerating={isContentGenerating}
              handleRegenerate={handleRegenerate}
              togglePage={togglePage}
              handleNext={handleNext}
              handleSkipPage={handleSkipPage}
              setShowPopup={setShowPopup}
              previousClicked={previousClicked}
              handlePrevious={handlePrevious}
              lateloader={setLoaded}
              handleImportSelectedPage={handleImportSelectedPage}
              updatePageStatus={updatePageStatus}
            />
          </div>
        </aside>
      </div>
      <div className="w-[80%] flex-last bg-[#F9FCFF] overflow-x-hidden relative">
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
          <div className="relative inline-block text-left my-4 flex justify-between">
            <ViewModeSwitcher
              isOpen={isOpen}
              viewMode={viewMode}
              toggleDropdown={toggleDropdown}
              handleViewChange={handleViewChange}
            />
            <div>
              <div className="flex items-center space-x-4">
                <button
                  className="text-gray-500"
                  onClick={() => setShowIframe(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <span className="text-gray-500">
                  {selectedPage
                    ? `${
                        pages.findIndex((page) => page.name === selectedPage) +
                        1
                      }/${pages.length}`
                    : ""}
                </span>
                <button
                  className="text-gray-500"
                  onClick={() => setShowIframe(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <button
                  className="flex items-center px-4 py-2 gap-1 bg-[#EBF4FF] text-black rounded"
                  onClick={handleRegenerate}
                >
                  <CachedIcon />
                  Regenerate page
                </button>
              </div>
            </div>
          </div>

          <div className="w-full h-screen flex justify-center items-center relative">
            {/* Skeleton Loader Layer */}
            {isLoading && !isContentGenerating && <PlumberPageSkeleton />}

            {/* Generated Content Iframe */}
            {generatedPage[selectedPage!] && isPageGenerated && (
              <iframe
                ref={iframeRef}
                src={iframeSrc}
                title="website"
                id="myIframe"
                onLoad={onLoadMsg}
                className={`h-full w-full transition-fade shadow-lg rounded-lg z-10 absolute top-0 left-0 ${
                  isLoading && !isContentGenerating
                    ? "opacity-0"
                    : "opacity-100"
                }  ${
                  viewMode === "desktop"
                    ? "w-full h-full"
                    : viewMode === "tablet"
                    ? "w-2/3 h-full"
                    : "w-1/3 h-full"
                }`}
              />
            )}

            {/* Non-Generated Content Iframe */}
            {(!generatedPage[selectedPage!] || !isPageGenerated) && (
              <iframe
                ref={iframeRef}
                src={`https://tours.mywpsite.org/${
                  pages.find((page) => page.name === selectedPage)?.slug
                }`}
                title="website"
                id="myIframe"
                onLoad={onLoadMsg}
                className={`h-full w-full transition-fade shadow-lg rounded-lg z-10 absolute top-0 left-0 ${
                  isLoading && !isContentGenerating
                    ? "opacity-0"
                    : "opacity-100"
                }  ${
                  viewMode === "desktop"
                    ? "w-full h-full"
                    : viewMode === "tablet"
                    ? "w-2/3 h-full"
                    : "w-1/3 h-full"
                }`}
              />
            )}
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FinalPreview;
