import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import Caution from "../../assets/caution.svg";
import Crown from "../../assets/crown.svg";

type ContinuePopup = {
  onClose: () => void;
  alertType: "regenerate" | "websiteCreation";
  onContinue: () => void;
  onCreateFromScratch: () => void;
};

const ContinuePopup: React.FC<ContinuePopup> = ({
  onClose,
  alertType,
  onContinue,
  onCreateFromScratch,
}) => {
  let message = "";
  if (alertType === "regenerate") {
    message = "If you want to regenerate more <br /> upgrade to Pro!!!";
  } else if (alertType === "websiteCreation") {
    message =
      "You have existing data. Do you want to continue or create from scratch?";
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg text-center relative p-6 max-w-lg mx-auto">
        <button
          className="absolute right-2 top-2"
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon className="text-gray-600" />
        </button>
        <div className="flex flex-col items-center py-4 px-6">
          <div className="flex gap-1">
            <img src={Caution} alt="Caution" />
            <h2 className="text-xl font-semibold">Attention</h2>
          </div>
          <p
            className="mt-4 text-black text-lg"
            dangerouslySetInnerHTML={{ __html: message }}
          ></p>
          <div className="mt-6 flex gap-4 w-full justify-center">
            <button
              className="previous-btn flex px-[20px] py-[12px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-md  gap-3 justify-center"
              onClick={onCreateFromScratch}
            >
              Create from Scratch
            </button>
            <button
              className="tertiary px-[35px] py-[12px] text-lg sm:text-sm text-white font-semibold mt-8 sm:mt-2 rounded-md "
              onClick={onContinue}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinuePopup;
