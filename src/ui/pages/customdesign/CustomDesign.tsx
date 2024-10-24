import React, { useEffect, useState } from "react";
import CustomizeLayout from "../../Layouts/CustomizeLayout";
import { useDispatch } from "react-redux";
import useDomainEndpoint from "../../../hooks/useDomainEndpoint";
import { setTemplateList } from "../../../Slice/activeStepSlice";
import PlumberPageSkeleton from "../../component/PlumberPageSkeleton ";

function CustomDesign() {
  const [parsedTemplateList, setParsedTemplateList] = useState(null);

  const dispatch = useDispatch();
  const { getDomainFromEndpoint } = useDomainEndpoint();

  // Local variable for the iframe URL
  const currentUrl = parsedTemplateList?.pages?.[0]?.iframe_url;

  const sendMessageToIframes = (type: string, payload) => {
    const iframes = document.getElementsByTagName("iframe");

    if (iframes.length > 0) {
      for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i];

        // Check the type and send the appropriate post message only if the values are not empty
        if (
          type === "changeGlobalColors" &&
          (payload.primary || payload.secondary)
        ) {
          iframe?.contentWindow?.postMessage(
            {
              type: "changeGlobalColors",
              primaryColor: payload.primary,
              secondaryColor: payload.secondary,
            },
            "*"
          );
        }

        if (type === "changeFont" && payload.font) {
          iframe?.contentWindow?.postMessage(
            {
              type: "changeFont",
              font: payload.font,
            },
            "*"
          );
        }

        if (type === "changeLogo" && payload.logoUrl) {
          iframe?.contentWindow?.postMessage(
            {
              type: "changeLogo",
              logoUrl: payload.logoUrl,
            },
            "*"
          );
        }
      }
    } else {
      console.log("No iframes found");
    }
  };

  const fetchInitialData = async () => {
    const url = getDomainFromEndpoint("/wp-json/custom/v1/get-form-details");
    const iframe = document.getElementById("myIframe") as HTMLIFrameElement;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: ["color", "font", "logo"] }),
      });
      const result = await response.json();

      if (result) {
        // If color data exists, parse it and send to iframe
        if (result.color) {
          const colors = JSON.parse(result.color);
          sendMessageToIframes("changeGlobalColors", colors);
        }

        // If font data exists, send it to the iframe
        if (result.font) {
          sendMessageToIframes("changeFont", { font: result.font });
        }

        // If logo data exists, send it to the iframe
        if (result.logo) {
          sendMessageToIframes("changeLogo", { logoUrl: result.logo });
        }
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const sendNonClickable = () => {
    const iframe = document.getElementById("myIframe") as HTMLIFrameElement;
    console.log("event triggered");
    iframe.contentWindow?.postMessage(
      {
        type: "nonClickable",
        transdiv: `<div id="overlay" style="position:fixed;width: 100vw;height: 100vh;z-index: 1000000;top: 0;left: 0;"></div>`,
      },
      "*"
    );
  };

  const fetchTemplateData = async () => {
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
  };

  useEffect(() => {
    fetchTemplateData();
  }, []);

  const onLoadmsg = () => {
    sendNonClickable();
    fetchInitialData();
  };
  return (
    <CustomizeLayout>
      {currentUrl ? (
        <iframe
          src={currentUrl}
          title="website"
          id="myIframe"
          className="h-full w-full transition-fade shadow-lg rounded-lg"
          onLoad={onLoadmsg}
        />
      ) : (
        <PlumberPageSkeleton />
      )}
    </CustomizeLayout>
  );
}

export default CustomDesign;
