import React from "react";
import Caution from "../../../assets/caution.svg";
import Crown from "../../../assets/crown.svg";

const UpgradeWords = () => {
  const upgradeRedirection = () => {
    window.open("https://gravitywrite.com/pricing", "_blank");
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-700 bg-opacity-50 backdrop-blur-sm z-50 rounded">
      <div className="bg-white rounded-lg shadow-lg text-center relative max-w-[440px] mx-auto px-7 py-9">
        <div className="w-full flex items-center justify-center gap-x-2.5">
          <img src={Caution} alt="Caution" />
          <h2 className="text-2xl font-semibold">Word Limit exceeded</h2>
        </div>
        <p className="mt-6 text-black text-base">
          You've reached the word limit for your current plan. To unlock more
          words and continue generating content, consider upgrading your word
          limit.
        </p>
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

export default UpgradeWords;