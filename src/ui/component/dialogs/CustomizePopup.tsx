import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import Caution from "../../../assets/caution.svg";
import Crown from "../../../assets/crown.svg";

type CustomizePopup = {
  onClose: () => void;
  alertType: "regenerate" | "websiteCreation";
  onContinue: () => void;
  onCreateFromScratch: () => void;
  buttonLoader: boolean;
};

const CustomizePopup: React.FC<CustomizePopup> = ({
  onClose,
  alertType,
  onContinue,
  onCreateFromScratch,
  buttonLoader,
}) => {
  let message = "";
  if (alertType === "regenerate") {
    message = "If you want to regenerate more <br /> upgrade to Pro!!!";
  } else if (alertType === "websiteCreation") {
    message =
      "You’ll lose customisations, and generated words will count towards your usage. Do You want to Proceed?";
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg text-center relative max-w-[450px] mx-auto px-7 py-7">
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
              className="previous-btn w-full flex px-3 py-3.5 text-base font-medium text-white rounded-lg justify-center"
              onClick={onCreateFromScratch}
            >
              {buttonLoader ? (
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
              ) : (
                "Customize"
              )}
            </button>
            <button
              className="bg-[#2E42FF] w-full px-6 py-3.5 text-base text-white font-[600] rounded-lg"
              onClick={onClose}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomizePopup;
