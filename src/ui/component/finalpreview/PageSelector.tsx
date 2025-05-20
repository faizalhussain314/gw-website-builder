import React, { useEffect, useRef, useState } from "react";
import { Page } from "../../../types/page.type";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tooltip from "@mui/material/Tooltip";
import { updateReduxPage } from "../../../Slice/activeStepSlice";
import { useDispatch } from "react-redux";

type Props = {
  pages: Page[];
  selectedPage: string | null;
  isContentGenerating: boolean;
  togglePage: (page: string) => void;
  handleNext: (page: string) => void;
  handleSkipPage: (page: string) => void;
  handleAddPage: (page: string) => void;
  setShowPopup: (show: boolean) => void;
  previousClicked: boolean;
  handlePageUpdate: (
    slug: string,
    newStatus: string,
    isSelected: boolean
  ) => void;
  handlePrevious: () => void;
  handleImportSelectedPage: () => void;
  lateloader: (show: boolean) => void;
  updatePageStatus: (
    pageName: string,
    status: string,
    selected: boolean
  ) => void;
  setPages: (pages: Page[]) => void;
  handleGeneratePage: () => void;
  isLoading: boolean;
  importLoad: boolean;
  afterContact: boolean;
  showGwLoader: boolean;
  generatedPageName: string[];
  planExpired: boolean;
};

const PageSelector: React.FC<Props> = ({
  pages,
  selectedPage,
  isContentGenerating,
  togglePage,
  handleNext,
  handleSkipPage,
  handleAddPage,
  handleImportSelectedPage,
  updatePageStatus,
  setPages,
  handleGeneratePage,
  isLoading,
  importLoad,
  afterContact,
  showGwLoader,
  generatedPageName,
  planExpired,
}) => {
  const [showButtons, setShowButton] = useState(true);
  const showWarningToast = () => {
    toast.warn("Please wait while we are generating.");
  };
  const showLoadingToast = () => {
    toast.warn("please wait until the page loads");
  };
  const selectedPagesCount = pages.filter((page) => page.selected).length;
  const buttonText = selectedPagesCount > 1 ? "Pages" : "Page";

  const dispatch = useDispatch();

  const isHomeGenerated = pages.some(
    (page) => page.name === "Home" && page.status === "Generated"
  );
  const allPagesUpdated = pages.every(
    (page) =>
      page.status === "Generated" ||
      page.status === "Skipped" ||
      page.status === "Added" ||
      page.status === "Not Selected"
  );

  const currentPage = pages.find((page) => page.name === selectedPage);
  const isBlogOrContactPage =
    currentPage &&
    ["blog", "contact", "contact us"].includes(currentPage.name.toLowerCase());

  const showKeepAndNext =
    currentPage &&
    ([
      "Generated",
      "Not Selected",
      "Blog",
      "Contact",
      "Contact Us",
      "Home",
    ].includes(currentPage.status) ||
      generatedPageName.includes(selectedPage));

  const handlePageClick = (pageName: string) => {
    togglePage(pageName);
  };

  const handleSkipClick = (pageName: string) => {
    if (isContentGenerating || showGwLoader) {
      showWarningToast();
    } else if (isLoading) {
      showLoadingToast();
      return;
    } else {
      updatePageStatus(pageName, "Skipped", false);

      const updatedPages = pages.map((page) =>
        page.name === pageName ? { ...page, selected: false } : page
      );

      setPages(updatedPages);
      dispatch(
        updateReduxPage({
          name: pageName,
          status: "Skipped",
          selected: false,
        })
      );

      handleSkipPage(pageName);
    }
  };
  const handlePageChange = (slug: string, newSelectedValue: boolean) => {
    const currentPage = pages.find((page) => page.slug === slug);

    if (!currentPage) {
      console.error(`Page with slug ${slug} not found.`);
      return;
    }

    const isPageGenerated = generatedPageName.includes(currentPage.name);

    const computeStatus = (page: Page): string => {
      if (newSelectedValue) {
        // user is ticking the box
        if (isPageGenerated) return "Generated";
        if (page.status === "Skipped" || !page.status) return "Added";
        return page.status;
      }

      // user is **un‑ticking** the box
      // ‑‑ keep "Generated" as‑is, clear only "Added" (or whatever else you want)
      if (page.status === "Added") return "";
      return page.status; // Generated (and everything else) stays
    };

    if (["blog", "contact", "contact-us"].includes(slug)) {
      const updatedPages = pages.map((page) =>
        page.slug === slug
          ? {
              ...page,
              selected: newSelectedValue,
              status: computeStatus(page),
            }
          : page
      );

      setPages(updatedPages);

      dispatch(
        updateReduxPage({
          name: currentPage.name,
          status: computeStatus(currentPage),
          selected: newSelectedValue,
        })
      );
      return;
    }

    const updatedPages = pages.map((page) =>
      page.slug === slug
        ? {
            ...page,
            selected: newSelectedValue,
            status: computeStatus(currentPage),
          }
        : page
    );

    setPages(updatedPages);

    dispatch(
      updateReduxPage({
        name: currentPage.name,
        status: computeStatus(currentPage),
        selected: newSelectedValue,
      })
    );
  };

  const [pageButtonStates, setPageButtonStates] = useState<
    Record<string, boolean>
  >(() =>
    pages.reduce((acc, page) => {
      acc[page.name] = true; // Default `showButtons` to true for all pages
      return acc;
    }, {} as Record<string, boolean>)
  );

  const offerButtonRef = useRef<HTMLButtonElement>(null);
  let lastAnimation = "";

  useEffect(() => {
    if (!afterContact) return;

    function bounceAnimate() {
      const offerBtn = offerButtonRef.current;
      if (!offerBtn || isContentGenerating) return;

      const currentAnimation = lastAnimation === "bounce" ? "shake" : "bounce";
      offerBtn.classList.add(currentAnimation);
      lastAnimation = currentAnimation;

      setTimeout(() => {
        offerBtn.classList.remove(currentAnimation);
      }, 1500);
    }

    const timer = setInterval(() => {
      bounceAnimate();
    }, 2500);

    return () => clearInterval(timer);
  }, [afterContact, isContentGenerating]);

  const handleToggleButtons = (pageName: string) => {
    if (selectedPage.toLowerCase() !== pageName.toLowerCase()) {
      setPageButtonStates((prev) => ({
        ...prev,
        [pageName]: true,
      }));
      return;
    }
    setPageButtonStates((prev) => ({
      ...prev,
      [pageName]: !prev[pageName],
    }));
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold">
        Select {buttonText} to Import (
        {pages.findIndex((page) => page.name === selectedPage) + 1}/
        {pages.length})
      </h2>
      <div className="mt-5">
        {pages.map((page) => (
          <div
            key={page.name}
            className={`rounded-lg p-3 mb-2 cursor-pointer transition-all duration-200 ease-in ${
              afterContact === true
                ? ""
                : selectedPage === page.name
                ? "ring-palatinate-blue-600 ring-1 bg-[#EBF4FF]"
                : ""
            }`}
            onClick={() => {
              if (isContentGenerating || showGwLoader) {
                showWarningToast();
              } else if (isLoading) {
                showLoadingToast();
                return;
              } else if (planExpired) {
                return;
              } else {
                setShowButton(true);
                handlePageClick(page.name);
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="custom-checkbox"
                  onClick={() => {
                    handleAddPage(page.name.toLowerCase());
                  }}
                >
                  <input
                    id={`checkbox-${page.slug}`}
                    type="checkbox"
                    disabled={page.name === "Home"}
                    className="mr-4 flex items-center w-4 h-4"
                    checked={page.selected}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (
                        isContentGenerating ||
                        isLoading ||
                        showGwLoader ||
                        planExpired
                      ) {
                        return;
                      }
                      e.stopPropagation();

                      handlePageChange(page.slug, e.target?.checked);
                    }}
                  />
                </div>
                <span className="font-medium text-base">{page.name}</span>
              </div>
              <div className="flex items-center">
                {page.status && (
                  <span
                    className={`ml-2 text-xs font-medium rounded-full px-2.5 py-1 text-[#1E2022] ${
                      page.status === "Generated" || page.name == "Home"
                        ? "bg-[#CDF9CD]"
                        : page.status === "Skipped" ||
                          page.status === "Not Selected"
                        ? "bg-[#FFDCD5]"
                        : page.status === "Added"
                        ? "bg-[#E4C9FF]"
                        : "bg-[#d1d5db]"
                    }`}
                  >
                    {page.status}
                  </span>
                )}
                {/* {(page.status === "Generated" || selectedPage === page.name) &&
                  page.name !== "Blog" &&
                  page.name !== "Contact" && (
                    <CachedIcon
                      className={`ml-2 text-gray-500 cursor-pointer ${
                        isContentGenerating && page.name === selectedPage
                          ? "animate-spin"
                          : ""
                      }`}
                      onClick={() => {
                        if (isContentGenerating) {
                          showWarningToast();
                        }
                      }}
                    />
                  )} */}

                <div
                  onClick={() => {
                    if (isContentGenerating) {
                      showWarningToast();
                      return;
                    } else if (planExpired) {
                      return;
                    } else {
                      handlePageClick(page.name);
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className={`${
                      pageButtonStates[page.name] &&
                      selectedPage === page.name &&
                      !afterContact
                        ? "rotate-180"
                        : pageButtonStates[page.name] && !afterContact
                        ? ""
                        : "rotate-0"
                    }  transition-all duration-200 ease-in ml-2.5`}
                    onClick={(e) => {
                      if (selectedPage === page.name) {
                        e.stopPropagation();
                      }
                      handleToggleButtons(page.name);
                    }}
                  >
                    <path
                      d="M11 3L6 8L1 3"
                      stroke="#4D586B"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
            {!showButtons || afterContact || !pageButtonStates[selectedPage]
              ? ""
              : selectedPage === page.name && (
                  <div className="mt-3 flex justify-evenly text-sm">
                    {[
                      "Generated",
                      "Not Selected",
                      "Blog",
                      "Contact",
                      "Contact Us",
                      "Home",
                    ].includes(page.status) ||
                    page.name === "Home" ||
                    page.name === "Blog" ||
                    page.name === "Contact" ||
                    page.name === "Contact Us" ||
                    generatedPageName.includes(selectedPage) ? (
                      <div className="w-full flex items-center gap-4">
                        <button
                          className={`bg-white text-[#1E2022] hover:bg-palatinate-blue-600 hover:text-white rounded px-3 py-1.5 w-full text-[14px] font-[500] ${
                            isContentGenerating || isLoading || showGwLoader
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() => {
                            if (isContentGenerating || showGwLoader) {
                              showWarningToast();
                            } else if (isLoading) {
                              showLoadingToast();
                              return;
                            } else {
                              handleNext(page.name);
                            }
                          }}
                          disabled={
                            isContentGenerating || isLoading || showGwLoader
                          } // Disable if generating, loading, or showGwLoader is true
                        >
                          Keep & Next
                        </button>
                        {page.name === "Home" ? (
                          <Tooltip title="Home page can't skip" placement="top">
                            <button
                              className={`bg-[#FFFFFF] rounded px-3 py-1.5 w-full text-[#1E2022] hover:bg-palatinate-blue-600 hover:text-white text-[14px] font-[500] ${
                                isContentGenerating || page.name === "Home"
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={
                                isContentGenerating ||
                                page.name === "Home" ||
                                isLoading
                              }
                              onClick={() => handleSkipClick(page.name)}
                            >
                              Skip Page
                            </button>
                          </Tooltip>
                        ) : (
                          <button
                            className={`bg-white text-[#1E2022] hover:bg-palatinate-blue-600 hover:text-white rounded px-3 py-1.5 w-full text-[14px] font-[500] ${
                              isContentGenerating || isLoading
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => handleSkipClick(page.name)}
                            disabled={
                              isContentGenerating || isLoading || showGwLoader
                            } // Disable if generating or loading
                          >
                            Skip Page
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="w-full flex items-center gap-4">
                        <button
                          className={`bg-white text-[#1E2022] hover:bg-palatinate-blue-600 hover:text-white rounded px-3 py-1.5 w-full text-[14px] font-[500] ${
                            !(
                              isContentGenerating ||
                              isLoading ||
                              showGwLoader ||
                              planExpired
                            )
                              ? "opacity-100"
                              : "opacity-50 cursor-not-allowed"
                          }`}
                          onClick={handleGeneratePage}
                          disabled={
                            isContentGenerating ||
                            isLoading ||
                            showGwLoader ||
                            planExpired
                          } // Disable if generating or loading
                        >
                          Generate Page
                        </button>
                        <button
                          className={`bg-white text-[#1E2022] hover:bg-palatinate-blue-600 hover:text-white rounded px-3 py-1.5 w-full text-[14px] font-[500] ${
                            !(
                              isContentGenerating ||
                              isLoading ||
                              showGwLoader ||
                              planExpired
                            )
                              ? "opacity-100"
                              : "opacity-50 cursor-not-allowed"
                          }`}
                          onClick={() => handleSkipClick(page.name)}
                          disabled={
                            isContentGenerating ||
                            isLoading ||
                            showGwLoader ||
                            planExpired
                          } // Disable if generating or loading
                        >
                          Skip Page
                        </button>
                      </div>
                    )}
                  </div>
                )}
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center absolute bottom-0 w-[85%] mb-4">
        <div className="mb-4 w-full flex justify-between">
          {/* Optional Previous/Next buttons (if any) */}
        </div>

        <button className="w-full">
          {currentPage && (
            <div>
              {allPagesUpdated ? (
                // After Contact: Show "Import Selected Page" instead of "Keep & Next"
                <button
                  className=" tertiary w-full py-3 px-8 mb-4 rounded-lg flex items-center gap-1.5 mx-auto justify-center"
                  onClick={() => {
                    if (isContentGenerating || showGwLoader) {
                      showWarningToast();
                    } else if (isLoading) {
                      showLoadingToast();
                      return;
                    } else if (planExpired) {
                      return;
                    } else {
                      handleImportSelectedPage();
                    }
                  }}
                  disabled={
                    isContentGenerating ||
                    isLoading ||
                    showGwLoader ||
                    planExpired
                  }
                >
                  Import Selected {buttonText}{" "}
                  <span>
                    {" "}
                    {importLoad && (
                      <div className="flex">
                        {" "}
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </span>
                </button>
              ) : // Default behavior: Show "Keep & Next" or "Generate Page"
              isBlogOrContactPage || showKeepAndNext ? (
                <button
                  className={`tertiary py-3 px-8 mb-4 rounded-lg w-full flex items-center gap-1.5 mx-auto justify-center ${
                    !isContentGenerating && isHomeGenerated
                      ? "opacity-100"
                      : "opacity-50"
                  } ${
                    isContentGenerating || isLoading || showGwLoader
                      ? "opacity-50"
                      : ""
                  } `}
                  onClick={() => {
                    if (isLoading) {
                      showLoadingToast();
                    } else if (isContentGenerating || showGwLoader) {
                      showWarningToast();
                    } else if (planExpired) {
                      return;
                    } else {
                      handleNext(currentPage.name);
                    }
                  }}
                  disabled={
                    isContentGenerating ||
                    isLoading ||
                    showGwLoader ||
                    planExpired
                  }
                >
                  Keep &amp; Next
                </button>
              ) : (
                <button
                  className={`tertiary py-3 px-8 mb-4 rounded-lg w-full flex items-center gap-1.5 mx-auto justify-center ${
                    !isContentGenerating && isHomeGenerated
                      ? "opacity-100"
                      : "opacity-50"
                  } ${
                    isContentGenerating ||
                    isLoading ||
                    showGwLoader ||
                    planExpired
                      ? "opacity-50"
                      : ""
                  } `}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the main onClick
                    handleGeneratePage();
                  }}
                  disabled={
                    isContentGenerating ||
                    isLoading ||
                    showGwLoader ||
                    planExpired
                  }
                >
                  Generate Page
                </button>
              )}
            </div>
          )}
          {/* {importLoad && (
            <div className="flex">
              {" "}
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            </div>
          )} */}
        </button>

        {/* Underlined Import Selected Page button is hidden afterContact is true */}
        {allPagesUpdated ? null : (
          <button
            className={`w-full text-white flex flex-col items-center justify-center outline-none rounded-lg font-medium text-center tracking-tight transition duration-300 ease-in-out ${
              !isContentGenerating && isHomeGenerated
                ? "opacity-100"
                : "opacity-50"
            } ${
              isContentGenerating || isLoading || showGwLoader || planExpired
                ? "opacity-50"
                : ""
            }`}
            ref={offerButtonRef}
            onClick={() => {
              if ((!isContentGenerating && isHomeGenerated) || planExpired) {
                handleImportSelectedPage();
              }
            }}
            disabled={
              !isHomeGenerated ||
              isContentGenerating ||
              showGwLoader ||
              planExpired
            }
          >
            <span className="flex items-center gap-1.5 w-[80%] mx-auto justify-center text-xs mt-1 underline text-[#165CFF]">
              Import Selected {buttonText}{" "}
              <span>
                {" "}
                {importLoad && (
                  <div className="flex">
                    {" "}
                    <svg
                      className="animate-spin h-5 w-5 text-[#165CFF]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  </div>
                )}
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PageSelector;
