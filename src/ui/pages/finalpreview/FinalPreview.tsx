// FinalPreview.tsx - Refactored Component with Services and Hooks
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Page } from "../../../types/page.type";
import { PageSelector, ViewModeSwitcher } from "@components";
import {
  setColor,
  setFont,
  updateReduxPage,
} from "../../../Slice/activeStepSlice";
import { updateIframeLogo, sendIframeMessage } from "@utils";
import { usePostHog } from "posthog-js/react";
import { GeneratedPageState } from "types/generatedContent.type.ts";

// Import our services and hooks
import { PageService } from "@api/wordpress-api/final-preview/pageService";
import { ValidationService } from "@api/wordpress-api/final-preview/validationService";
import { ImportService } from "@api/wordpress-api/final-preview/importService";
import { usePageManagement } from "@hooks/final-preview/usePageManagement";
import { useIframeManagement } from "@hooks/final-preview/useIframeManagement";

// Import our components
import PreviewHeader from "@components/finalpreview/PreviewHeader";
import PreviewIframe from "@components/finalpreview/PreviewIframe";
import LoadingOverlays from "@components/finalpreview/LoadingOverlays";
import PreviewPopups from "@components/finalpreview/PreviewPopups";

const Mode = import.meta.env.VITE_MODE;

const FinalPreview: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const posthog = usePostHog();

  // Initialize services
  const pageService = useMemo(() => new PageService(), []);
  const validationService = useMemo(() => new ValidationService(), []);
  const importService = useMemo(() => new ImportService(), []);

  // Redux selectors
  const reduxPages = useSelector(
    (state: RootState) => state.userData?.templateList.pages
  );
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
  const stepDescription = useSelector(
    (state: RootState) => state.userData.description2
  );
  const templateName = useSelector(
    (state: RootState) => state.userData.templatename
  );
  const template_id = useSelector(
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
  const currentPages = useSelector((state: RootState) => state.userData.pages);
  const initialColor = useSelector((state: RootState) => ({
    primaryColor: state.userData.style.defaultColor.primary,
    secondaryColor: state.userData.style.defaultColor.secondary,
  }));

  const validReduxPages: Page[] = useMemo(() => {
    const pages = reduxPages || [];
    return pages.map((page) => ({
      name: page.title,
      status: "",
      slug: page.slug,
      selected: false,
    }));
  }, [reduxPages]);

  // Use custom hooks
  const {
    pages,
    setPages,
    selectedPage,
    setSelectedPage,
    updatePageStatus,
    handlePageNavigation,
    selectNextPage,
  } = usePageManagement([
    { name: "Home", status: "", slug: "home", selected: false },
    { name: "About Us", status: "", slug: "about", selected: false },
    { name: "Services", status: "", slug: "service", selected: false },
    { name: "Blog", status: "", slug: "blog", selected: false },
    { name: "Contact Us", status: "", slug: "contact-us", selected: false },
  ]);

  const {
    iframeSrc,
    iframeRef,
    updateIframeSrc,
    updateContactDetails,
    sendNonClickable,
  } = useIframeManagement();

  // Local state
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState("desktop");
  const [isLoading, setIsLoading] = useState(true);
  const [isContentGenerating, setIsContentGenerating] = useState(false);
  const [isPageGenerated, setIsPageGenerated] = useState(false);
  const [showGwLoader, setShowGwLoader] = useState(false);
  const [generatedPage, setGeneratedPage] = useState<GeneratedPageState>({
    spinner: false,
  });
  const [generatedPageName, setGeneratedPageName] = useState<string[]>([]);

  // Popup states
  const [showPopup, setShowPopup] = useState(false);
  const [resetPopup, setresetPopup] = useState(false);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [showImportWarning, setshowImportWarning] = useState(false);
  const [showImageWarning, setshowImageWarning] = useState(false);
  const [showImportWarningDialouge, setshowImportWarningDialouge] =
    useState(false);

  // Other states
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [previousClicked, setPreviousClicked] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [Loaded, setLoaded] = useState(false);
  const [findIndex, setfindIndex] = useState<number>();
  const [importLoad, setImportLoad] = useState(false);
  const [apiIssue, setapiIssue] = useState(false);
  const [wordCountAlert, setwordCountAlert] = useState(false);
  const [afterContact, setAfterContact] = useState(false);
  const [isImportLoading, setIsImportLoading] = useState(false);
  const [updateCountError, setupdateCountError] = useState(false);
  const [issue, setIssue] = useState(false);
  const [planExpired, setPlanExpired] = useState(false);

  // Utility functions
  const toggleDropdown = () => setIsOpen(!isOpen);
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
  }, [selectedPage, updatePageStatus]);

  // Main iframe load handler
  const onLoadMsg = async () => {
    setwordCountAlert(false);
    setIsContentGenerating(false);
    setIsLoading(true);
    setLoaded(true);

    if (!selectedPage || !templateName) {
      console.warn("Required parameters not available. Waiting for values...");
      return;
    }

    const currentPageIndex = pages.findIndex(
      (page) => page.name === selectedPage
    );
    setfindIndex(currentPageIndex);

    // Update contact details and setup iframe
    updateContactDetails(
      contactDetails?.email || "",
      contactDetails?.phoneNumber || "",
      contactDetails?.address || ""
    );
    sendNonClickable();

    const iframe = iframeRef.current;
    if (!iframe) return;

    // Apply styling
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

    // Update logo or business name
    if (logoUrl) {
      updateIframeLogo(logoUrl, logoWidth);
    } else if (businessName) {
      sendIframeMessage("bussinessName", businessName);
    }

    // Handle page content loading
    await handlePageContentLoading();

    if (!isContentGenerating) {
      setIsLoading(false);
    }
  };

  // Handle page content loading logic
  const handlePageContentLoading = async () => {
    if (
      selectedPage &&
      generatedPage[selectedPage] &&
      Array.isArray(generatedPage[selectedPage])
    ) {
      const existingContent = (generatedPage[selectedPage] as string[])[0];
      updateIframeSrc(existingContent);
      return;
    }

    if (selectedPage && !generatedPage[selectedPage]) {
      setwordCountAlert(false);

      // Try to fetch existing content
      const fetchResult = await pageService.fetchAndStorePageData(
        selectedPage,
        templateName,
        "5.5"
      );

      if (fetchResult.success && fetchResult.content) {
        setGeneratedPage((prevPages: GeneratedPageState) => ({
          ...prevPages,
          spinner: false,
          [selectedPage]: { 0: fetchResult.content },
        }));
        updatePageStatus(selectedPage, "Generated", true);
        updateIframeSrc(fetchResult.content);
        setShowGwLoader(false);
        setIsPageGenerated(true);
        return;
      }

      // If no existing content and it's Home page, trigger generation
      if (
        !fetchResult.success &&
        selectedPage === "Home" &&
        pages[0].status !== "Generated"
      ) {
        await handleHomePageGeneration();
      }
    }
  };

  // Home page generation logic
  const handleHomePageGeneration = async () => {
    setShowPopup(false);
    setIsLoading(false);
    setShowGwLoader(true);

    try {
      const wordCountResult = await validationService.checkWordCount();

      if (wordCountResult.success && wordCountResult.status === true) {
        const imageCount = await validationService.checkImageCount(
          selectedPage,
          template_id
        );

        if (!imageCount) {
          setIsLoading(false);
          setIsContentGenerating(false);
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
              templateName,
              pageName: currentPage.slug,
              bussinessname: businessName,
              description: Description,
              stepdescription: stepDescription,
              template_id: templateList?.id,
              bearer_token,
              primaryColor: Color.primary || initialColor.primaryColor,
              secondaryColor: Color.secondary || initialColor.secondaryColor,
              stagging: Mode === "staging",
              dark_theme: templateList.dark_theme,
            },
            "*"
          );
        }
      } else if (wordCountResult.status === false) {
        setIsContentGenerating(false);
        setwordCountAlert(true);
      } else if (
        ["pending", "canceled", "overdue", "expired"].includes(
          wordCountResult.status as string
        )
      ) {
        setPlanExpired(true);
      }
    } catch (error) {
      console.error("Error while calling the word count API:", error);
      setapiIssue(true);
    } finally {
      setIsLoading(false);
      setIsContentGenerating(false);
    }
  };

  // Page navigation
  const togglePage = (page: string) => {
    if (page === selectedPage) return;

    setAfterContact(false);
    setSelectedPage(page);
    setwordCountAlert(false);

    const existingContent = generatedPage[page];
    if (existingContent) {
      updateIframeSrc(existingContent[0]);
      if (showImageWarning) setshowImageWarning(false);
      setIsPageGenerated(true);
      setShowGwLoader(false);
    } else {
      setIsPageGenerated(false);
      setIsLoading(true);
    }
  };

  // Navigation handlers
  const handleNext = (page: string) => {
    setIsLoading(true);
    handlePageNavigation("next", page, currentPages);
    selectNextPage(page);
  };

  const handleSkipPage = (page: string) => {
    handlePageNavigation("skip", page, currentPages);
    selectNextPage(page);
  };

  const handleAddPage = (page: string) => {
    handlePageNavigation("add", page, currentPages);
    selectNextPage(page);
  };

  const handlePrevious = () => {
    if (!previousClicked && !isContentGenerating) {
      navigate("/custom-design");
      return;
    }
    if (!previousClicked) {
      showWarningToast();
      return;
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

  // Import handlers
  const handleImportSelectedPage = async () => {
    posthog?.capture("import selected page", {
      installedTemplate: templateList.name,
    });
    setImportLoad(true);

    try {
      const siteCountResult = await validationService.checkSiteCount();

      if (siteCountResult.success && siteCountResult.status === true) {
        const hasPreviousImport = await validationService.checkPreviousImport();

        if (hasPreviousImport) {
          setshowImportWarningDialouge(true);
        } else {
          setImportLoad(false);
          navigate("/processing", { state: { pageName: selectedPage } });
        }
      } else if (
        ["pending", "canceled", "overdue", "expired"].includes(
          siteCountResult.status as string
        )
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
      await importService.deleteThemeAndPlugins();
      await importService.deleteAllPosts();

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

  // Other handlers
  const handleGeneratePage = () => handleHomePageGeneration();
  const handleContinue = () => setresetPopup(false);
  const handleCustomize = () => deleteGeneratedPage();

  const deleteGeneratedPage = async () => {
    setButtonLoader(true);
    dispatch(setColor({ primary: "", secondary: "" }));
    dispatch(setFont({ primary: "", secondary: "" }));

    try {
      await importService.deleteStyle();
      const response = await importService.deletePage();
      if (response) {
        setButtonLoader(false);
        navigate("/custom-design");
        setresetPopup(false);
      }
    } catch (error) {
      console.error("Failed to delete pages:", error);
      setButtonLoader(false);
    }
  };

  const handleClosePopup = () => setShowPopup(false);
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

  useEffect(() => {
    const receiveMessage = (event: MessageEvent) => {
      console.log("Received iframe message:", event.data);
    };

    window.addEventListener("message", receiveMessage);

    // return () => {
    //   window.removeEventListener("message", receiveMessage);
    // };
  }, []);

  // Effects
  useEffect(() => {
    const fetchStatus = async () => {
      const updatedPages = await pageService.fetchGeneratedPageStatus();
      if (updatedPages.length > 0) {
        setPages(updatedPages);
        const nextPage = updatedPages.find(
          (page) => page.status !== "Generated" && page.status !== "Skipped"
        );
        if (nextPage) {
          setSelectedPage(nextPage.name);
        }
      }
    };
    fetchStatus();
  }, [pageService, setPages, setSelectedPage]);

  useEffect(() => {
    if (validReduxPages.length > 0) {
      setPages(validReduxPages);
    }
  }, [validReduxPages, setPages]);

  useEffect(() => {
    const pageNames = Object.keys(generatedPage).filter(
      (key) => key !== "spinner" && typeof generatedPage[key] === "object"
    );
    setGeneratedPageName(pageNames);
  }, [generatedPage]);

  // Message handling effect
  // Fixed Message handling effect with if-else conditions
  useEffect(() => {
    const calculateWordCount = (contentObject: object) => {
      let totalWordCount = 0;
      Object.values(contentObject).forEach((value) => {
        const wordCount = value.split(/\s+/).filter((word) => word).length;
        totalWordCount += wordCount;
      });
      return totalWordCount;
    };

    const receiveMessage = (event: MessageEvent) => {
      // Log the entire event data to debug
      console.log("Received iframe message:", event.data);

      // Check if event.data exists and has type
      if (!event.data || !event.data.type) {
        console.log("Invalid message received:", event.data);
        return;
      }

      const messageType = event.data.type;

      // Pre-calculate values that might be needed
      const pageName = selectedPage || "";
      const htmlContent = event.data.content;
      const currentPageIndex = pages.findIndex(
        (page) => page?.name === selectedPage
      );
      const pageNameForContent = selectedPage!;

      // Handle different message types with if-else
      if (messageType === "contentLoaded") {
        console.log("Content loaded message received");
        setIsLoading(false);
      } else if (messageType === "generationStatus") {
        console.log("generationStatus message received:", event.data);

        if (event.data.isGenerating) {
          console.log("Generation started");
          setIsContentGenerating(true);
          setIsLoading(false);
        } else {
          console.log("Generation stopped");
          setIsContentGenerating(false);
        }

        setIsLoading(event.data.isGenerating);
        if (event.data.isGenerating) {
          setShowGwLoader(false);
        }
      } else if (messageType === "somethingwentWrong") {
        console.log("Something went wrong message received");
        setIssue(true);
      } else if (messageType === "generatedContent") {
        console.log("Generated content message received");

        if (apiIssue) {
          console.log("API issue detected, skipping content generation");
          return;
        }

        if (currentPageIndex >= 0) {
          dispatch(
            updateReduxPage({
              name: pages[currentPageIndex].name,
              status: "Generated",
              selected: true,
            })
          );
        }

        setGeneratedPage((prevPages: GeneratedPageState) => ({
          ...prevPages,
          spinner: false,
          [pageName]: { 0: htmlContent },
        }));

        pageService.storeHtmlContent(pageName, htmlContent, templateName);
      } else if (messageType === "oldNewContent") {
        console.log("Old new content message received");

        posthog?.capture("Generated Page", { Generatedpage: selectedPage });

        if (updateCountError) {
          console.log("Update count error detected, skipping");
          return;
        }

        if (event.data.content) {
          const wordCount = calculateWordCount(event.data.content);
          pageService.storeOldNewContent(
            pageNameForContent,
            event.data.content,
            wordCount,
            templateList.id,
            templateName
          );
        }
      } else if (messageType === "streamingError") {
        console.log("Streaming error message received");
        setupdateCountError(true);
        setapiIssue(true);
      } else if (messageType === "oldNewImages") {
        console.log("Old new images message received");

        try {
          if (event.data.images) {
            const cleanedImageMapping = Object.values(event.data.images).reduce<
              Record<string, string>
            >(
              (acc, mapping) => ({
                ...acc,
                ...(mapping as Record<string, string>),
              }),
              {}
            );

            importService
              .saveGeneratedImage(
                selectedPage!,
                templateName,
                cleanedImageMapping
              )
              .then(() => showSuccessToast())
              .catch((error) =>
                console.error("Error saving image data:", error)
              );
          }
        } catch (error) {
          console.error("Error saving image data:", error);
        }
      } else {
        console.log("Unknown message type received:", messageType, event.data);
      }
    };

    window.addEventListener("message", receiveMessage);
    return () => window.removeEventListener("message", receiveMessage);
  }, [
    selectedPage,
    pages,
    dispatch,
    showSuccessToast,
    posthog,
    updateCountError,
    apiIssue,
    pageService,
    templateName,
    templateList.id,
    importService,
  ]);

  // Save pages effect
  useEffect(() => {
    const storePagesInDB = async () => {
      try {
        await importService.savePagesToDB(pages, findIndex);
      } catch (error) {
        console.error("Failed to store pages:", error);
      }
    };
    storePagesInDB();
  }, [pages, findIndex, importService]);

  // Prevent unload during generation
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isContentGenerating || showGwLoader) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isContentGenerating, showGwLoader]);

  return (
    <div className="h-screen flex font-[inter] w-screen">
      <div className="w-[23%] h-screen lg:w-[30%]">
        <aside className="fixed min-h-screen z-10">
          <PreviewHeader onBackClick={() => setresetPopup(true)} />
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
        </aside>
      </div>

      <div className="w-[77%] flex-last bg-[#F9FCFF] overflow-x-hidden relative">
        <main className="px-12">
          <PreviewPopups
            showPopup={showPopup}
            selectedPage={selectedPage}
            pages={pages}
            loaded={Loaded}
            onClosePopup={handleClosePopup}
            onGeneratePage={handleGeneratePage}
            showImportWarning={showImportWarning}
            onCloseImportWarning={() => setshowImportWarning(false)}
            showImportWarningDialogue={showImportWarningDialouge}
            onCloseWarning={handleCloseWarning}
            onContinueImport={handleContinueImport}
            isImportLoading={isImportLoading}
            showUpgradePopup={showUpgradePopup}
            onCloseUpgradePopup={() => setShowUpgradePopup(false)}
            resetPopup={resetPopup}
            onCloseResetPopup={() => setresetPopup(false)}
            onContinueReset={handleContinue}
            buttonLoader={buttonLoader}
            onCreateFromScratch={handleCustomize}
          />

          <div className="relative flex justify-between my-4 text-left">
            <ViewModeSwitcher
              isOpen={isOpen}
              viewMode={viewMode}
              toggleDropdown={toggleDropdown}
              handleViewChange={handleViewChange}
            />
          </div>

          <div className="relative flex items-center justify-center w-full h-screen">
            <LoadingOverlays
              showGwLoader={showGwLoader}
              isLoading={isLoading}
              isContentGenerating={isContentGenerating}
              showImageWarning={showImageWarning}
              onCloseImageWarning={() => setshowImageWarning(false)}
              apiIssue={apiIssue}
              wordCountAlert={wordCountAlert}
              planExpired={planExpired}
              issue={issue}
            />

            {/* Generated Content Iframe */}
            {generatedPage[selectedPage!] && isPageGenerated && (
              <PreviewIframe
                ref={iframeRef}
                src={iframeSrc}
                onLoad={onLoadMsg}
                isLoading={isLoading}
                isContentGenerating={isContentGenerating}
                viewMode={viewMode}
              />
            )}

            {/* Non-Generated Content Iframe */}
            {(!generatedPage[selectedPage!] || !isPageGenerated) && (
              <PreviewIframe
                ref={iframeRef}
                src={`${currentUrl}/${
                  pages.find((page) => page.name === selectedPage)?.slug
                }`}
                onLoad={onLoadMsg}
                isLoading={isLoading}
                isContentGenerating={isContentGenerating}
                viewMode={viewMode}
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
