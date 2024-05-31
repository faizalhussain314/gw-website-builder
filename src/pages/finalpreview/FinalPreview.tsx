import GravityWriteLogo from "../../assets/logo.svg";
import MenuIcon from "../../assets/menu.svg";
import DesktopMacIcon from "@mui/icons-material/DesktopMac";
import TabletMacIcon from "@mui/icons-material/TabletMac";
import { useState } from "react";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type Page = {
  name: string;
  status: string;
};

interface MyComponentProps {
  selectedPage: any[];
  page: Page;
  togglePage: (...args: any[]) => void;
}

function FinalPreview() {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState("desktop");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleViewChange = (mode: string) => {
    setViewMode(mode);
    setIsOpen(false);
  };

  const pages: Page[] = [
    { name: "Home", status: "Generated" },
    { name: "About Us", status: null },
    { name: "Services", status: null },
    { name: "Blog", status: null },
    { name: "Contact", status: null },
  ];
  const [selectedPage, setSelectedPage] = useState<string | null>("Home");

  const togglePage = (page: string) => {
    setSelectedPage(selectedPage === page ? null : page);
  };

  const handlePrevious = () => {
    console.log("Previous clicked");
  };

  const handleNext = () => {
    console.log("Next clicked");
  };

  const handleImportSelectedPage = () => {
    console.log("Import Selected Page clicked");
  };

  const handleGenerateAll = () => {
    console.log("Generate All clicked");
  };

  return (
    <div className="h-screen flex font-[inter] w-screen ">
      <div className="w-[23%] lg:w-[30%]">
        <aside className="z-10 fixed">
          <div className="bg-white min-h-screen w-[23vw] lg:w-[30vw] z-10 border-2">
            <div className="flex items-center justify-between py-4 border-b cursor-pointer pr-7 ps-3 sidebar-header">
              <img
                src={GravityWriteLogo}
                alt="gravity write logo"
                className="h-10 p-2 rounded-md cursor-pointer hover:bg-palatinate-blue-50"
              />
              <div className="relative cursor-pointer group">
                <img
                  src={MenuIcon}
                  alt="menu"
                  className="w-5 h-auto group hidden"
                />
              </div>
            </div>
            <div className="p-4 w-full flex flex-col justify-center">
              <h1 className="text-xl leading-6 pb-2 mt-4 font-bold">
                Website Preview
              </h1>
              <span className="text-sm text-[#88898A] font-light">
                Preview your website’s potential with our interactive
                demonstration.
              </span>
            </div>
            <div className="p-4 w-full flex flex-col justify-center">
              <div className="p-4">
                <h2 className="text-lg font-semibold">
                  Select Pages to Import (1/5)
                </h2>
                <div className="mt-4">
                  {pages.map((page) => (
                    <div
                      key={page.name}
                      className={`rounded-lg p-3 mb-2 ${
                        selectedPage === page.name
                          ? "border-palatinate-blue-500 border-2 bg-palatinate-blue-50"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={selectedPage === page.name}
                            onChange={() => togglePage(page.name)}
                          />
                          <span className="font-medium">{page.name}</span>
                          {page.status && (
                            <span className="ml-2 text-xs text-green-700 bg-green-200 rounded-full px-2">
                              {page.status}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center">
                          {page.status === "Generated" && (
                            <RefreshIcon className="ml-2 text-gray-500 cursor-pointer" />
                          )}
                          <ExpandMoreIcon
                            className="ml-2 text-gray-500 cursor-pointer"
                            onClick={() => togglePage(page.name)}
                          />
                        </div>
                      </div>
                      {selectedPage === page.name && (
                        <div className="mt-3 flex justify-between text-sm">
                          <button className="bg-white  text-black rounded px-3 py-1">
                            Keep & Next
                          </button>
                          <button className="bg-white  text-black rounded px-3 py-1 opacity-50">
                            Skip Page
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="flex flex-col items-center justify-center absolute bottom-0 w-[80%] mb-4">
                    <div className="mb-4 w-full flex justify-between">
                      <button
                        className="border-[#88898A] w-full text-[#88898A] border-2 py-3 px-6 rounded-md mr-2"
                        onClick={handlePrevious}
                      >
                        Previous
                      </button>
                      <button
                        className="bg-white w-full text-palatinate-blue-500 border-palatinate-blue-500 border-2 py-3 px-8 rounded-md"
                        onClick={handleNext}
                      >
                        Next
                      </button>
                    </div>
                    <button
                      className="tertiary w-full text-white py-3 opacity-50 px-8 rounded-md mb-4"
                      onClick={handleImportSelectedPage}
                      disabled
                    >
                      Import Selected Page
                    </button>
                    <button
                      className="text-blue-500 underline w-full"
                      onClick={handleGenerateAll}
                    >
                      Generate All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <div className="w-[80%] flex-last bg-[#F9FCFF] overflow-x-hidden">
        <main className="px-12">
          <div className="relative inline-block text-left my-4">
            <div>
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                id="menu-button"
                aria-expanded={isOpen}
                aria-haspopup="true"
                onClick={toggleDropdown}
              >
                {viewMode === "desktop" && <DesktopMacIcon className="mr-2" />}
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
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {isOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 cursor-pointer rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
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
                    <DesktopMacIcon className="mr-2" />
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
          <div className="w-full h-screen flex justify-center">
            <iframe
              src="https://ai-builder-backend.onrender.com/template3.html"
              title="website"
              className={`w-full h-full shadow-lg rounded-lg ${
                viewMode === "desktop"
                  ? "w-full h-full"
                  : viewMode === "tablet"
                  ? "w-2/3 h-full"
                  : "w-1/3 h-full"
              }`}
            ></iframe>
          </div>
        </main>
      </div>
    </div>
  );
}

export default FinalPreview;
