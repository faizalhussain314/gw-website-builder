import MainLayout from "../../Layouts/MainLayout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { setTemplateId, setTemplatename } from "../../../Slice/activeStepSlice";
import { Link } from "react-router-dom";
import Popup from "../../component/Popup";
import useTemplateList from "../../../hooks/useTemplateList";
import { useState, useEffect } from "react";

function Design() {
  const dispatch = useDispatch();
  const { templateList, activeIndex, selectedTemplateDetails, handleBoxClick } =
    useTemplateList();

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

  const setDetails = () => {
    if (selectedTemplateDetails) {
      const { templateid, templatename } = selectedTemplateDetails;
      dispatch(setTemplateId(templateid));
      dispatch(setTemplatename(templatename));
    }
  };

  useEffect(() => {
    setDetails();
  }, [selectedTemplateDetails]);

  useEffect(() => {
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
        const iframe = iframes[i];
        iframe.removeEventListener("mouseenter", onMouseEnter);
        iframe.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, []);

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
      <div className="h-full w-full relative">
        <div className="w-full h-full flex flex-col items-center bg-app-light-background overflow-y-auto">
          <div className="mx-auto flex flex-col overflow-x-hidden w-full">
            <div className="space-y-2 px-5 md:px-10 lg:px-14 xl:px-15 pt-12">
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
                      value={category}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </form>

            <div className="custom-confirmation-modal-scrollbar relative px-5 md:px-10 lg:px-14 xl:px-15 xl:max-w-full">
              <div className="grid grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 auto-rows-auto items-start justify-center gap-6 mb-10">
                {templateList.map((list: templatelist, index: number) => (
                  <div
                    key={index}
                    className="w-full flex justify-center rounded-b-2xl cursor-pointer"
                  >
                    <div
                      className={` w-full border border-border-tertiary border-solid rounded-t-xl mb-8 rounded-b-lg ${
                        activeIndex === index
                          ? "border-2 border-palatinate-blue-500  rounded-lg "
                          : "border"
                      } `}
                      onClick={() => handleBoxClick(index, list)}
                    >
                      <div className="w-full relative h-fit bg-zip-app-highlight-bg border-1">
                        <div className="w-full aspect-[164/179] relative overflow-hidden bg-neutral-300 rounded-xl">
                          <div className="w-full max-h-[calc(19_/_15_*_100%)] pt-[calc(19_/_15_*_100%)] select-none relative shadow-md overflow-hidden origin-top-left bg-neutral-300">
                            <iframe
                              id="myIframe"
                              title="Child iFrame"
                              className={`scale-[0.33] w-[1200px] h-[1600px] absolute left-0 top-0 origin-top-left select-none `}
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
        <div className="sticky bottom-0 pb-8 bg-app-light-background  px-10 lg:px-16 xl:px-36 z-30 bg-[#F9FCFF]">
          <div className="flex xs:items-center items-start justify-between">
            <div className="flex flex-row xs:flex-row xs:items-center items-start gap-x-10 gap-y-10 xs:gap-y-0 flex-wrap">
              {" "}
              <button
                className=" tertiary px-[30px] py-[10px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-md w-[150px]"
                onClick={() => setShowPopup(true)}
              >
                <div className="flex justify-center items-center gap-x-2">
                  <div>Continue</div>
                </div>
              </button>
              <Link to={"/contact"}>
                {" "}
                <button className=" previous-btn flex px-[10px] py-[13px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-md w-[150px] gap-3 justify-center">
                  <ArrowBackIcon />
                  Previous
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Design;
