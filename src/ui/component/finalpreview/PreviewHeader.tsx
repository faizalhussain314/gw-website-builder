import React from "react";
import MenuIcon from "../../../assets/menu.svg";

interface PreviewHeaderProps {
  onBackClick: () => void;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({ onBackClick }) => {
  return (
    <div className="bg-white  w-[23vw] lg:w-[30vw] z-10 border-r border-[#DFEAF6]">
      <div className="flex items-center justify-between py-4 border-b cursor-pointer pr-7 ps-3 sidebar-header border-[#DFEAF6]">
        <img
          src="https://plugin.mywpsite.org/logo.svg"
          alt="gravity write logo"
          className="h-10 p-2 rounded-md"
        />
        <div className="relative flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer group pr-7 ps-3 sidebar-header">
          <img src={MenuIcon} alt="menu" className="hidden w-5 h-auto group" />
        </div>
      </div>
      <div className="flex flex-col justify-center w-full px-5 py-4">
        <div className="flex items-center justify-between pb-2.5">
          <h1 className="text-xl font-semibold">Website Preview</h1>
          <button
            className="px-4 py-2 text-sm font-medium rounded-md cursor-pointer bg-button-bg-secondary hover:bg-palatinate-blue-600 hover:text-white"
            onClick={onBackClick}
          >
            Back
          </button>
        </div>
        <span className="text-base text-[#88898A] font-normal">
          Preview your website's potential with our interactive demonstration.
        </span>
      </div>
    </div>
  );
};

export default PreviewHeader;
