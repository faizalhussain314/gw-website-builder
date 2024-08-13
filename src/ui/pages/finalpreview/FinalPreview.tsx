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
import Spinner from "../../component/Spinner";

const FinalPreview: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState("desktop");
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
  const [selectedPage, setSelectedPage] = useState<string | null>("Home");
  const [temLoader, setTemLoader] = useState(false);
  const [_loading, setLoading] = useState(true);
  const [originalPrompts, setOriginalPrompts] = useState<any>({});
  const logoUrl = useSelector((state: RootState) => state.userData.logo);
  const [pages, setPages] = useState<Page[]>([
    { name: "Home", status: "", slug: "homepage" },
    { name: "About Us", status: "", slug: "about" },
    { name: "Services", status: "", slug: "service" },
    { name: "Blog", status: "Generated", slug: "blog" },
    { name: "Contact", status: "", slug: "contact" },
  ]);
  const [pageContents, setPageContents] = useState<any>({});
  const [showPopup, setShowPopup] = useState(false);
  const [isContentGenerating, setIsContentGenerating] = useState(false);
  const [previousClicked, setPreviousClicked] = useState(false);
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { sendMessage, sendMessageToIframe } = useIframeMessage(iframeRef);

  const [generatedPage, setGeneratedPage] = useState<any>({ spinner: true });
  const [iframeSrc, setIframeSrc] = useState<string>("");
  const [currentContent, setCurrentContent] = useState<string>("");
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [showIframe, setShowIframe] = useState(true);
  const [Loaded, setLoaded] = useState(false);

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
    setRegenerateCount(regenerateCount + 1);

    if (selectedPage) {
      const currentPage = pages.find((page) => page.name === selectedPage);
      if (currentPage) {
        sendMessage({
          type: "regenerate",
          templateName: "plumber",
          pageName: currentPage.slug,
        });
        setShowIframe(true);
      }
    }
  };

  const onLoadMsg = () => {
    const iframe = iframeRef.current;
    const currentPage = pages.find((page) => page.name === selectedPage);

    setLoaded(true);

    if ((Color.primary && Color.secondary) || fontFamily) {
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
    if (logoUrl) {
      changeLogo(logoUrl);
    }

    if (selectedPage) {
      if (generatedPage[selectedPage]) {
        const existingContent = generatedPage[selectedPage][0];
        updateIframeSrc(existingContent);
        setShowIframe(false);
      } else if (selectedPage === "Home" && pages[0].status !== "Generated") {
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            {
              type: "start",
              templateName: "plumber",
              pageName: currentPage?.slug,
              bussinessname: businessName,
              description: Description,
            },
            "*"
          );
        }
      }
    }

    // Show the popup after the iframe has loaded only if the page is not "Home"
    if (iframe?.contentWindow && selectedPage !== "Home") {
      setTimeout(() => {
        setShowPopup(true); // Trigger the popup to appear after the iframe load
      }, 1000); // Delay for better UX (adjust as necessary)
    }
  };

  const updateIframeSrc = (content: string) => {
    // Compare the new content with the current content
    if (content !== currentContent) {
      setCurrentContent(content); // Update the current content state
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
    if (page === selectedPage) return; // Prevent re-selecting the same page

    setSelectedPage(page);
    const existingContent = generatedPage[page]; // Check if content exists for the selected page

    if (existingContent) {
      updateIframeSrc(existingContent[0]);
      setShowIframe(false);
    } else {
      setShowIframe(true);
    }

    // Show the popup only if the page status is not "Generated"
    const selectedPageStatus = pages.find((p) => p.name === page)?.status;
    if (selectedPageStatus !== "Generated" && page !== "Home") {
      // setShowPopup(true);
    }
  };

  const handlePageNavigation = (action: "next" | "skip") => {
    if (isContentGenerating) {
      toast.warn("Please wait until the full page generation is complete.");
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

      const nextPageIndex = currentPageIndex + 1;
      if (nextPageIndex < updatedPages.length) {
        setSelectedPage(updatedPages[nextPageIndex].name);
        setPages(updatedPages);

        const nextPageContent = generatedPage[updatedPages[nextPageIndex].name];
        if (nextPageContent) {
          updateIframeSrc(nextPageContent[0]);
          setShowIframe(false);
        } else {
          setShowIframe(true);
          const iframe: null | HTMLIFrameElement = iframeRef.current;
          const nextPageSlug = updatedPages[nextPageIndex].slug;
          if (iframe) {
            iframe.src = `https://tours.mywpsite.org/${nextPageSlug}`;
          }
        }

        if (
          updatedPages[nextPageIndex].name !== "Home" &&
          updatedPages[nextPageIndex].name !== "Blog" &&
          updatedPages[nextPageIndex].status !== "Generated" &&
          updatedPages[nextPageIndex].status !== "Skipped"
        ) {
          // setShowPopup(true);
        }

        if (currentPageIndex === 0) {
          setPreviousClicked(true);
        }
      }
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleGeneratePage = () => {
    setShowPopup(false);
    const iframe = iframeRef.current;
    const currentPage = pages.find((page) => page.name === selectedPage);
    if (currentPage && currentPage.status !== "Generated") {
      iframe.contentWindow.postMessage(
        {
          type: "start",
          templateName: "plumber",
          pageName: currentPage?.slug,
          bussinessname: businessName,
          description: Description,
        },
        "*"
      );
      const updatedPages = [...pages];
      updatedPages.find((page) => page.name === currentPage.name)!.status =
        "Generated";
      setPages(updatedPages);
    }
  };

  const handlePrevious = () => {
    if (!previousClicked && !isContentGenerating) {
      navigate("/custom-design");
      return;
    } else if (!previousClicked) {
      toast.warn("wait until content generation");
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
      if (event.data.type === "storePrompts") {
        setOriginalPrompts(event.data.prompts);
      } else if (event.data.type === "contentLoaded") {
        setLoading(false);
        setTemLoader(false);
      } else if (event.data.type === "saveContentResponse") {
        setPageContents((prevContents) => ({
          ...prevContents,
          [selectedPage!]: event.data.content,
        }));
      } else if (event.data.type === "generationStatus") {
        setIsContentGenerating(event.data.isGenerating);
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
          console.log("Generated Page Updated:", updatedPages);
          return updatedPages;
        });

        if (!event.data.isGenerating) {
          toast.success("Content generation complete!");
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
      }
    };

    window.addEventListener("message", receiveMessage);
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, []);

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
              handleImportSelectedPage={() => {}}
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
            Loaded && ( // Added `Loaded` check
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
          <div className="w-full h-screen flex justify-center items-center">
            {generatedPage?.spinner && !showIframe ? (
              <Spinner />
            ) : showIframe ? (
              <iframe
                ref={iframeRef}
                src={`https://tours.mywpsite.org/${
                  pages.find((page) => page.name === selectedPage)?.slug
                }`}
                title="website"
                id="myIframe"
                onLoad={onLoadMsg}
                className={`h-full transition-fade shadow-lg rounded-lg ${
                  viewMode === "desktop"
                    ? "w-full h-full"
                    : viewMode === "tablet"
                    ? "w-2/3 h-full"
                    : "w-1/3 h-full"
                }`}
              ></iframe>
            ) : (
              <iframe
                src={iframeSrc}
                title="stored-content"
                className={`h-full transition-fade shadow-lg rounded-lg ${
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
