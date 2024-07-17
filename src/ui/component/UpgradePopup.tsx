import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import Caution from "../../assets/caution.svg";
import Crown from "../../assets/crown.svg";

type UpgradePopupProps = {
  onClose: () => void;
  alertType: "regenerate" | "websiteCreation"; // Add a prop to specify the alert type
};

const UpgradePopup: React.FC<UpgradePopupProps> = ({ onClose, alertType }) => {
  let message = "";
  if (alertType === "regenerate") {
    message = "If you want to regenerate more <br /> upgrade to Pro!!!";
  } else if (alertType === "websiteCreation") {
    message =
      "Your 2 free templates are over. If you want more templates, upgrade to Pro!!!";
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg text-center relative p-6 max-w-md mx-auto">
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
            <h2 className="text-xl font-semibold">Limit Reached</h2>
          </div>
          <p
            className="mt-4 text-black text-lg"
            dangerouslySetInnerHTML={{ __html: message }}
          ></p>
          <button className="mt-6 text-lg tertiary text-white flex items-center justify-center gap-2 px-6 py-3 rounded-md">
            <img src={Crown} alt="Crown" /> Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePopup;
