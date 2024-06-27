import GravityWriteLogo from "../../assets/logo.svg";
import MenuIcon from "../../assets/menu.svg";
import TabletMacIcon from "@mui/icons-material/TabletMac";
import { useEffect, useState } from "react";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import PersonalVideoIcon from "@mui/icons-material/PersonalVideo";
import CircularProgress from "@mui/material/CircularProgress";

type Page = {
  name: string;
  status: string;
};

function FinalPreview() {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState("desktop");
  const businessName = useSelector(
    (state: RootState) => state.userData.businessName
  );
  const description = useSelector(
    (state: RootState) => state.userData.description1
  );
  const fontFamily = useSelector((state: RootState) => state.userData.font);
  const Color = useSelector((state: RootState) => state.userData.color);
  const [selectedPage, setSelectedPage] = useState<string | null>("Home");
  const [temLoader, setTemLoader] = useState(false);
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const [originalPrompts, setOriginalPrompts] = useState<any>({});

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleViewChange = (mode: string) => {
    setViewMode(mode);
    setIsOpen(false);
  };

  const sendMessageToChild = (message: any) => {
    const iframes = document.getElementsByTagName("iframe");
    setTemLoader(true);
    setLoading(true); // Show loading animation
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];
      console.log("data sent to iframe", message);
      iframe?.contentWindow?.postMessage(message, "*");
    }
  };

  const pages: Page[] = [
    { name: "Home", status: "Generated" },
    { name: "About Us", status: "" },
    { name: "Services", status: "" },
    { name: "Blog", status: "" },
    { name: "Contact", status: "" },
  ];

  const handleRegenerate = () => {
    sendMessageToChild({
      type: "regenerate",
      businessName,
      description,
      originalPrompts,
    });
  };

  const onLoadMsg = () => {
    sendMessageToChild({ type: "start" });
    const iframes = document.getElementsByTagName("iframe");

    console.log("font family:", fontFamily, "color:", Color);
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];
      iframe?.contentWindow?.postMessage(
        { type: "changeFont", font: fontFamily },
        "*"
      );
      iframe?.contentWindow?.postMessage(
        {
          type: "changeGlobalColors",
          primaryColor: Color.primary,
          secondaryColor: Color.secondary,
        },
        "*"
      );
    }
  };

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

  // useEffect(() => {
  //   setTimeout(() => {
  //     sendMessageToChild({
  //       type: "start",
  //       businessName,
  //       description,
  //       originalPrompts,
  //     });
  //     console.log("1");
  //   }, 4000);
  // }, [businessName, description]);

  useEffect(() => {
    setTimeout(() => {
      const iframes = document.getElementsByTagName("iframe");
      for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i];
        iframe?.contentWindow?.postMessage({ type: "start" }, "*");
      }
    }, 300);
  }, []);

  useEffect(() => {
    const receiveMessage = (event: MessageEvent) => {
      if (event.data.type === "storePrompts") {
        setOriginalPrompts(event.data.prompts);
      } else if (event.data.type === "contentLoaded") {
        console.log(event.data.isFetching, "this is isFetching");
        setLoading(false); // Hide loading animation when content is loaded
        setTemLoader(false);
      }
      // console.log("message event:", event);
    };

    window.addEventListener("message", receiveMessage);
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, []);

  useEffect(() => {
    if (fontFamily && Color.primary && Color.secondary) {
      setTimeout(() => {
        const iframes = document.getElementsByTagName("iframe");

        console.log("font family:", fontFamily, "color:", Color);
        for (let i = 0; i < iframes.length; i++) {
          const iframe = iframes[i];
          iframe?.contentWindow?.postMessage(
            { type: "changeFont", font: fontFamily },
            "*"
          );
          iframe?.contentWindow?.postMessage(
            {
              type: "changeGlobalColors",
              primaryColor: Color.primary,
              secondaryColor: Color.secondary,
            },
            "*"
          );
        }
      }, 1000);
    }
  }, [fontFamily, Color]);

  return (
    <div className="h-screen flex font-[inter] w-screen">
      <div className="w-[23%] lg:w-[30%]">
        <aside className="z-10 fixed">
          <div className="bg-white min-h-screen w-[23vw] lg:w-[30vw] z-10 border-2">
            <div className="flex items-center justify-between py-4 border-b cursor-pointer pr-7 ps-3 sidebar-header">
              <img
                src={GravityWriteLogo}
                alt="gravity write logo"
                className="h-10 p-2 rounded-md cursor-pointer hover:bg-palatinate-blue-50"
              />
              <div className="relative border-gray-100 group flex items-center justify-between py-4 border-b cursor-pointer pr-7 ps-3 sidebar-header">
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
                            <RefreshIcon
                              className={`ml-2 text-gray-500 cursor-pointer ${
                                temLoader ? "animate-spin" : ""
                              }`}
                              onClick={handleRegenerate}
                            />
                          )}
                          <ExpandMoreIcon
                            className="ml-2 text-gray-500 cursor-pointer"
                            onClick={() => togglePage(page.name)}
                          />
                        </div>
                      </div>
                      {selectedPage === page.name && (
                        <div className="mt-3 flex justify-between text-sm">
                          <button className="bg-white text-black rounded px-3 py-1">
                            Keep & Next
                          </button>
                          <button className="bg-white text-black rounded px-3 py-1 opacity-50">
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
      <div className="w-[80%] flex-last bg-[#F9FCFF] overflow-x-hidden relative">
        {/* {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
            <CircularProgress className="animate-spin text-gray-500" />
          </div>
        )} */}
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
                {viewMode === "desktop" && (
                  <PersonalVideoIcon className="mr-2" />
                )}
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
          <div className="w-full h-screen flex justify-center">
            <iframe
              // src="http://localhost:8080/template1.html"
              src="https://tours.mywpsite.org/"
              title="website"
              id="myIframe"
              onLoad={onLoadMsg}
              className={`h-full transition-fade shadow-lg rounded-lg ${
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
