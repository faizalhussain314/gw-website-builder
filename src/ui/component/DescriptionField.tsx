import React from "react";
import Spinner from "./loader/Spinner";

interface DescriptionFieldProps {
  title: string;
  description: string;
  setDescription: (desc: string) => void;
  isWriting: boolean;
  onAIWrite: () => void;
}

const DescriptionField: React.FC<DescriptionFieldProps> = ({
  title,
  description,
  setDescription,
  isWriting,
  onAIWrite,
}) => {
  return (
    <div>
      <div className="flex gap-6 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
        >
          <circle cx="13" cy="13" r="13" fill="#DBE9FF" fillOpacity="0.6" />
          <path
            d="M12.1607 18V9.761L10.2707 10.916V9.054L12.1607 7.92H13.8827V18H12.1607Z"
            fill="#2E42FF"
          />
        </svg>
        <label className="text-lg font-semibold leading-5">{title}</label>
      </div>
      <textarea
        className="bg-white px-4 py-2.5 border h-[100px] border-[rgba(205,212,219,1)] w-[96%] mt-5 rounded-lg ml-[50px] placeholder:font-normal text-[#5f5f5f]"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="mt-2 flex items-center gap-2 text-app-secondary hover:text-app-accent-hover cursor-pointer ml-[50px]">
        <div
          className="flex gap-2 text-palatinate-blue-600 hover:text-palatinate-blue-800"
          onClick={onAIWrite}
        >
          <img
            src="https://tours.mywpsite.org/wp-content/uploads/2024/08/sparkle.svg"
            alt="sparkle"
          />
          <span className="text-sm font-normal transition duration-150 ease-in-out">
            Write Using AI
          </span>
          {isWriting && <Spinner />}
        </div>
      </div>
    </div>
  );
};

export default DescriptionField;
