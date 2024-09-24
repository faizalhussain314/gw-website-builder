import React, { useLayoutEffect, useState, useEffect } from "react";
import MainLayout from "../../Layouts/MainLayout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Popup from "../../component/Popup";
import useTemplateList from "../../../hooks/useTemplateList";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_BACKEND_URL;

function Design() {
  const { activeIndex, selectedTemplateDetails, handleBoxClick } =
    useTemplateList();
  const [templateList, setTemplateList] = useState([]);
  const businessName = useSelector(
    (state: RootState) => state.userData.businessName
  );
  const description = useSelector(
    (state: RootState) => state.userData.description1
  );
  const description2 = useSelector(
    (state: RootState) => state.userData.description2
  );
  const category =
    useSelector((state: RootState) => state.userData.category) || "";

  const [showPopup, setShowPopup] = useState(false);

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  useLayoutEffect(() => {
    const handleMouseEnter = (iframe: HTMLIFrameElement) => {
      iframe?.contentWindow?.postMessage(
        { type: "scroll", scrollAmount: 20 },
        "*"
      );
    };

    const handleMouseLeave = (iframe: HTMLIFrameElement) => {
      iframe?.contentWindow?.postMessage(
        { type: "stopScrolling", scrollAmount: 20 },
        "*"
      );
    };

    const iframes = document.getElementsByTagName("iframe");

    const onMouseEnter = (event: Event) =>
      handleMouseEnter(event.currentTarget as HTMLIFrameElement);
    const onMouseLeave = (event: Event) =>
      handleMouseLeave(event.currentTarget as HTMLIFrameElement);

    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];
      iframe.addEventListener("mouseenter", onMouseEnter);
      iframe.addEventListener("mouseleave", onMouseLeave);
    }

    return () => {
      for (let i = 0; i < iframes.length; i++) {
        const iframe: HTMLIFrameElement = iframes[i];
        iframe.removeEventListener("mouseenter", onMouseEnter);
        iframe.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, [templateList]);

  const handleMouseEnter = (event: any) => {
    const iframe = event.currentTarget.querySelector("iframe");
    if (iframe) {
      iframe.contentWindow.postMessage(
        { type: "scroll", scrollAmount: 20 },
        "*"
      );
    }
  };

  const handleMouseLeave = (event: any) => {
    const iframe = event.currentTarget.querySelector("iframe");
    if (iframe) {
      iframe.contentWindow.postMessage(
        { type: "stopScrolling", scrollAmount: 40 },
        "*"
      );
    }
  };

  // Fetch the template list from API on component mount
  useEffect(() => {
    const fetchTemplateList = async () => {
      try {
        const response = await axios.get(`${API_URL}getTemplates`);
        const templates = response.data?.data || []; // Extract data from the API response
        setTemplateList(templates); // Set the template list in state
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchTemplateList();
  }, []);

  // Handle template selection
  // const handleTemplateSelect = (template) => {
  //   setSelectedTemplate(template); // Store the selected template in state
  //   console.log("Selected Template:", template); // You can use this state later
  // };

  return (
    <MainLayout>
      {showPopup && (
        <Popup
          businessName={businessName}
          description={description}
          onClose={handlePopupClose}
          secondDescription={description2}
        />
      )}
      <div className="relative w-full h-full p-10">
        <div className="flex flex-col items-center w-full max-h-[76vh] bg-app-light-background">
          <div className="flex flex-col w-full mx-auto overflow-x-hidden">
            <div className="">
              <h1 className="text-3xl font-semibold">
                Choose the structure for your website
              </h1>
              <p className="mt-3 text-base font-normal leading-6 text-app-text text-txt-secondary-500">
                Select your preferred structure for your website from the
                options below.
              </p>
            </div>
            <form className="my-8">
              <div>
                <div className="relative flex items-center">
                  <div className="flex items-center h-12 mr-0">
                    <div className="absolute flex items-center left-3">
                      <button className="flex items-center justify-center w-auto h-auto p-0 bg-transparent border-0 cursor-pointer focus:outline-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                          className="w-5 h-5 text-zip-app-inactive-icon"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="w-full">
                    <input
                      className="w-full h-12 px-3 border rounded-md shadow-sm outline-none placeholder:zw-placeholder zw-input focus:border-2 border-app-border focus:border-app-secondary focus:ring-transparent pl-11 false"
                      value={category}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </form>

            <div className="relative custom-confirmation-modal-scrollbar md:px-10 lg:px-14 xl:px-15 xl:max-w-full overflow-auto">
              <div className="grid items-start justify-center grid-cols-3 gap-6 lg:grid-cols-2 xl:grid-cols-3 auto-rows-auto">
                {templateList.map((list: templatelist, index: number) => (
                  <div
                    key={index}
                    className="flex justify-center w-full cursor-pointer rounded-b-2xl hover-element"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div
                      className={` w-full border border-border-tertiary border-solid rounded-t-xl rounded-b-lg ${
                        activeIndex === index
                          ? "border-2 border-palatinate-blue-500 rounded-lg "
                          : "border"
                      } `}
                      onClick={() => handleBoxClick(index, list)}
                    >
                      {/* Iframe Content */}
                      <div className="w-full aspect-[164/179] relative overflow-hidden bg-neutral-300 rounded-xl">
                        <div className="w-full max-h-[calc(19_/_15_*_100%)] pt-[calc(19_/_15_*_100%)] select-none relative shadow-md overflow-hidden origin-top-left bg-neutral-300">
                          <iframe
                            id="myIframe"
                            title={`Template ${index + 1}`}
                            className={`scale-[0.33] w-[1200px] h-[1600px] absolute left-0 top-0 origin-top-left select-none`}
                            src={list?.pages?.[0]?.iframe_url} // Use the iframe URL from the first page in the template
                          ></iframe>
                        </div>

                        {/* Premium Label */}
                        <div className="absolute top-3 right-3 text-xs leading-[1em] pt-1 pb-[4px] zw-xs-semibold text-white flex items-center justify-center rounded-3xl bg-[#F90] px-[12px] pointer-events-none">
                          <div className="flex items-center justify-center gap-1 font-sm">
                            Premium
                          </div>
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 w-full h-full bg-transparent cursor-pointer"></div>
                      </div>

                      {/* Bottom Info */}
                      <div className="relative h-14">
                        <div className="absolute bottom-0 flex items-center justify-between w-full px-5 bg-white rounded-b-lg h-14 shadow-template-info">
                          <div className="capitalize zw-base-semibold text-app-heading">
                            Option {index + 1}
                          </div>
                          <div className="flex gap-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              aria-hidden="true"
                              className="w-6 h-6 cursor-pointer text-app-active-icon"
                              id="headlessui-menu-button-:rc:"
                              aria-haspopup="menu"
                              aria-expanded="false"
                              data-headlessui-state=""
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="pt-[50px]">
          <div className="flex items-start justify-between xs:items-center">
            <div className="flex flex-row flex-wrap items-start xs:flex-row xs:items-center gap-x-4 gap-y-10 xs:gap-y-0">
              <Link to={"/contact"}>
                <button className=" previous-btn flex px-[10px] py-[13px] text-base text-white font-medium sm:mt-2 rounded-md w-[150px] gap-3 justify-center">
                  <ArrowBackIcon fontSize="small" />
                  Previous
                </button>
              </Link>
              <button
                className=" tertiary px-[30px] py-[10px] text-base text-white sm:mt-2 rounded-md w-[150px]"
                onClick={() => setShowPopup(true)}
              >
                <div className="flex items-center justify-center font-medium gap-x-2">
                  <div>Continue</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Design;
