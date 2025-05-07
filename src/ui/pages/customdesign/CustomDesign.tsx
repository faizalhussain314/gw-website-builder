import React, { useCallback, useEffect, useState } from "react";
import CustomizeLayout from "../../Layouts/CustomizeLayout";
import { useDispatch, useSelector } from "react-redux";
import useDomainEndpoint from "../../../hooks/useDomainEndpoint";
import { setTemplateList } from "../../../Slice/activeStepSlice";
import PlumberPageSkeleton from "../../component/PlumberPageSkeleton ";
import { RootState } from "../../../store/store";
import { sendIframeMessage } from "../../../core/utils/sendIframeMessage.utils";
import UpgradeWords from "../../component/dialogs/UpgradeWords";
import PlanExpired from "../../component/dialogs/PlanExpired";
import SomethingWrong from "../../component/dialogs/SomethingWrong";

function CustomDesign() {
  const [parsedTemplateList, setParsedTemplateList] = useState(null);
  const [planExpired, setPlanExpired] = useState(false);
  const [issue, setIssue] = useState(false);
  const dispatch = useDispatch();
  const { getDomainFromEndpoint } = useDomainEndpoint();
  const businessName = useSelector(
    (state: RootState) => state.userData.businessName
  );

  const currentUrl = parsedTemplateList?.pages?.[0]?.iframe_url;
  const [limitReached, setLimitReached] = useState(false);

  const fetchInitialData = async () => {
    const url = getDomainFromEndpoint("/wp-json/custom/v1/get-form-details");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: ["color", "font", "logo"] }),
      });
      const result = await response.json();

      if (result) {
        if (result.color) {
          const colors = JSON.parse(result.color);
          sendIframeMessage("changeGlobalColors", colors);
        }

        if (result.font) {
          sendIframeMessage("changeFont", { font: result.font });
        }

        if (result.logo) {
          sendIframeMessage("changeLogo", { logoUrl: result.logo });
        } else {
          sendIframeMessage("bussinessName", businessName);
        }
        return;
      }

      sendIframeMessage("bussinessName", businessName);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const sendNonClickable = () => {
    const iframe = document.getElementById("myIframe") as HTMLIFrameElement;

    iframe.contentWindow?.postMessage(
      {
        type: "nonClickable",
        transdiv: `<div id="overlay" style="position:fixed;width: 100vw;height: 100vh;z-index: 1000000;top: 0;left: 0;"></div>`,
      },
      "*"
    );
  };

  const fetchTemplateData = useCallback(async () => {
    const url = getDomainFromEndpoint("/wp-json/custom/v1/get-form-details");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: ["templateList"] }),
      });
      const result = await response.json();

      if (result && result.templateList) {
        const parsedData = JSON.parse(result.templateList);
        setParsedTemplateList(parsedData);

        dispatch(setTemplateList(parsedData));
      }
    } catch (error) {
      console.error("Error fetching template data:", error);
    }
  }, [dispatch, getDomainFromEndpoint]);

  useEffect(() => {
    fetchTemplateData();
  }, [fetchTemplateData]);

  const onLoadmsg = () => {
    sendNonClickable();
    fetchInitialData();
  };
  return (
    <CustomizeLayout
      setLimitReached={setLimitReached}
      setPlanExpired={setPlanExpired}
      setIssue={setIssue}
    >
      {limitReached && <UpgradeWords />}
      {planExpired && <PlanExpired />}
      {issue && <SomethingWrong />}
      {/* Pass setter */}
      {currentUrl ? (
        <iframe
          src={currentUrl}
          title="website"
          id="myIframe"
          className={`h-full w-full transition-fade shadow-lg rounded-lg ${
            limitReached && "hidden"
          }`}
          onLoad={onLoadmsg}
        />
      ) : (
        <PlumberPageSkeleton />
      )}
    </CustomizeLayout>
  );
}

export default CustomDesign;
