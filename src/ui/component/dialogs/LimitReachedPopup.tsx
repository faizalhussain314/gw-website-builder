import CloseIcon from "@mui/icons-material/Close";
import Caution from "../../../assets/caution.svg";
import Crown from "../../../assets/crown.svg";

type limitProps = {
  onClose: () => void;
  limit: number;
};

function LimitReachedPopup({ onClose, limit }: limitProps) {
  const upgradePlan = () => {
    window.open("https://gravitywrite.com/pricing", "_blank");
  };
  return (
    <div className="fixed top-0 inset-0 right-0  flex items-start justify-end bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg text-center relative max-w-[350px] mx-auto px-8 py-9 mt-4 mr-4">
        <button
          className="absolute right-4 top-4"
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon className="text-gray-600" />
        </button>

        <div className="flex items-center gap-x-2.5 w-full justify-center">
          <img src={Caution} alt="Caution" />
          <h2 className="text-[22px] leading-7 font-semibold">Limit Reached</h2>
        </div>
        <p className="mt-6 text-black text-lg">
          Your plan's {limit} templates are over. If you want more templates,
          upgrade to Pro!
        </p>

        <button
          className="mt-8 text-base tertiary text-white flex items-center justify-center gap-2 px-6 py-3 rounded-lg mx-auto"
          onClick={upgradePlan}
        >
          <img src={Crown} alt="Crown" /> Upgrade Plan
        </button>
      </div>
    </div>
  );
}

export default LimitReachedPopup;
