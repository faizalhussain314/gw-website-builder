import MainLayout from "../../Layouts/MainLayout";
import { Website } from "../../types/Preview.type";
import { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";

const structure = {
  businessname: "write business name here",
  shortIntro: "write here for a short intro",
  heroHeading: "write here for a heroHeading",
  shortDescription: "write here for a shortDescription",
  whyChooseUsTitle: "write here for a whyChooseUsTitle",
  whyChooseUsReason1: "write here for a whyChooseUsReason1",
  whyChooseUsReason1ShortDescription:
    "write here for a whyChooseUsReason1ShortDescription",
  whyChooseUsReason2: "write here for a whyChooseUsReason2",
  whyChooseUsReason2ShortDescription:
    "write here for a whyChooseUsReason2ShortDescription",
  whyChooseUsReason3: "write here for a whyChooseUsReason3",
  whyChooseUsReason3ShortDescription:
    "write here for a whyChooseUsReason3ShortDescription",
  shortServiceShortIntro: "write here for a shortServiceShortIntro",
  serviceIntro: "write here for a serviceIntro",
  callUsTextDescription: "write here for a callUsTextDescription",
  serviceDescription: "write here for a serviceDescription",
  aboutUsHeading: "write here for a aboutUsHeading",
  aboutUsDescription: "write here for a aboutUsDescription",
  contactUsHeading: "write here for a contactUsHeading",
};

function Design() {
  const webSiteList: Website[] = [
    {
      link: "https://ai-builder-backend.onrender.com/Template%202.html",
      option: "option 1",
      templateid: 1,
      templatename: "common tempate 1",
    },
    {
      link: "https://ai-builder-backend.onrender.com/template3.html",
      option: "option 2",
      templateid: 2,
      templatename: "common tempate 2",
    },
    {
      link: "https://ai-builder-backend.onrender.com/template4.html",
      option: "option 3",
      templateid: 3,
      templatename: "common tempate 3",
    },
    {
      link: "https://ai-builder-backend.onrender.com/template4.html",
      option: "option 4",
      templateid: 4,
      templatename: "common tempate 4",
    },
    {
      link: "https://ai-builder-backend.onrender.com/",
      option: "option 5",
      templateid: 5,
      templatename: "common tempate 5",
    },
    {
      link: "https://ai-builder-backend.onrender.com/",
      option: "option 6",
      templateid: 6,
      templatename: "common tempate 6",
    },
  ];

  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isActive, setIsActive] = useState(false);
  const [selectedTemplateDetails, setSelectedTemplateDetails] = useState(
    webSiteList[0]
  );
  const dispatch = useDispatch();
  const [Loader, setLoader] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [temLoader, settemLoader] = useState(false);
  const [gptWebContent, setgptWebContent] = useState<typeof structure>();
  const businessName = useSelector(
    (state: RootState) => state.userData.businessName
  );
  const description = useSelector(
    (state: RootState) => state.userData.description1
  );
  const userdetail = useSelector((state: RootState) => state.userData);
  const templname = useSelector(
    (state: RootState) => state.userData.templateid
  );

  useEffect(() => {
    // Simulate a loading delay
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const sendDataToBackend = async () => {
    try {
      const response = await axios.post(
        "https://ai-builder-backend.onrender.com/",
        {
          prompt: prompt,
        }
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };

  const setContent = (chatgptContent: typeof structure) => {
    dispatch(setData(chatgptContent));
  };

  const setDetails = () => {
    const tempid = selectedTemplateDetails.templateid;
    const tempname = selectedTemplateDetails.templatename;
    dispatch(setTemplateId(tempid));
    dispatch(setTemplatename(tempname));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendMessageToChild = (chatgptContent: any) => {
    const iframes = document.getElementsByTagName("iframe");
    // setContent(chatgptContent);

    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];

      console.log("data sent to iframe", chatgptContent);
      iframe.contentWindow?.postMessage(chatgptContent, "*");
    }
  };

  const fetchData = async () => {
    const prompt = JSON.stringify({
      prompt: `Write content for a website with the structure ${JSON.stringify(
        structure
      )} for ${businessName} business, and the description is: ${description}.`,
    });
    try {
      const response = await fetch(
        "https://ai-builder-backend.onrender.com/get-description",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: prompt,
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const chatgptContent = JSON.parse(data.response);
      console.log("chatgpt content:", chatgptContent);

      setgptWebContent(chatgptContent);

      sendMessageToChild(chatgptContent);

      settemLoader(false);
    } catch (error) {
      console.info("Error:", error);
    }
  };
  useLayoutEffect(() => {
    settemLoader(true);

    fetchData();
  }, []);

  useEffect(() => {
    const handleMouseEnter = (iframe: HTMLIFrameElement) => {
      iframe.contentWindow?.postMessage(
        { type: "scroll", scrollAmount: 20 },
        "*"
      );
    };

    const handleMouseLeave = (iframe: HTMLIFrameElement) => {
      iframe.contentWindow?.postMessage(
        { type: "stopScrolling", scrollAmount: 20 },
        "*"
      );
    };

    const iframes = document.getElementsByTagName("iframe");
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];
      iframe.addEventListener("mouseenter", () => handleMouseEnter(iframe));
      iframe.addEventListener("mouseleave", () => handleMouseLeave(iframe));
    }

    return () => {
      for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i];
        iframe.removeEventListener("mouseenter", () =>
          handleMouseEnter(iframe)
        );
        iframe.removeEventListener("mouseleave", () =>
          handleMouseLeave(iframe)
        );
      }
    };
  }, []);

  return (
    <MainLayout>
      <div className="h-full w-full relative">
        <div className="w-full h-full flex flex-col items-center bg-app-light-background overflow-y-auto">
          <div className="mx-auto flex flex-col overflow-x-hidden w-full">
            <div className="space-y-5 px-5 md:px-10 lg:px-14 xl:px-15 pt-12">
              <h1 className="text-3xl font-semibold">
                Choose the structure for your website
              </h1>
              <p className="text-base font-normal leading-6 text-app-text text-txt-secondary-500">
                Select your preferred structure for your website from the
                options below.
              </p>
            </div>
            <form className="sticky -top-1.5 z-10 pt-4 pb-4 bg-zip-app-light-bg px-5 md:px-10 lg:px-14 xl:px-15">
              <div>
                <div className="flex relative items-center">
                  <div className="h-12 flex items-center mr-0">
                    <div className="absolute left-3 flex items-center">
                      <button className="w-auto h-auto p-0 flex items-center justify-center cursor-pointer bg-transparent border-0 focus:outline-none">
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
                      className=" w-full h-12  placeholder:zw-placeholder zw-input rounded-md px-3 border focus:border-2  outline-none  shadow-sm  border-app-border focus:border-app-secondary focus:ring-transparent pl-11 false "
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </form>

            <div className="custom-confirmation-modal-scrollbar relative px-5 md:px-10 lg:px-14 xl:px-15 xl:max-w-full">
              <div className="grid grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 auto-rows-auto items-start justify-center gap-6 mb-10">
                {loading
                  ? [...Array(6)].map((_, index) => (
                      <Box
                        key={index}
                        className="w-full flex justify-center mb-8"
                      >
                        <Box className="w-full border border-border-tertiary border-solid rounded-t-xl">
                          <Box className="w-full relative h-fit bg-zip-app-highlight-bg border-1">
                            <Box className="w-full aspect-[164/179] relative overflow-hidden bg-[#E5E7EB] rounded-xl p-4">
                              <div className="flex gap-4">
                                {" "}
                                <Skeleton
                                  variant="text"
                                  width={"80%"}
                                  height={20}
                                />
                                <Skeleton
                                  variant="rounded"
                                  width={"20%"}
                                  height={20}
                                />
                              </div>
                              <div className="flex mt-12 gap-4">
                                <Skeleton
                                  variant="rounded"
                                  width={210}
                                  height={120}
                                />
                                <Skeleton
                                  variant="rounded"
                                  width={140}
                                  height={120}
                                />
                              </div>
                              <div className="flex mt-4 gap-4 justify-center">
                                <Skeleton
                                  variant="text"
                                  width={210}
                                  height={20}
                                />
                              </div>
                              <div className="flex mt-8 gap-4">
                                <div>
                                  <Skeleton
                                    variant="text"
                                    sx={{ fontSize: "1rem" }}
                                    width={210}
                                  />
                                  <Skeleton
                                    variant="text"
                                    sx={{ fontSize: "1rem" }}
                                    width={210}
                                  />
                                  <Skeleton
                                    variant="text"
                                    sx={{ fontSize: "1rem" }}
                                    width={210}
                                  />
                                  <Skeleton
                                    variant="text"
                                    sx={{ fontSize: "1rem" }}
                                    width={210}
                                  />
                                </div>
                                <Skeleton
                                  variant="rounded"
                                  width={140}
                                  height={120}
                                />
                              </div>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    ))
                  : webSiteList.map((list: Website, index: number) => (
                      <div
                        key={index}
                        className="w-full flex justify-center rounded-b-2xl"
                      >
                        <div className="w-full border border-border-tertiary border-solid rounded-t-xl mb-8 rounded-b-lg">
                          <div className="w-full relative h-fit bg-zip-app-highlight-bg border-1">
                            <div className="w-full aspect-[164/179] relative overflow-hidden bg-neutral-300 rounded-xl">
                              <div className="w-full max-h-[calc(19_/_15_*_100%)] pt-[calc(19_/_15_*_100%)] select-none relative shadow-md overflow-hidden origin-top-left bg-neutral-300">
                                <iframe
                                  id="myIframe"
                                  title="Child iFrame"
                                  className="scale-[0.33] w-[1200px] h-[1600px] absolute left-0 top-0 origin-top-left select-none"
                                  src={list.link}
                                ></iframe>
                              </div>
                            </div>
                            <div className="relative h-14">
                              <div className="absolute bottom-0 w-full h-14 flex items-center justify-between bg-white px-5 shadow-template-info rounded-b-lg">
                                <div className="zw-base-semibold text-app-heading capitalize">
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
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 pb-8 bg-app-light-background  px-10 lg:px-16 xl:px-36 z-50 bg-[#F9FCFF]">
          <div className="flex xs:items-center items-start justify-between">
            <div className="flex flex-row xs:flex-row xs:items-center items-start gap-x-10 gap-y-10 xs:gap-y-0 flex-wrap">
              <button className=" tertiary px-[30px] py-[10px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-md w-[150px]">
                <div className="flex justify-center items-center gap-x-2">
                  <div>Continue</div>
                  {/* {Loader && (
                          <button
                            type="button"
                            class="bg-palatinate-blue-600 "
                            disabled
                          >
                            <svg
                              class="text-white animate-spin"
                              viewBox="0 0 64 64"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                            >
                              <path
                                d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                                stroke="currentColor"
                                stroke-width="5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>
                              <path
                                d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                                stroke="currentColor"
                                stroke-width="5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="text-gray-900"
                              ></path>
                            </svg>
                          </button>
                        )} */}
                </div>
              </button>

              <button className=" previous-btn flex px-[10px] py-[13px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-md w-[150px] gap-3 justify-center">
                <ArrowBackIcon />
                Previous
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Design;
