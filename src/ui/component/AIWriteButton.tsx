// components/AIWriteButton.tsx
import React from "react";

interface AIWriteButtonProps {
  type: 1 | 2;
  isLoading: boolean;
  isDisabled: boolean;
  onClick: () => void;
  visibleWordCount: 1 | 2 | null;
}

const AIWriteButton: React.FC<AIWriteButtonProps> = ({
  type,
  isLoading,
  isDisabled,
  onClick,
  visibleWordCount,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (!isDisabled) {
      onClick();
    }
    e.stopPropagation();
  };

  const loadingSpinner = (
    <svg
      className="text-palatinate-blue-600 animate-spin"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
    >
      <path
        d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6648 59.9313 22.9614 60.6315 27.4996"
        stroke="#E5E7EB"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="mt-2 flex items-center gap-2 text-app-secondary hover:text-app-accent-hover cursor-pointer ml-[50px]">
      <div
        className={`flex justify-between w-full ${
          isDisabled ? "cursor-progress" : ""
        }`}
      >
        <div className="flex gap-2 text-palatinate-blue-600 hover:text-palatinate-blue-800 flex-1">
          <img src="https://plugin.mywpsite.org/sparkles.svg" alt="sparkle" />
          <span className="text-sm font-normal transition duration-150 ease-in-out flex-1 flex items-center">
            <button
              className="flex justify-center items-center"
              onClick={handleClick}
              disabled={isDisabled}
            >
              Write Using AI
              {isLoading && <span className="ml-2">{loadingSpinner}</span>}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIWriteButton;
