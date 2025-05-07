import React, {
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from "react";
import MainLayout from "../../Layouts/MainLayout";
import { RootState } from "../../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import useTemplateList from "../../../hooks/useTemplateList";
import axios from "axios";
import { saveSelectedTemplate } from "../../../infrastructure/api/wordpress-api/desgin/saveSelectedtemplate";
import useDomainEndpoint from "../../../hooks/useDomainEndpoint";
import {
  setTemplateId,
  setTemplatename,
  setTemplateList,
  setStyle,
  setColor,
  setFont,
} from "../../../Slice/activeStepSlice";
import Popup from "../../component/dialogs/Popup";
import StyleRemoveWarning from "../../component/dialogs/StyleRemoveWarning";
import useStoreContent from "../../../hooks/useStoreContent ";
import UpgradePopup from "../../component/dialogs/UpgradePopup";
import info from "../../../assets/icons/info.svg";
import { Tooltip } from "@mui/material";
import { handleEnterKey } from "../../../core/utils/handleEnterKey";
import { Template } from "../../../types/design.type";
import SomethingWrong from "../../component/dialogs/SomethingWrong";

const API_URL = import.meta.env.VITE_API_BACKEND_URL;

function Design() {
  const { activeIndex, handleBoxClick } = useTemplateList();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [issue, setIssue] = useState(false);

  const [templateList, settemplateList] = useState<Template[]>([]);
  const businessName = useSelector(
    (state: RootState) => state.userData.businessName
  );
  const description = useSelector(
    (state: RootState) => state.userData.description1
  );
  const description2 = useSelector(
    (state: RootState) => state.userData.description2
  );

  const activeTemplate = useSelector(
    (state: RootState) => state.userData.templateList
  );

  const category =
    useSelector((state: RootState) => state.userData.category) || "";
  // const [text, setText] = useState(category);

  const [showValidationError, setshowValidationError] =
    useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showError, setshowError] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { getDomainFromEndpoint } = useDomainEndpoint();
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [warning, setWarning] = useState<boolean>(false);
  const previousTemplate = useSelector(
    (state: RootState) => state.userData.templateList
  );
  // const [token, setToken] = useState("");

  const [newTemplate, setNewTemplate] = useState<{
    index: number;
    template: Template;
  } | null>(null);

  const storeContent = useStoreContent();

  const handlePopupClose = () => {
    setshowValidationError(true);
    setShowPopup(false);
  };

  // const previousSelectedTemplate = useSelector(
  //   (state: RootState) => state?.userData?.templateList
  // );
  const previousFont = useSelector((state: RootState) => state?.userData?.font);
  const wp_token = useSelector((state: RootState) => state.user.wp_token);
  const previousColor = useSelector(
    (state: RootState) => state?.userData?.color
  );
  const userDetails = useSelector((state: RootState) => state.user);
  const [upgradePopup, setUpgradepopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   e.preventDefault();
  //   setText(e.target.value); // Set the input text for debounce
  // };

  const fetchTemplateList = useCallback(async (): Promise<void> => {
    // Ensure wp_token exists before making the API call
    if (!wp_token) {
      console.error("Token is not available, skipping API call.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}getTemplates`, {
        headers: {
          Authorization: `Bearer ${wp_token}`,
        },
      });
      const templates: Template[] = response.data?.data || [];
      setshowError(false);
      settemplateList(templates);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.error("Error fetching templates: Unauthorized (401)");
        } else {
          console.error(
            "Error fetching templates:",
            error.response?.status || error.message
          );
        }
      } else {
        console.error("An unexpected error occurred:", error);
      }

      setshowError(true); // Show error if the API call fails
    }
  }, [wp_token]);

  // API call to fetch templates based on category (debounced)
  // useLayoutEffect(() => {
  //   if (debouncedValue.length <= 0) {
  //     fetchTemplateList();
  //     return;
  //   }
  //   const fetchTemplates = async () => {
  //     let url: string = "";
  //     try {
  //       if (category.length == 0) {
  //         url = await axios.get(
  //           `https://dev.gravitywrite.com/api/getTemplates`
  //         );
  //       } else {
  //         url = `https://dev.gravitywrite.com/api/getTemplates?site_category=${debouncedValue}`;
  //       }
  //       const response = await axios.get(url);
  //       // dispatch(setTemplateList(response?.data)); // Store templates in Redux

  //       if (response.data.data.length === 0) {
  //         setshowError(true);
  //         settemplateList(response.data.data);

  //         return;
  //       }
  //       if (response.data.data.length >= 0) {
  //         setshowError(false);
  //         settemplateList(response.data.data);
  //       }

  //       settemplateList(response.data.data);

  //       console.log("response data", response.data.data);
  //       dispatch(setCategory(debouncedValue)); // Update category in Redux
  //     } catch (error) {
  //       console.error("Error fetching templates:", error);
  //       // setError(true);
  //     }
  //   };
  //   fetchTemplates();
  //   // }
  // }, [debouncedValue, dispatch]);

  const applyTemplateSelection = async (
    index: number,
    template: Template
  ): Promise<void> => {
    // setSelectedTemplateId(template.id);
    dispatch(setTemplateId(template.id));
    dispatch(setTemplatename(template.name));
    dispatch(setTemplateList(template));

    dispatch(setStyle(template.styles));

    // Save the selected template via API call
    const endpoint = getDomainFromEndpoint(
      "wp-json/custom/v1/update-form-details"
    );
    try {
      await saveSelectedTemplate(template, endpoint);
    } catch (error) {
      console.error("Error saving template to backend:", error);
    }

    handleBoxClick(index, template, template.id);
  };

  const fetchSelectedTemplate = useCallback(async () => {
    if (!hasFetched) {
      try {
        const endpoint = getDomainFromEndpoint(
          "wp-json/custom/v1/get-form-details"
        );
        const response = await axios.post(endpoint, {
          fields: ["templateList"],
        });

        const data = response.data;
        const parsedTemplate = JSON.parse(data.templateList);
        if (parsedTemplate.name) {
          setshowValidationError(true);
        }

        dispatch(setTemplateId(parsedTemplate.id));
        dispatch(setTemplatename(parsedTemplate.name));
        dispatch(setTemplateList(parsedTemplate));

        handleBoxClick(parsedTemplate.id, parsedTemplate, parsedTemplate.id);
      } catch (error) {
        console.error("Error fetching selected template:", error);
      }
      setHasFetched(true);
    }
  }, [
    hasFetched,
    dispatch,
    getDomainFromEndpoint,
    setshowValidationError,
    handleBoxClick,
    setHasFetched,
  ]);

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

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>): void => {
    const iframe = event.currentTarget.querySelector("iframe");
    if (iframe) {
      iframe?.contentWindow?.postMessage(
        { type: "scroll", scrollAmount: 20 },
        "*"
      );
    }
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>): void => {
    const iframe = event.currentTarget.querySelector("iframe");
    if (iframe) {
      iframe?.contentWindow?.postMessage(
        { type: "stopScrolling", scrollAmount: 40 },
        "*"
      );
    }
  };

  useEffect(() => {
    fetchTemplateList();
  }, [fetchTemplateList]);

  const handleTemplateSelection = async (index: number, template: Template) => {
    if (userDetails.plan == "Free" && template.is_premium) {
      setUpgradepopup(true);
      return;
    }
    setShowPopup(false);
    setshowValidationError(true);
    if (
      template.id !== previousTemplate.id &&
      (previousFont.primary || previousColor.primary)
    ) {
      setWarning(true);
      setNewTemplate({ index, template });
      return;
    }
    handleBoxClick(index, template, template.id);

    await applyTemplateSelection(index, template);
  };

  useEffect(() => {
    fetchSelectedTemplate();
  }, [
    hasFetched,
    getDomainFromEndpoint,
    templateList,
    handleBoxClick,
    fetchSelectedTemplate,
  ]);

  const handleContinue = () => {
    if (!activeTemplate?.name) {
      setshowValidationError(true);
    } else {
      setshowValidationError(false);
      setShowPopup(true);
    }
  };

  const handleWarningContinue = async () => {
    setIsLoading(true);
    try {
      dispatch(setColor({ primary: "", secondary: "" }));
      dispatch(setFont({ primary: "", secondary: "" }));
      await storeContent({ color: { primary: "", secondary: "" } });
      await storeContent({ font: { primary: "", secondary: "" } });

      if (newTemplate) {
        await applyTemplateSelection(newTemplate.index, newTemplate.template);
      }

      setWarning(false);
    } catch (error) {
      console.error("Error while changing template:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWarningClose = () => {
    setWarning(false);
  };

  useEffect(() => {
    if (wp_token) {
      fetchTemplateList();
    } else {
      console.error("Token not available, waiting for Redux update.");
    }
  }, [fetchTemplateList, wp_token]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    handleEnterKey({ event, callback: handleContinue }); // Use your utility function
  };

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
      {warning && (
        <StyleRemoveWarning
          onClose={handleWarningClose}
          onContinue={handleWarningContinue}
          isLoading={isLoading}
        />
      )}
      {upgradePopup && (
        <UpgradePopup
          alertType="upgradeTemp"
          onClose={() => setUpgradepopup(false)}
        />
      )}

      {issue && <SomethingWrong />}

      <div className="flex flex-col justify-between h-full p-10">
        <div className="flex flex-col w-full h-full mx-auto overflow-x-hidden">
          <h1 className="text-3xl font-semibold">
            Pick a template for your website
          </h1>
          <p className="mt-3 text-base font-normal leading-6 text-app-text text-txt-secondary-500">
            Choose the design that best fits your website’s purpose. You can
            always customize it later!
          </p>

          <form
            className="my-8"
            onSubmit={(e) => e.preventDefault}
            onKeyDown={handleKeyDown}
          >
            <div className="relative flex items-center">
              <div className="flex items-center h-12 mr-0">
                <div className="absolute flex items-center left-3">
                  <button
                    className="flex items-center justify-center w-auto h-auto p-0 bg-transparent border-0 cursor-pointer focus:outline-none"
                    disabled
                  >
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
                  className="w-full h-12 px-3 border rounded-md shadow-sm outline-none placeholder:zw-placeholder zw-input border-app-border focus:border-app-secondary  pl-11 false"
                  value={category}
                  disabled
                  // onChange={handleSearch}
                  placeholder="Search categories..."
                />
              </div>
            </div>
          </form>
          <div className="relative overflow-auto custom-confirmation-modal-scrollbar md:px-10 lg:px-14 xl:px-15 xl:max-w-full">
            {showError && (
              <div className="text-center ">No templates found</div>
            )}
            <div className="flex flex-wrap items-start justify-start p-1 gap-x-6 gap-y-8">
              {templateList.map((list: Template, index: number) => (
                <div
                  key={index}
                  className={`w-[310px] h-auto rounded-t-xl rounded-b-lg ${
                    activeIndex === list?.id
                      ? "ring ring-palatinate-blue-600 rounded-lg "
                      : ""
                  } `}
                  onClick={() => {
                    // posthog?.capture("template_selection", {
                    //   template_id: list?.id,
                    //   template_name: list?.name,
                    //   is_premium: list?.is_premium,
                    //   category: category,
                    // });
                    handleTemplateSelection(list?.id, list);
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className={`w-full rounded-t-xl`}>
                    {/* Iframe Content */}
                    <div className="w-full aspect-[164/179] relative overflow-hidden bg-neutral-300 rounded-t-xl">
                      <div className="w-full max-h-[calc(19_/_15_*_100%)] pt-[calc(19_/_15_*_100%)] select-none relative shadow-md overflow-hidden origin-top-left bg-neutral-300">
                        <iframe
                          id="myIframe"
                          title={`Template ${index + 1}`}
                          className={`scale-[0.23] w-[1360px] h-[1480px] absolute left-0 top-0 origin-top-left select-none`}
                          src={list?.pages?.[0]?.iframe_url} // Use the iframe URL from the first page in the template
                        ></iframe>
                      </div>
                      {/* Premium Label */}
                      {list.is_premium && (
                        <div className="absolute top-3 right-3 text-[10px] font-medium py-0.5 text-white flex items-center justify-center rounded-3xl bg-[#FE8E01] px-2.5 pointer-events-none">
                          Premium
                        </div>
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 w-full h-full bg-transparent cursor-pointer"></div>
                    </div>

                    {/* Bottom Info */}
                    <div className="relative h-14">
                      <div className="absolute bottom-0 flex items-center justify-between w-full px-5 bg-white rounded-b-lg h-14 shadow-template-info">
                        <div className="capitalize zw-base-semibold text-app-heading">
                          {list.name}
                        </div>
                        <Tooltip
                          placement="top"
                          title={
                            <div className="flex flex-col">
                              {list.pages.map((page, index) => (
                                <div className="px-2 py-1" key={index}>
                                  {page.title}
                                </div>
                              ))}
                            </div>
                          }
                        >
                          <img src={info} alt="info-icon" />
                        </Tooltip>
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
          <div className="flex items-center pt-10 gap-x-4">
            <Link to={"/contact"}>
              <button className="previous-btn flex px-[10px] py-[15px] text-base text-white font-medium sm:mt-2 rounded-md w-[150px] gap-3 justify-center">
                <img
                  src="https://plugin.mywpsite.org/arrow.svg"
                  alt="arrow-icon"
                />
                Previous
              </button>
            </Link>
            <button
              className={`tertiary px-[30px] py-[15px] text-base text-white sm:mt-2 rounded-md w-[150px] ${
                !showValidationError && "opacity-50"
              }`}
              // onClick={() => setShowPopup(true)}
              onClick={handleContinue}
              disabled={!showValidationError}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Design;
