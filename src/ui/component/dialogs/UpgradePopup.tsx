import React, { useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Caution from "../../../assets/caution.svg";
import Crown from "../../../assets/crown.svg";
import { useClickOutside } from "../../../hooks/useClickOutside";

type UpgradePopupProps = {
  onClose: () => void;
  alertType:
    | "regenerate"
    | "websiteCreation"
    | "upgradeTemp"
    | "wordLimit"
    | "importLimit";
};

const UpgradePopup: React.FC<UpgradePopupProps> = ({ onClose, alertType }) => {
  let title = "";
  let message = "";
  if (alertType === "regenerate") {
    title = "Limit Reached";
    message = "If you want to regenerate more <br /> upgrade to Pro!!!";
  } else if (alertType === "websiteCreation") {
    title = "Import Limit Reached";
    message = "To build more websites please upgrade your Plan!";
  } else if (alertType === "upgradeTemp") {
    title = "Upgrade Required";
    message =
      "This premium template is available for starter and pro users. Please upgrade your plan to access it.";
  } else if (alertType === "wordLimit") {
    title = "Word Usage Limit Reached!";
    message = `To build more websites please upgrade your Plan!`;
  } else if (alertType === "importLimit") {
    title = " Import Limit Exceeded!";
    message = `  To build more websites please upgrade your Plan!`;
  }

  const upgradeRedirection = () => {
    window.open("https://app.gravitywrite.com/pricing", "_blank");
  };

  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, () => {
    onClose();
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-white rounded-lg shadow-lg text-center relative max-w-[400px] mx-auto px-7 py-9"
        ref={wrapperRef}
      >
        <button
          className="absolute right-4 top-4"
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon className="text-gray-600" />
        </button>

        <div className="w-full flex items-center justify-center gap-x-2.5">
          <img src={Caution} alt="Caution" />
          <h2
            className="text-xl font-semibold"
            dangerouslySetInnerHTML={{ __html: title }}
          ></h2>
        </div>
        <p
          className="mt-6 text-black text-lg"
          dangerouslySetInnerHTML={{ __html: message }}
        ></p>
        <button
          className="mt-8 text-base tertiary text-white flex items-center justify-center gap-2 px-6 py-3 rounded-lg mx-auto"
          onClick={upgradeRedirection}
        >
          <img src={Crown} alt="Crown" /> Upgrade Plan
        </button>
      </div>
    </div>
  );
};

export default UpgradePopup;
