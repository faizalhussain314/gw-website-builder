import React from "react";
import { Link } from "react-router-dom";
import arrow from "@assets/arrow.svg";

interface NavigationButtonsProps {
  onContinue: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onContinue,
  isLoading,
  isDisabled,
}) => {
  return (
    <div className="flex gap-4 px-10 pt-10 pb-6 mt-auto ml-11">
      <Link to="/name">
        <button className="previous-btn flex px-[30px] py-[15px] text-base text-white sm:mt-2 rounded-lg w-[150px] gap-3 justify-center font-medium">
          <img src={arrow} alt="arrow-icon" />
          Previous
        </button>
      </Link>
      <button
        onClick={onContinue}
        className="tertiary px-[30px] py-[15px] text-base text-white sm:mt-2 font-medium rounded-md w-[150px]"
        disabled={isDisabled}
      >
        {isLoading ? (
          <div className="flex min-w-[65px] justify-center items-center">
            <svg
              className="w-5 h-5 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        ) : (
          "Continue"
        )}
      </button>
    </div>
  );
};

export default NavigationButtons;
