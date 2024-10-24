import ConnectionToGWPopup from "../ui/component/dialogs/ConnectToGWPopup";
import ContinuePopup from "../ui/component/dialogs/ContinuePopup";
import LimitReachedPopup from "../ui/component/dialogs/LimitReachedPopup";
import WarningPopup from "../ui/component/dialogs/WarningPopup";

function Test() {
  return (
    <div>
      {/* <WarningPopup onClose={() => {}} onContinue={() => {}} /> */}
      <ConnectionToGWPopup onContinue={() => {}} />
      {/* <ContinuePopup
        onClose={() => {}}
        onContinue={() => {}}
        alertType="regenerate"
        onCreateFromScratch={() => {}}
      /> */}
      {/* <ContinuePopup
        onClose={() => {}}
        onContinue={() => {}}
        alertType="websiteCreation"
        onCreateFromScratch={() => {}}
      /> */}
      {/* <LimitReachedPopup onClose={() => {}} /> */}
    </div>
  );
}

export default Test;
