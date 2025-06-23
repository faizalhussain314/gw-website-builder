// NavigationButtons.tsx
import React from "react";
import { Link } from "react-router-dom";

interface NavigationButtonsProps {
  showValidationError: boolean;
  onContinue: () => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  showValidationError,
  onContinue,
}) => {
  return (
    <div className="pt-auto w-full">
      <div className="flex items-center pt-10 gap-x-4">
        <Link to={"/contact"}>
          <button className="previous-btn flex px-[10px] py-[15px] text-base text-white font-medium sm:mt-2 rounded-md w-[150px] gap-3 justify-center">
            <img src="https://plugin.mywpsite.org/arrow.svg" alt="arrow-icon" />
            Previous
          </button>
        </Link>
        <button
          className={`tertiary px-[30px] py-[15px] text-base text-white sm:mt-2 rounded-md w-[150px] ${
            !showValidationError && "opacity-50"
          }`}
          onClick={onContinue}
          disabled={!showValidationError}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default NavigationButtons;
