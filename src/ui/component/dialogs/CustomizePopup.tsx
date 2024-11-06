import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import Caution from "../../../assets/caution.svg";
import Crown from "../../../assets/crown.svg";

type CustomizePopup = {
  onClose: () => void;
  alertType: "regenerate" | "websiteCreation";
  onContinue: () => void;
  onCreateFromScratch: () => void;
};

const CustomizePopup: React.FC<CustomizePopup> = ({
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
      "Your generated content will be lost. Do you want to proceed?";
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg text-center relative max-w-[350px] mx-auto px-7 py-7">
        <button
          className="absolute right-4 top-4"
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon className="text-[#868E96] text-[13px]" />
        </button>

        {/* <div className="flex items-center gap-x-2.5 w-full justify-center">
          <img src={Caution} alt="Caution" />
          <h2 className="text-[22px] leading-7 font-semibold">Attention</h2>
        </div> */}
        <p
          className="mt-5 mb-9 text-[#1E2022] font-[500] text-[20px] px-3"
          dangerouslySetInnerHTML={{ __html: message }}
        ></p>
        {alertType === "regenerate" ? (
          <button className="mt-8 text-base tertiary text-white flex items-center justify-center gap-2 px-6 py-3 rounded-lg mx-auto">
            <img src={Crown} alt="Crown" /> Upgrade Plan
          </button>
        ) : (
          <div className="mt-6 flex gap-4 w-full items-center">
            <button
              className="bg-[#EBF4FF] w-full flex px-3 py-3.5 text-base font-[500] text-[#777F87] rounded-lg justify-center"
              onClick={onContinue}
            >
              Cancel
            </button>
            <button
              className="bg-[#2E42FF] w-full px-6 py-3.5 text-base text-white font-[600] rounded-lg"
              onClick={onCreateFromScratch}
            >
              Yes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomizePopup;
