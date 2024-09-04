import React, { useState, useEffect, useRef } from "react";
import GravityWriteLogo from "../../../assets/logo.svg";
import MenuIcon from "../../../assets/menu.svg";
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
import GwLoader from "../../component/loader/gwLoader";

const FinalPreview: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState("desktop");
  const [isLoading, setIsLoading] = useState(true);
  const [isContentGenerating, setIsContentGenerating] = useState(false);
  const [isPageGenerated, setIsPageGenerated] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>("Home");
  const [showGwLoader, setShowGwLoader] = useState(false);

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

  const showWarningToast = () => {
    toast.warn("Please wait while content is being generated.");
  };

  const showSuccessToast = () => {
    toast.success("Content generation complete!");
    updatePageStatus(selectedPage!, "Generated"); // Update page status to "Generated" on success
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

    if (selectedPage && generatedPage[selectedPage] && isPageGenerated) {
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
      setIsLoading(false);
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
      setIsPageGenerated(true);
    } else {
      setShowIframe(true);
      setIsPageGenerated(false);
      setIsLoading(true);
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
          setIsPageGenerated(false);
          setIsLoading(true);
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

  const updatePageStatus = (pageName: string, status: string) => {
    const updatedPages = pages.map((page) =>
      page.name === pageName ? { ...page, status } : page
    );
    setPages(updatedPages);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleGeneratePage = () => {
    setShowPopup(false);
    setIsLoading(true);
    setShowGwLoader(true);

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
        iframe.src = `https://tours.mywpsite.org/${prevPageSlug}`;
      }
      setShowIframe(true);
      setIsLoading(true);
      setIsPageGenerated(false);
    }
  };

  const handleNext = () => {
    handlePageNavigation("next");
  };

  const handleSkipPage = () => {
    handlePageNavigation("skip");
  };

  // Effect to handle iframe resizing based on view mode
  useEffect(() => {
    if (iframeRef.current) {
      if (viewMode === "desktop") {
        iframeRef.current.style.width = "100%";
        iframeRef.current.style.height = "100%";
      } else if (viewMode === "tablet") {
        iframeRef.current.style.width = "768px"; // Typical width for tablet
        iframeRef.current.style.height = "100%";
      } else if (viewMode === "mobile") {
        iframeRef.current.style.width = "375px"; // Typical width for mobile
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
          </div>

          <div className="w-full h-screen flex justify-center items-center relative">
            {/* Show GwLoader only when showGwLoader is true */}
            {showGwLoader && (
              <div className="absolute inset-0 bg-white flex justify-center items-center z-20">
                <GwLoader />
              </div>
            )}

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
                src={`https://tours.mywpsite.org/${
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
    </div>
  );
};

export default FinalPreview;
