import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { ImportWarning, UpgradePopup, CustomizePopup } from "@dialog";

interface PreviewPopupsProps {
  showPopup: boolean;
  selectedPage: string | null;
  pages: any[];
  loaded: boolean;
  onClosePopup: () => void;
  onGeneratePage: () => void;
  showImportWarning: boolean;
  onCloseImportWarning: () => void;
  showImportWarningDialogue: boolean;
  onCloseWarning: () => void;
  onContinueImport: () => void;
  isImportLoading: boolean;
  showUpgradePopup: boolean;
  onCloseUpgradePopup: () => void;
  resetPopup: boolean;
  onCloseResetPopup: () => void;
  onContinueReset: () => void;
  buttonLoader: boolean;
  onCreateFromScratch: () => void;
}

const PreviewPopups: React.FC<PreviewPopupsProps> = ({
  showPopup,
  selectedPage,
  pages,
  loaded,
  onClosePopup,
  onGeneratePage,
  showImportWarning,
  onCloseImportWarning,
  showImportWarningDialogue,
  onCloseWarning,
  onContinueImport,
  isImportLoading,
  showUpgradePopup,
  onCloseUpgradePopup,
  resetPopup,
  onCloseResetPopup,
  onContinueReset,
  buttonLoader,
  onCreateFromScratch,
}) => {
  const shouldShowGeneratePopup = () => {
    return (
      showPopup &&
      selectedPage !== "Blog" &&
      pages.find((p) => p.name === selectedPage)?.status !== "Generated" &&
      loaded &&
      selectedPage !== "Contact"
    );
  };

  return (
    <>
      {/* Generate Page Popup */}
      {shouldShowGeneratePopup() && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="absolute text-center bg-white rounded-lg shadow-lg">
            <div className="absolute right-0">
              <CloseIcon
                className="top-0 m-2 cursor-pointer"
                onClick={onClosePopup}
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
                onClick={onGeneratePage}
              >
                Generate this Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Warning */}
      {showImportWarning && (
        <UpgradePopup onClose={onCloseImportWarning} alertType="importLimit" />
      )}

      {/* Import Warning Dialogue */}
      {showImportWarningDialogue && (
        <ImportWarning
          onClose={onCloseWarning}
          continueImport={onContinueImport}
          isimportLoading={isImportLoading}
        />
      )}

      {/* Upgrade Popup */}
      {showUpgradePopup && (
        <UpgradePopup onClose={onCloseUpgradePopup} alertType="regenerate" />
      )}

      {/* Reset Popup */}
      {resetPopup && (
        <CustomizePopup
          onClose={onCloseResetPopup}
          alertType="websiteCreation"
          onContinue={onContinueReset}
          buttonLoader={buttonLoader}
          onCreateFromScratch={onCreateFromScratch}
        />
      )}
    </>
  );
};

export default PreviewPopups;
