import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  Fragment,
} from "react";
import { RootState } from "../../../store/store";
import { useSelector, useDispatch } from "react-redux";
import useTemplateList from "@hooks/useTemplateList";
import useIframeScrollHandlers from "@hooks/useIframeScrollHandlers";
import axios from "axios";
import {
  setTemplateId,
  setTemplatename,
  setTemplateList,
  setStyle,
  setColor,
  setFont,
} from "@Slice/activeStepSlice";
import {
  Popup,
  StyleRemoveWarning,
  UpgradePopup,
  SomethingWrong,
} from "@dialog";
import { handleEnterKey } from "@utils";
import { Template } from "types/design.type";
import {
  getFormDataByName,
  saveSelectedTemplate,
  updateFormDetail,
} from "@api/wordpress-api";
import {
  DesignHeader,
  NavigationButtons,
  SearchForm,
  TemplateGrid,
} from "@components";

import { fetchtemplateList } from "@api/laraval-api/templatelist.api";

function Design() {
  const { activeIndex, handleBoxClick } = useTemplateList();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [issue, setIssue] = useState(false);

  const [templateList, settemplateList] = useState<Template[]>([]);
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});

  // Use the custom hook for iframe scroll handlers
  useIframeScrollHandlers(templateList);

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

  const [showValidationError, setshowValidationError] =
    useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showError, setshowError] = useState<boolean>(false);

  const dispatch = useDispatch();
  const [warning, setWarning] = useState<boolean>(false);
  const previousTemplate = useSelector(
    (state: RootState) => state.userData.templateList
  );

  const [newTemplate, setNewTemplate] = useState<{
    index: number;
    template: Template;
  } | null>(null);

  const handlePopupClose = () => {
    setshowValidationError(true);
    setShowPopup(false);
  };

  const previousFont = useSelector((state: RootState) => state?.userData?.font);
  const wp_token = useSelector((state: RootState) => state.user.wp_token);
  const previousColor = useSelector(
    (state: RootState) => state?.userData?.color
  );
  const userDetails = useSelector((state: RootState) => state.user);
  const [upgradePopup, setUpgradepopup] = useState(false);
  const fetchedOnce = useRef(false);

  const [isLoading, setIsLoading] = useState(false);

  // Iframe loading handlers
  const handleIframeLoad = (templateId: number) => {
    setLoadingStates((prev) => ({
      ...prev,
      [templateId]: false,
    }));
  };

  const handleIframeLoadStart = (templateId: number) => {
    setLoadingStates((prev) => ({
      ...prev,
      [templateId]: true,
    }));
  };

  const fetchTemplateList = useCallback(async (): Promise<void> => {
    try {
      const templates: Template[] = await fetchtemplateList();
      setshowError(false);
      settemplateList(templates);

      const initialLoadingStates: { [key: number]: boolean } = {};
      templates.forEach((template) => {
        initialLoadingStates[template.id] = true;
      });
      setLoadingStates(initialLoadingStates);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error fetching templates:",
          error.response?.status || error.message
        );
      } else {
        console.error("An unexpected error occurred:", error);
      }

      setshowError(true);
    }
  }, []);

  const applyTemplateSelection = async (
    index: number,
    template: Template
  ): Promise<void> => {
    dispatch(setTemplateId(template.id));
    dispatch(setTemplatename(template.name));
    dispatch(setTemplateList(template));

    dispatch(setStyle(template.styles));

    try {
      await saveSelectedTemplate(template);
    } catch (error) {
      console.error("Error saving template to backend:", error);
    }

    handleBoxClick(index, template, template.id);
  };

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
      await updateFormDetail({ color: { primary: "", secondary: "" } });
      await updateFormDetail({ font: { primary: "", secondary: "" } });

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    handleEnterKey({ event, callback: handleContinue });
  };

  useEffect(() => {
    if (wp_token) {
      fetchTemplateList();
    } else {
      console.error("Token not available, waiting for Redux update.");
    }
  }, [fetchTemplateList, wp_token]);

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    (async () => {
      try {
        const response = await getFormDataByName(["templateList"]);
        const parsedTemplate = JSON.parse(response.templateList);
        if (parsedTemplate.name) setshowValidationError(true);

        dispatch(setTemplateId(parsedTemplate.id));
        dispatch(setTemplatename(parsedTemplate.name));
        dispatch(setTemplateList(parsedTemplate));
        handleBoxClick(parsedTemplate.id, parsedTemplate, parsedTemplate.id);
      } catch (err) {
        console.error("Error fetching selected template:", err);
      }
    })();
  }, [dispatch, handleBoxClick]);

  return (
    <Fragment>
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
          <DesignHeader />

          <SearchForm category={category} handleKeyDown={handleKeyDown} />

          <TemplateGrid
            templateList={templateList}
            showError={showError}
            activeIndex={activeIndex}
            loadingStates={loadingStates}
            onTemplateSelection={handleTemplateSelection}
            onIframeLoad={handleIframeLoad}
            onIframeLoadStart={handleIframeLoadStart}
          />
        </div>

        <NavigationButtons
          showValidationError={showValidationError}
          onContinue={handleContinue}
        />
      </div>
    </Fragment>
  );
}

export default Design;
