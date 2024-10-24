import React from "react";
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
  handleAddPage: (page:string) => void;
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
}) => {
  const showWarningToast = () => {
    toast.warn("Please wait while content is being generated.");
  };

  const dispatch = useDispatch();

  const currentPages = useSelector(
    (state: RootState) => state.userData.pages
  );

  const handlePageClick = (pageName: string) => {
    togglePage(pageName);
  };

  const handleSkipClick = (pageName: string) => {
    if (isContentGenerating) {
      showWarningToast();
      return;
    } else {
      // Update page status to 'Skipped' and set selected to false
      console.log("skip event triggered", pages);
      updatePageStatus(pageName, "Skipped", false);

      // Directly update pages without using an updater function
      const updatedPages = pages.map((page) =>
        page.name === pageName ? { ...page, selected: false } : page
      );

      // Set the updated pages array
      setPages(updatedPages);

      // Proceed to the next page
      handleSkipPage(pageName);
    }
  };
  const handlePageChange = (slug: string, newSelectedValue: boolean) => {
    const currentPage = pages.find((page) => page.slug === slug);

    // Always keep Home page selected
    if (currentPage?.name === "Home") {
      const updatedPages = pages.map((page) =>
        page.slug === slug ? { ...page, selected: true } : page
      );
      setPages(updatedPages);
      return;
    }

    // Allow other pages to be selected or deselected
    const updatedPages = pages.map((page) =>
      page.slug === slug ? { ...page, selected: newSelectedValue } : page
    );

    setPages(updatedPages);
    dispatch(
      updateReduxPage({
        name: currentPage.name,
        status: currentPage.status,
        selected: newSelectedValue,
      })
    );
  };

  const handleGeneratePageClick = () => {
    setShowPopup(true);
    lateloader(true);
  };

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
                ? "ring-palatinate-blue-600 ring-1 bg-[#F8FBFE]"
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
                <div className="custom-checkbox" onClick={() => {handleAddPage(page.name);}}>
                  <input
                    id={`checkbox-${page.slug}`}
                    type="checkbox"
                    className="mr-4 flex items-center w-4 h-4"
                    checked={page.name === "Home" ? true : page.selected === true ? true : page.status ? true : false}
                    onChange={() => handlePageChange(page.slug, !page.selected)} // Make sure the slug is passed to toggle selection
                  />
                </div>
                <span className="font-medium text-base">{page.name}</span>
              </div>
              <div className="flex items-center">
                {page.status && (
                  <span
                    className={`ml-2 text-xs font-medium rounded-full px-2.5 py-1 text-[#1E2022] ${
                      page.status === "Generated"
                        ? "bg-[#CDF9CD]"
                        : page.status === "Skipped"
                        ? "bg-[#FFDCD5]"
                        : page.status === "Added"
                        ? "bg-[#E4C9FF]"
                        : "bg-[#d1d5db]"
                    }`}
                  >
                    {page.name == "Home" ? "Generated" : page.status}
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
                {page.status === "Generated" ||
                page.status === "Added" ||
                page.status === "Skipped" ||
                page.name === "Blog" ||
                page.name === "Contact" ||
                page.name === "Contact Us" ||
                page.name === "Home" ? (
                  <div className="w-full flex items-center gap-4">
                    <button
                      className={`bg-white text-palatinate-blue-600 hover:bg-palatinate-blue-600 hover:text-white rounded px-3 py-1.5 w-full text-sm font-medium ${
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
                          className={`bg-white rounded px-3 py-1.5 w-full text-palatinate-blue-600 hover:bg-palatinate-blue-600 hover:text-white ${
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
                        className={`bg-white text-palatinate-blue-600 hover:bg-palatinate-blue-600 hover:text-white rounded px-3 py-1.5 w-full text-sm font-medium ${
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
                      className="bg-white text-palatinate-blue-600 hover:bg-palatinate-blue-600 hover:text-white rounded px-3 py-1.5 w-full text-sm font-medium"
                      onClick={handleGeneratePage}
                      disabled={isLoading}
                    >
                      Generate page
                    </button>
                    <button
                      className="bg-white text-palatinate-blue-600 hover:bg-palatinate-blue-600 hover:text-white rounded px-3 py-1.5 w-full text-sm font-medium"
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
          className={`tertiary w-full text-white py-3 px-8 rounded-md mb-4 ${
            pages.every(
              (page) => page.status === "Generated" || page.status === "Skipped"
            ) ||
            pages.every(
              (page) => page.selected === true || page.selected === false
            )
              ? "opacity-100"
              : "opacity-50"
          }`}
          onClick={handleImportSelectedPage}
          disabled={
            !pages.every(
              (page) => page.selected === true || page.selected === false
            )
          }
        >
          Import Selected Page
        </button>
      </div>
    </div>
  );
};

export default PageSelector;
