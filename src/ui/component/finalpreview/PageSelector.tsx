import React, { useState } from "react";
import CachedIcon from "@mui/icons-material/Cached";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Page } from "../../../types/page.type";

type Props = {
  pages: Page[];
  selectedPage: string | null;
  isContentGenerating: boolean;
  handleRegenerate: () => void;
  togglePage: (page: string) => void;
  handleNext: () => void;
  handleSkipPage: () => void;
  setShowPopup: (show: boolean) => void;
  previousClicked: boolean;
  handlePrevious: () => void;
  handleImportSelectedPage: () => void;
};

const PageSelector: React.FC<Props> = ({
  pages,
  selectedPage,
  isContentGenerating,
  handleRegenerate,
  togglePage,
  handleNext,
  handleSkipPage,
  setShowPopup,
  previousClicked,
  handlePrevious,
  handleImportSelectedPage,
}) => {
  const [showInstructionPopup, setShowInstructionPopup] = useState(false);

  const handlePageClick = (pageName: string, pageStatus: string) => {
    if (
      selectedPage &&
      pages.find((page) => page.name === selectedPage)?.status === ""
    ) {
      setShowInstructionPopup(true);
    } else {
      togglePage(pageName);
    }
  };

  const handleCloseInstructionPopup = () => {
    setShowInstructionPopup(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">
        Select Pages to Import (
        {pages.findIndex((page) => page.name === selectedPage) + 1}/
        {pages.length})
      </h2>
      <div className="mt-4 p-2">
        {pages.map((page) => (
          <div
            key={page.name}
            className={`rounded-lg p-2 mb-2 ${
              selectedPage === page.name
                ? "border-palatinate-blue-500 border-2 bg-palatinate-blue-50"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="custom-checkbox">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={
                      selectedPage === page.name || page.status === "Generated"
                    }
                    onChange={() => handlePageClick(page.name, page.status)}
                    disabled={page.status === ""}
                  />
                </div>
                <span className="font-medium">{page.name}</span>
              </div>
              <div className="flex items-center">
                {page.status && (
                  <span
                    className={`ml-2 text-xs rounded-2xl px-2 ${
                      page.status === "Generated" || page.name === "Blog"
                        ? "text-green-700 bg-green-200"
                        : "text-black bg-[#FFDCD5]"
                    }`}
                  >
                    {page.status === "Generated" || page.name === "Blog"
                      ? "Generated"
                      : page.status}
                  </span>
                )}
                {(page.status === "Generated" ||
                  page.name === "Blog" ||
                  selectedPage === page.name) && (
                  <CachedIcon
                    className={`ml-2 text-gray-500 cursor-pointer ${
                      isContentGenerating && page.name === selectedPage
                        ? "animate-spin"
                        : ""
                    }`}
                    onClick={handleRegenerate}
                  />
                )}

                {selectedPage === page.name ? (
                  <ExpandLessIcon
                    className="ml-2 text-gray-500 cursor-pointer"
                    onClick={() => handlePageClick(page.name, page.status)}
                  />
                ) : (
                  <ExpandMoreIcon
                    className="ml-2 text-gray-500 cursor-pointer"
                    onClick={() => handlePageClick(page.name, page.status)}
                  />
                )}
              </div>
            </div>
            {selectedPage === page.name && (
              <div className="mt-3 flex justify-evenly text-sm">
                {page.name === "Home" ? (
                  <>
                    <button
                      className={`bg-blue-600 text-white rounded px-3 py-1 ${
                        isContentGenerating ? "opacity-50" : ""
                      }`}
                      onClick={handleNext}
                      disabled={isContentGenerating}
                    >
                      Keep & Next
                    </button>
                    <button
                      className={`bg-white text-black rounded px-3 py-1 ${
                        isContentGenerating ? "opacity-50" : ""
                      }`}
                      onClick={handleSkipPage}
                      disabled={isContentGenerating}
                    >
                      Skip Page
                    </button>
                  </>
                ) : page.status === "Generated" || page.name === "Blog" ? (
                  <>
                    <button
                      className={`bg-blue-600 text-white rounded px-3 py-1 ${
                        isContentGenerating ? "opacity-50" : ""
                      }`}
                      onClick={handleNext}
                      disabled={isContentGenerating}
                    >
                      Keep & Next
                    </button>
                    <button
                      className={`bg-white text-black rounded px-3 py-1 ${
                        isContentGenerating ? "opacity-50" : ""
                      }`}
                      onClick={handleSkipPage}
                      disabled={isContentGenerating}
                    >
                      Skip Page
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-palatinate-blue-600 text-white rounded px-3 py-1"
                      onClick={() => setShowPopup(true)}
                    >
                      Generate Page
                    </button>
                    <button
                      className="bg-white text-black rounded px-3 py-1"
                      onClick={handleSkipPage}
                    >
                      Skip Page
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center absolute bottom-0 w-[85%] mb-4">
        <div className="mb-4 w-full flex justify-between">
          <button
            className={`w-full py-3 px-6 rounded-md mr-2 border-2 ${
              previousClicked
                ? "border-palatinate-blue-500 text-palatinate-blue-500"
                : "border-[#88898A] text-[#88898A]"
            }`}
            onClick={handlePrevious}
          >
            Previous
          </button>
          <button
            className={`bg-white w-full text-palatinate-blue-500 border-palatinate-blue-500 border-2 py-3 px-8 rounded-md ${
              isContentGenerating ? "opacity-50" : ""
            }`}
            onClick={handleNext}
            disabled={isContentGenerating}
          >
            Next
          </button>
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
      {showInstructionPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg text-center absolute p-4">
            <h2 className="text-lg font-semibold mb-4">Action Required</h2>
            <p className="mb-4">
              Please click "Keep & Next" or "Skip Page" to proceed.
            </p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleCloseInstructionPopup}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageSelector;
