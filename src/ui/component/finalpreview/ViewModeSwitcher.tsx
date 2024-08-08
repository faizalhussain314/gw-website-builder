import React from "react";
import PersonalVideoIcon from "@mui/icons-material/PersonalVideo";
import TabletMacIcon from "@mui/icons-material/TabletMac";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

type Props = {
  isOpen: boolean;
  viewMode: string;
  toggleDropdown: () => void;
  handleViewChange: (mode: string) => void;
};

const ViewModeSwitcher: React.FC<Props> = ({
  isOpen,
  viewMode,
  toggleDropdown,
  handleViewChange,
}) => {
  return (
    <div>
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          {viewMode === "desktop" && <PersonalVideoIcon className="mr-2" />}
          {viewMode === "tablet" && <TabletMacIcon className="mr-2" />}
          {viewMode === "mobile" && <PhoneIphoneIcon className="mr-2" />}
          {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div
          className="origin-top-left absolute left-0 mt-2 cursor-pointer rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            <a
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
              role="menuitem"
              onClick={() => handleViewChange("desktop")}
            >
              <PersonalVideoIcon className="mr-2" />
              Desktop
            </a>
            <a
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
              role="menuitem"
              onClick={() => handleViewChange("tablet")}
            >
              <TabletMacIcon className="mr-2" />
              Tablet
            </a>
            <a
              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
              role="menuitem"
              onClick={() => handleViewChange("mobile")}
            >
              <PhoneIphoneIcon className="mr-2" />
              Mobile
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewModeSwitcher;
