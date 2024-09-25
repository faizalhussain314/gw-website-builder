import React from "react";
import CachedIcon from "@mui/icons-material/Cached";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Page } from "../../../types/page.type";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tooltip from "@mui/material/Tooltip";

type Props = {
  pages: Page[];
  selectedPage: string | null;
  isContentGenerating: boolean;
  togglePage: (page: string) => void;
  handleNext: () => void;
  handleSkipPage: () => void;
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
};

const PageSelector: React.FC<Props> = ({
  pages,
  selectedPage,
  isContentGenerating,
  handlePageUpdate,
  togglePage,
  handleNext,
  handleSkipPage,
  setShowPopup,
  previousClicked,
  handlePrevious,
  handleImportSelectedPage,
  lateloader,
  updatePageStatus,
  setPages,
}) => {
  const showWarningToast = () => {
    toast.warn("Please wait while content is being generated.");
  };

  const handlePageClick = (pageName: string) => {
    togglePage(pageName);
  };

  const handleSkipClick = (pageName: string) => {
    if (isContentGenerating) {
      showWarningToast();
    } else {
      updatePageStatus(pageName, "Skipped", false);

      handleSkipPage();
    }
  };
  const handlePageChange = (slug: string, newSelectedValue: boolean) => {
    const updatedPages = pages.map((page) =>
      page.slug === slug ? { ...page, selected: newSelectedValue } : page
    );

    // Update pages in the state
    setPages(updatedPages);

    // Call updatePageStatus if necessary
    const currentPage = updatedPages.find((page) => page.slug === slug);
    if (currentPage) {
      updatePageStatus(
        currentPage.name,
        currentPage.status,
        currentPage.selected
      );
    }
  };

  const handleGeneratePageClick = () => {
    setShowPopup(true);
    lateloader(true);
  };

  return (
    <div className="p-5">
      <h2 className="text-lg font-semibold">
        Select Pages to Import (
        {pages.findIndex((page) => page.name === selectedPage) + 1}/
        {pages.length})
      </h2>
      <div className="mt-5">
        {pages.map((page) => (
          <div
            key={page.name}
            className={`rounded-lg p-3 mb-2 cursor-pointer ${
              selectedPage === page.name
                ? "border-palatinate-blue-600 border bg-palatinate-blue-50"
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
                <div className="custom-checkbox">
                  <input
                    id={`checkbox-${page.slug}`}
                    type="checkbox"
                    className="mr-4 flex items-center w-5 h-5"
                    checked={page.selected}
                    onChange={() => handlePageChange(page.slug, !page.selected)}
                    // disabled={page.status === "Skipped"}
                  />
                </div>
                <span className="font-medium text-base">{page.name}</span>
              </div>
              <div className="flex items-center">
                {page.status && (
                  <span
                    className={`ml-2 text-xs rounded-full px-2 py-.5 ${
                      page.status === "Generated"
                        ? "text-[#1E2022] bg-green-200"
                        : page.status === "Skipped"
                        ? "text-[#1E2002] bg-[#FFDCD5]"
                        : "text-black bg-[#FFDCD5]"
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

                {selectedPage === page.name ? (
                  <ExpandLessIcon
                    className="ml-2.5 text-[#1E2022] cursor-pointer"
                    onClick={() => {
                      if (isContentGenerating) {
                        showWarningToast();
                      } else {
                        handlePageClick(page.name);
                      }
                    }}
                  />
                ) : (
                  <ExpandMoreIcon
                    className="ml-2.5 text-[#1E2022] cursor-pointer"
                    onClick={() => {
                      if (isContentGenerating) {
                        showWarningToast();
                      } else {
                        handlePageClick(page.name);
                      }
                    }}
                  />
                )}
              </div>
            </div>
            {selectedPage === page.name && (
              <div className="mt-3 flex justify-evenly text-sm">
                {page.status === "Generated" ||
                page.status === "Skipped" ||
                page.name === "Blog" ||
                page.name === "Contact" ||
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
                          handleNext();
                        }
                      }}
                      disabled={isContentGenerating}
                    >
                      Keep & Next
                    </button>

                    <Tooltip title="Home page can't skip" placement="top">
                      <button
                        className={`bg-white rounded px-3 py-1.5 w-full text-palatinate-blue-600 hover:bg-palatinate-blue-600 hover:text-white ${
                          isContentGenerating || page.name == "Home"
                            ? "opacity-50 cursor-not-allowed "
                            : ""
                        }`}
                        onClick={() => handleSkipClick(page.name)}
                        disabled={isContentGenerating || page.name == "Home"}
                      >
                        Skip Page
                      </button>
                    </Tooltip>
                  </div>
                ) : (
                  <div className="w-full flex items-center gap-4">
                    <button
                      className="bg-white text-palatinate-blue-600 hover:bg-palatinate-blue-600 hover:text-white rounded px-3 py-1.5 w-full text-sm font-medium"
                      onClick={handleGeneratePageClick}
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
            )
              ? "opacity-100"
              : "opacity-50"
          }`}
          onClick={handleImportSelectedPage}
          disabled={
            !pages.every(
              (page) => page.status === "Generated" || page.status === "Skipped"
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
