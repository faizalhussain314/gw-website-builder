import CloseIcon from "@mui/icons-material/Close";
import Caution from "../../../assets/icon-component/Caution";
import Crown from "../../../assets/icon-component/crown";

type limitProps = {
  onClose: () => void;
};

function LimitReachedPopup({ onClose }: limitProps) {
  const upgradePlan = () => {
    window.open("https://app.gravitywrite.com/pricing", "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg text-center relative max-w-[400px] mx-auto px-7 py-9 my-auto">
        <button
          className="absolute right-4 top-4"
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon className="text-gray-600" />
        </button>

        <div className="flex items-center gap-x-2.5 w-full justify-center">
          <Caution />
          <h2 className="text-[22px] leading-7 font-semibold">
            Limit Exceeded!{" "}
          </h2>
        </div>
        <p className="mt-6 text-lg text-black">
          To build more websites please upgrade your Plan! Upgrade your plan!
        </p>

        <button
          className="flex items-center justify-center gap-2 px-6 py-3 mx-auto mt-8 text-base text-white rounded-lg tertiary"
          onClick={upgradePlan}
        >
          <Crown /> Upgrade Plan
        </button>
      </div>
    </div>
  );
}

export default LimitReachedPopup;
