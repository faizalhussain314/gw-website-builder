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
      <div className="bg-white rounded-lg shadow-lg text-center relative max-w-[400px] mx-auto px-7 py-9">
        <button
          className="absolute right-4 top-4"
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon className="text-gray-600" />
        </button>

        <div className="w-full flex items-center justify-center gap-x-2.5">
          <img src={Caution} alt="Caution" />
          <h2 className="text-xl font-semibold">Limit Reached</h2>
        </div>
        <p
          className="mt-6 text-black text-lg"
          dangerouslySetInnerHTML={{ __html: message }}
        ></p>
        <button className="mt-8 text-base tertiary text-white flex items-center justify-center gap-2 px-6 py-3 rounded-lg mx-auto">
          <img src={Crown} alt="Crown" /> Upgrade Plan
        </button>
      </div>
    </div>
  );
};

export default UpgradePopup;
