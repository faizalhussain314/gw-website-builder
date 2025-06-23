import React from "react";
import LoadingSpinner from "./LoadingSpinner";

interface AIWriteButtonProps {
  onAIWrite: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

const AIWriteButton: React.FC<AIWriteButtonProps> = ({
  onAIWrite,
  isLoading,
  isDisabled,
}) => {
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
              onClick={onAIWrite}
              disabled={isDisabled}
            >
              Write Using AI{" "}
              {isLoading && (
                <button type="button" disabled className="ml-2">
                  <LoadingSpinner />
                </button>
              )}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIWriteButton;
