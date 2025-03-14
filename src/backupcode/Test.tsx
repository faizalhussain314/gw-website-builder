import React, { useState } from "react";
import ConnectionToGWPopup from "../ui/component/dialogs/ConnectToGWPopup";
import ContinuePopup from "../ui/component/dialogs/ContinuePopup";
import LimitReachedPopup from "../ui/component/dialogs/LimitReachedPopup";
import WarningPopup from "../ui/component/dialogs/WarningPopup";
import ApiErrorPopup from "../ui/component/dialogs/ApiErrorPopup";
import ImportCountError from "../ui/component/dialogs/ImportCountError";
import ImportWarning from "../ui/component/dialogs/importWarning";
import PlanExpired from "../ui/component/dialogs/PlanExpired";
import SignOut from "../ui/component/dialogs/SignOut";
import StyleRemoveWarning from "../ui/component/dialogs/StyleRemoveWarning";
import UpgradePopup from "../ui/component/dialogs/UpgradePopup";
import UpgradeWords from "../ui/component/dialogs/UpgradeWords";
import WordLimit from "../ui/component/dialogs/WordLimit";

function Test() {
  // State to track which popup is currently open
  const [openPopup, setOpenPopup] = useState<string | null>(null);

  // Function to render selected popup dynamically
  // const renderPopup = () => {
  //   switch (openPopup) {
  //     case "ApiErrorPopup":
  //       return <ApiErrorPopup alertType="userDetails" />;
  //     case "ConnectionToGWPopup":
  //       return <ConnectionToGWPopup onClose={() => setOpenPopup(null)} />;
  //     case "ContinuePopup":
  //       return (
  //         <ContinuePopup
  //           onClose={() => setOpenPopup(null)}
  //           onContinue={() => {}}
  //           alertType="websiteCreation"
  //           onCreateFromScratch={() => {}}
  //         />
  //       );
  //     case "LimitReachedPopup":
  //       return (
  //         <LimitReachedPopup onClose={() => setOpenPopup(null)} limit={5} />
  //       );
  //     case "WarningPopup":
  //       return (
  //         <WarningPopup
  //           onClose={() => setOpenPopup(null)}
  //           onContinue={() => {}}
  //         />
  //       );
  //     case "ImportCountError":
  //       return <ImportCountError onClose={() => setOpenPopup(null)} />;
  //     case "ImportWarning":
  //       return <ImportWarning onClose={() => setOpenPopup(null)} />;
  //     case "PlanExpired":
  //       return <PlanExpired onClose={() => setOpenPopup(null)} />;
  //     case "SignOut":
  //       return <SignOut onClose={() => setOpenPopup(null)} />;
  //     case "StyleRemoveWarning":
  //       return <StyleRemoveWarning onClose={() => setOpenPopup(null)} />;
  //     case "UpgradePopup":
  //       return <UpgradePopup onClose={() => setOpenPopup(null)} />;
  //     case "UpgradeWords":
  //       return <UpgradeWords onClose={() => setOpenPopup(null)} />;
  //     case "WordLimit":
  //       return <WordLimit onClose={() => setOpenPopup(null)} />;
  //     default:
  //       return null;
  //   }
  // };

  return (
    <div>
      <h1>Test Page - Dialogs</h1>
      {/* <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <button
          className="tertiary text-white py-2 px-4 rounded-lg font-medium text-base"
          onClick={() => setOpenPopup("ApiErrorPopup")}
        >
          Show ApiErrorPopup
        </button>
        <button
          className="tertiary text-white py-2 px-4 rounded-lg font-medium text-base"
          onClick={() => setOpenPopup("ConnectionToGWPopup")}
        >
          Show ConnectionToGWPopup
        </button>
        <button
          className="tertiary text-white py-2 px-4 rounded-lg font-medium text-base"
          onClick={() => setOpenPopup("ContinuePopup")}
        >
          Show ContinuePopup
        </button>
        <button
          className="tertiary text-white py-2 px-4 rounded-lg font-medium text-base"
          onClick={() => setOpenPopup("LimitReachedPopup")}
        >
          Show LimitReachedPopup
        </button>
        <button
          className="tertiary text-white py-2 px-4 rounded-lg font-medium text-base"
          onClick={() => setOpenPopup("WarningPopup")}
        >
          Show WarningPopup
        </button>
        <button
          className="tertiary text-white py-2 px-4 rounded-lg font-medium text-base"
          onClick={() => setOpenPopup("ImportCountError")}
        >
          Show ImportCountError
        </button>
        <button
          className="tertiary text-white py-2 px-4 rounded-lg font-medium text-base"
          onClick={() => setOpenPopup("ImportWarning")}
        >
          Show ImportWarning
        </button>
        <button
          className="tertiary text-white py-2 px-4 rounded-lg font-medium text-base"
          onClick={() => setOpenPopup("PlanExpired")}
        >
          Show PlanExpired
        </button>
        <button
          className="tertiary text-white py-2 px-4 rounded-lg font-medium text-base"
          onClick={() => setOpenPopup("SignOut")}
        >
          Show SignOut
        </button>
        <button
          className="tertiary text-white py-2 px-4 rounded-lg font-medium text-base"
          onClick={() => setOpenPopup("StyleRemoveWarning")}
        >
          Show StyleRemoveWarning
        </button>
        <button
          className="tertiary text-white py-2 px-4 rounded-lg font-medium text-base"
          onClick={() => setOpenPopup("UpgradePopup")}
        >
          Show UpgradePopup
        </button>
        <button
          className="tertiary text-white py-2 px-4 rounded-lg font-medium text-base"
          onClick={() => setOpenPopup("UpgradeWords")}
        >
          Show UpgradeWords
        </button>
        <button
          className="tertiary text-white py-2 px-4 rounded-lg font-medium text-base"
          onClick={() => setOpenPopup("WordLimit")}
        >
          Show WordLimit
        </button>
      </div>

      {renderPopup()} */}
    </div>
  );
}

export default Test;
