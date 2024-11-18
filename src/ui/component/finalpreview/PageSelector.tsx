import React, { useEffect, useRef } from "react";
import CachedIcon from "@mui/icons-material/Cached";
import { Page } from "../../../types/page.type";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tooltip from "@mui/material/Tooltip";
import { updateReduxPage } from "../../../Slice/activeStepSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";

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
};

const PageSelector: React.FC<Props> = ({
  pages,
  selectedPage,
  isContentGenerating,
  handlePageUpdate,
  togglePage,
  handleNext,
  handleSkipPage,
  handleAddPage,
  setShowPopup,
  previousClicked,
  handlePrevious,
  handleImportSelectedPage,
  lateloader,
  updatePageStatus,
  setPages,
  handleGeneratePage,
  isLoading,
  importLoad,
}) => {
  const showWarningToast = () => {
    toast.warn("Please wait while content is being generated.");
  };

  const dispatch = useDispatch();

  const currentPages = useSelector((state: RootState) => state.userData.pages);

  const handlePageClick = (pageName: string) => {
    togglePage(pageName);
  };

  const handleSkipClick = (pageName: string) => {
    if (isContentGenerating) {
      showWarningToast();
      return;
    } else {
      // Update page status to 'Skipped' and set selected to false
      updatePageStatus(pageName, "Skipped", false);

      // Directly update pages without using an updater function
      const updatedPages = pages.map((page) =>
        page.name === pageName ? { ...page, selected: false } : page
      );

      // Set the updated pages array
      setPages(updatedPages);
      dispatch(
        updateReduxPage({
          name: pageName,
          status: "Skipped",
          selected: false,
        })
      );
      // Proceed to the next page
      handleSkipPage(pageName);
    }
  };
  const handlePageChange = (slug: string, newSelectedValue: boolean) => {
    const currentPage = pages.find((page) => page.slug === slug);

    // Always keep Home page selected
    if (currentPage?.name === "Home") {
      const updatedPages = pages.map((page) =>
        page.slug === slug
          ? { ...page, selected: true, status: "Generated" }
          : page
      );
      setPages(updatedPages);
      return;
    }

    // For other pages, update selection and reset status if deselected
    const updatedPages = pages.map((page) =>
      page.slug === slug
        ? {
            ...page,
            selected: newSelectedValue,
            status: newSelectedValue ? page.status : "",
          }
        : page
    );

    setPages(updatedPages);

    // Update Redux state
    dispatch(
      updateReduxPage({
        name: currentPage.name,
        status: newSelectedValue ? currentPage.status : "",
        selected: newSelectedValue,
      })
    );
  };

  const handleGeneratePageClick = () => {
    setShowPopup(true);
    lateloader(true);
  };
  const offerButtonRef = useRef<HTMLButtonElement>(null);
  let lastAnimation = "";
  useEffect(() => {
    function bouceAnimate() {
      const offerBtn = offerButtonRef.current;
      if (!offerBtn || isContentGenerating !== false) return;

      const currentAnimation = lastAnimation === "bounce" ? "shake" : "bounce";
      offerBtn?.classList?.add(currentAnimation);
      lastAnimation = currentAnimation;
      setTimeout(() => {
        offerBtn?.classList?.remove(currentAnimation);
      }, 1500);
    }

    const timer = setInterval(() => {
      bouceAnimate();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold">
        Select Pages to Import (
        {pages.findIndex((page) => page.name === selectedPage) + 1}/
        {pages.length})
      </h2>
      <div className="mt-5">
        {pages.map((page) => (
          <div
            key={page.name}
            className={`rounded-lg p-3 mb-2 cursor-pointer transition-all duration-200 ease-in ${
              selectedPage === page.name
                ? "ring-palatinate-blue-600 ring-1 bg-[#EBF4FF]"
                : ""
            }`}
            onClick={() => {
              if (isContentGenerating) {
                showWarningToast();
              } else {
                handlePageClick(page.name);
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="custom-checkbox"
                  onClick={() => {
                    handleAddPage(page.name);
                  }}
                >
                  <input
                    id={`checkbox-${page.slug}`}
                    type="checkbox"
                    disabled={page.name === "Home"}
                    className="mr-4 flex items-center w-4 h-4"
                    checked={
                      page.name === "Home"
                        ? true
                        : page.status &&
                          page?.status != "Skipped" &&
                          page?.status != "Not Selected"
                        ? true
                        : false
                    }
                    onClick={(e: any) => {
                      handlePageChange(page.slug, e?.target?.checked);
                    }} // Make sure the slug is passed to toggle selection
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
                      selectedPage === page.name ? "rotate-180 " : "-rotate-0"
                    } transition-all duration-200 ease-in ml-2.5`}
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
            {selectedPage === page.name && (
              <div className="mt-3 flex justify-evenly text-sm">
                {[
                  "Generated",
                  "Skipped",
                  "Not Selected",
                  "Blog",
                  "Contact",
                  "Contact Us",
                  "Home",
                ].includes(page.status) ||
                page.name === "Home" ||
                page.name === "Blog" ||
                page.name === "Contact" ||
                page.name === "Contact Us" ? (
                  <div className="w-full flex items-center gap-4">
                    <button
                      className={`bg-white text-[#1E2022] hover:bg-palatinate-blue-600 hover:text-white rounded px-3 py-1.5 w-full text-[14px] font-[500] ${
                        isContentGenerating ? "opacity-50" : ""
                      }`}
                      onClick={() => {
                        if (isContentGenerating) {
                          showWarningToast();
                        } else {
                          handleNext(page.name);
                        }
                      }}
                      disabled={isContentGenerating || isLoading}
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
                          isContentGenerating ? "opacity-50" : ""
                        }`}
                        onClick={() => handleSkipClick(page.name)}
                        disabled={isContentGenerating || isLoading}
                      >
                        Skip Page
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="w-full flex items-center gap-4">
                    <button
                      className="bg-white text-[#1E2022] hover:bg-palatinate-blue-600 hover:text-white rounded px-3 py-1.5 w-full text-[14px] font-[500]"
                      onClick={handleGeneratePage}
                      disabled={isLoading}
                    >
                      Generate Page
                    </button>
                    <button
                      className="bg-white text-[#1E2022] hover:bg-palatinate-blue-600 hover:text-white rounded px-3 py-1.5 w-full text-[14px] font-[500]"
                      onClick={() => handleSkipClick(page.name)}
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
          {/* <button
            className={`w-full py-3 px-6 rounded-md mr-2 border-2 ${
              previousClicked
                ? "border-palatinate-blue-500 text-palatinate-blue-500"
                : "border-[#88898A] text-[#88898A]"
            }`}
            onClick={() => {
              if (isContentGenerating) {
                showWarningToast();
              } else {
                handlePrevious();
              }
            }}
          >
            Previous
          </button>
          <button
            className={`bg-white w-full text-palatinate-blue-500 border-palatinate-blue-500 border-2 py-3 px-8 rounded-md ${
              isContentGenerating ? "opacity-50" : ""
            }`}
            onClick={() => {
              if (isContentGenerating) {
                showWarningToast();
              } else {
                handleNext();
              }
            }}
            disabled={isContentGenerating}
          >
            Next
          </button> */}
        </div>

        <button
          className={`tertiary w-full text-white py-3 px-8 rounded-md mb-4 flex items-center justify-center outline-none rounded-lg font-medium text-center tracking-tight transition duration-300 ease-in-out ${
            !isContentGenerating ? "opacity-100" : "opacity-50"
          }`}
          ref={offerButtonRef}
          onClick={() => {
            isContentGenerating === false ? handleImportSelectedPage() : "";
          }}
        >
          <span className="flex items-center gap-1.5 w-[80%] mx-auto justify-center">
            Import Selected Page
          </span>
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
        </button>
      </div>
    </div>
  );
};

export default PageSelector;
