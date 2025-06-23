import React from "react";

interface LoadingButtonProps {
  loading: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  onClick,
  children,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      type="submit"
      className={`tertiary px-[35px] py-[15px] text-base text-white mt-[25px] sm:mt-2 rounded-lg bg-blue-500 hover:bg-blue-600 tracking-[-0.32px] font-medium leading-[22px] ${className}`}
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
        children
      )}
    </button>
  );
};

export default LoadingButton;
