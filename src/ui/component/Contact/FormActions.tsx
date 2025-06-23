import React from "react";
import { Link } from "react-router-dom";

interface FormActionsProps {
  isFormValid: boolean;
  loading: boolean;
  arrowIcon: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  isFormValid,
  loading,
  arrowIcon,
}) => {
  return (
    <div className="bottom-0 flex items-center justify-between w-full mt-6">
      <div className="flex items-center gap-4">
        <Link to={"/description"}>
          <button className="previous-btn flex px-[30px] py-[15px] text-base text-white sm:mt-2 rounded-md w-[150px] gap-3 justify-center font-medium">
            <img src={arrowIcon} alt="arrow-icon" />
            Previous
          </button>
        </Link>
        <button
          className={`tertiary px-[30px] py-[15px] text-base text-white sm:mt-2 font-medium rounded-md w-[150px] min-h-[54px] ${
            !isFormValid
              ? "bg-[#ccc] cursor-not-allowed"
              : "bg-[#125BFF] cursor-pointer"
          } `}
          type="submit"
        >
          {loading ? (
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            </div>
          ) : (
            "Continue"
          )}
        </button>
      </div>
      <Link to={"/design"}>
        <div className="cursor-pointer">
          <span className="text-base text-[#6C777D] leading-5 hover:text-palatinate-blue-600">
            Skip Step
          </span>
        </div>
      </Link>
    </div>
  );
};
