import Caution from "../../../assets/caution.svg";
import Crown from "../../../assets/crown.svg";

export const ImageGenerationFailed = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-700 bg-opacity-50 backdrop-blur-sm z-50 rounded">
      <div className="bg-white rounded-lg shadow-lg text-center relative max-w-[440px] mx-auto px-7 py-9">
        <div className="w-full flex items-center justify-center gap-x-2.5">
          {/* <img src={Caution} alt="Caution" /> */}
          <h2 className="text-2xl font-semibold">Regenerate Image</h2>
        </div>
        <p className="mt-6 text-black text-base">
          some images are not generated please try again
        </p>
        <button
          className="mt-8 text-base tertiary text-white flex items-center justify-center gap-2 px-6 py-3 rounded-lg mx-auto"
          // onClick={upgradePlan}
        >
          {/* <img src={Crown} alt="Crown" /> Upgrade Plan */}
          Try Again
        </button>
      </div>
    </div>
  );
};
