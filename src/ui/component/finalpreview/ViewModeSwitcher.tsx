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
          className={`inline-flex items-center justify-between rounded-md ring-1 shadow-sm px-4 py-3 bg-white text-base font-medium text-black focus:outline-none w-[180px] ${
            isOpen ? "ring-palatinate-blue-600" : "ring-[#F0F0F1]"
          }`}
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          <div className="flex items-center gap-x-2.5">
            {viewMode === "desktop" && <PersonalVideoIcon />}
            {viewMode === "tablet" && <TabletMacIcon />}
            {viewMode === "mobile" && <PhoneIphoneIcon />}
            {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`${
              isOpen ? "rotate-180 " : "-rotate-180"
            }transition-all duration-200 ease-in`}
          >
            <path
              d="M11 3L6 8L1 3"
              stroke="#000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div
          className="origin-top-left absolute left-0 mt-2 cursor-pointer rounded-md shadow-lg bg-white ring-1 ring-[#F0F0F1] focus:outline-none z-50 w-[180px]"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            <a
              className="text-black px-4 py-2 text-base font-medium hover:bg-palatinate-blue-50 flex items-center gap-2.5 rounded-md"
              role="menuitem"
              onClick={() => handleViewChange("desktop")}
            >
              <PersonalVideoIcon />
              Desktop
            </a>
            <a
              className="text-black px-4 py-2 text-base font-medium hover:bg-palatinate-blue-50 flex items-center gap-2.5 rounded-md"
              role="menuitem"
              onClick={() => handleViewChange("tablet")}
            >
              <TabletMacIcon />
              Tablet
            </a>
            <a
              className="text-black px-4 py-2 text-base font-medium hover:bg-palatinate-blue-50 flex items-center gap-2.5 rounded-md"
              role="menuitem"
              onClick={() => handleViewChange("mobile")}
            >
              <PhoneIphoneIcon />
              Mobile
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewModeSwitcher;
