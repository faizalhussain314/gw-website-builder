import React, { useLayoutEffect, useState, useEffect } from "react";
import MainLayout from "../../Layouts/MainLayout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { RootState } from "../../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Popup from "../../component/Popup";
import useTemplateList from "../../../hooks/useTemplateList";
import axios from "axios";
import { saveSelectedTemplate } from "../../../infrastructure/api/wordpress-api/desgin/saveSelectedtemplate";
import useDomainEndpoint from "../../../hooks/useDomainEndpoint";
import { useDebounce } from "use-debounce";
import { setCategory } from "../../../Slice/activeStepSlice";

const API_URL = import.meta.env.VITE_API_BACKEND_URL;

function Design() {
  const { activeIndex, handleBoxClick } = useTemplateList();

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
  const [fetchedTemplateId, setFetchedTemplateId] = useState<number | null>(
    null
  );

  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  ); // Store the selected template's ID for highlighting
  const category =
    useSelector((state: RootState) => state.userData.category) || "";
  const [text, setText] = useState(category);
  const [debouncedValue] = useDebounce(text, 300);

  const templateIdFromRedux = useSelector(
    (state: RootState) => state.userData.templateid
  );

  const [showPopup, setShowPopup] = useState(false);
  const [showError, setshowError] = useState(false);
  const dispatch = useDispatch();
  const { getDomainFromEndpoint } = useDomainEndpoint();
  const [hasFetched, setHasFetched] = useState(false);

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setText(e.target.value); // Set the input text for debounce
  };

  const fetchTemplateList = async () => {
    try {
      const response = await axios.get(`${API_URL}getTemplates`);
      const templates = response.data?.data || []; // Extract data
      setshowError(false);
      setTemplateList(templates); // Store template list in state
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };
  // API call to fetch templates based on category (debounced)
  useLayoutEffect(() => {
    if (debouncedValue.length <= 0) {
      fetchTemplateList();
      return;
    }
    const fetchTemplates = async () => {
      let url: string = "";
      try {
        if (category.length == 0) {
          url = await axios.get(
            `https://dev.gravitywrite.com/api/getTemplates`
          );
        } else {
          url = `https://dev.gravitywrite.com/api/getTemplates?site_category=${debouncedValue}`;
        }
        const response = await axios.get(url);
        // dispatch(setTemplateList(response?.data)); // Store templates in Redux

        if (response.data.data.length === 0) {
          setshowError(true);
          setTemplateList(response.data.data);

          return;
        }
        if (response.data.data.length >= 0) {
          setshowError(false);
          setTemplateList(response.data.data);
        }

        setTemplateList(response.data.data);

        console.log("response data", response.data.data);
        dispatch(setCategory(debouncedValue)); // Update category in Redux
      } catch (error) {
        console.error("Error fetching templates:", error);
        // setError(true);
      }
    };
    fetchTemplates();
    // }
  }, [debouncedValue, dispatch]);

  const fetchSelectedTemplate = async () => {
    if (!hasFetched) {
      try {
        const endpoint = getDomainFromEndpoint(
          "wp-json/custom/v1/get-selected-template"
        );
        const response = await axios.post(endpoint, {});
        const savedTemplate = response.data; // Assuming API returns template_id
        // if (savedTemplate) {

        // setError(false);
        setFetchedTemplateId(savedTemplate[0]?.template_id); // Store the fetched template ID
        // handleTemplateSelection(
        //   savedTemplate[0]?.template_id,
        //   savedTemplate[0]
        // );
        handleBoxClick(
          savedTemplate[0]?.id,
          savedTemplate[0],
          parseInt(savedTemplate[0]?.template_id)
        );

        // const templateIndex = templateList.findIndex(
        //   (template) => template.id === savedTemplate
        // );
        // if (templateIndex !== -1) {
        //   handleBoxClick(
        //     templateIndex,
        //     templateList[templateIndex],
        //     savedTemplate
        //   );
        // }
        // }
      } catch (error) {
        console.error("Error fetching selected template:", error);
      }
      setHasFetched(true);
    }
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
    if (!hasFetched) {
      fetchTemplateList(); // Fetch only if not already fetched
      setHasFetched(true); // Prevent multiple fetches
    }
  }, [hasFetched]);

  const handleTemplateSelection = async (index: number, template: any) => {
    setShowPopup(false); // Close any popups

    // Handle template selection logic
    handleBoxClick(index, template, template.id);

    try {
      const endpoint = getDomainFromEndpoint(
        "wp-json/custom/v1/save-selected-template"
      );
      await saveSelectedTemplate(template, endpoint);
      console.log("Template saved successfully to the backend.", template);
    } catch (error) {
      console.error("Error saving template to backend:", error);
    }
  };

  // Fetch selected template from the API if not found in Redux state
  useEffect(() => {
    fetchSelectedTemplate();
  }, [hasFetched, getDomainFromEndpoint, templateList, handleBoxClick]);

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

      <div className="flex flex-col justify-between h-full p-10">
        <div className="flex flex-col w-full h-full mx-auto overflow-x-hidden">
          <h1 className="text-3xl font-semibold">
            Choose the structure for your website
          </h1>
          <p className="mt-3 text-base font-normal leading-6 text-app-text text-txt-secondary-500">
            Select your preferred structure for your website from the options
            below.
          </p>

          <form className="my-8">
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
                  className="w-full h-12 px-3 border rounded-md shadow-sm outline-none placeholder:zw-placeholder zw-input  border-app-border focus:border-app-secondary focus:border-palatinate-blue-500 active:border-palatinate-blue-500 focus:border-2 pl-11 false"
                  value={text} // Show current search text
                  onChange={handleSearch}
                  placeholder="Search categories..."
                />
              </div>
            </div>
          </form>
          <div className="relative custom-confirmation-modal-scrollbar md:px-10 lg:px-14 xl:px-15 xl:max-w-full overflow-auto">
            {showError && (
              <div className=" text-center">No templates found</div>
            )}
            <div className="grid items-start justify-center grid-cols-3 gap-6 lg:grid-cols-2 xl:grid-cols-3 auto-rows-auto p-1">
              {templateList.map((list, index: number) => (
                <div
                  key={index}
                  className={` w-full rounded-t-xl rounded-b-lg ${
                    activeIndex === list?.id
                      ? "ring ring-palatinate-blue-600 rounded-lg "
                      : ""
                  } `}
                  onClick={() => handleTemplateSelection(list?.id, list)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className={` w-full rounded-t-xl rounded-b-lg  `}>
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
        {/* Button Section */}
        <div className="pt-auto">
          <div className="flex items-center gap-x-4 pt-10">
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
    </MainLayout>
  );
}

export default Design;
