import React, { useEffect, useState } from "react";
import CustomizeLayout from "../../Layouts/CustomizeLayout";
import { RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import useDomainEndpoint from "../../../hooks/useDomainEndpoint";
import { setTemplateList } from "../../../Slice/activeStepSlice";

function CustomDesign() {
  const [parsedTemplateList, setParsedTemplateList] = useState(null); // Local state to store parsed data
  const templateListFromRedux = useSelector(
    (state: RootState) => state.userData.templateList // Using Redux as is
  );
  const dispatch = useDispatch();
  const { getDomainFromEndpoint } = useDomainEndpoint();

  // Local variable for the iframe URL
  const currentUrl =
    parsedTemplateList?.[0]?.iframe_url || "https://creative.mywpsite.org/";

  const sendMessageToIframes = (type: string, payload) => {
    const iframes = document.getElementsByTagName("iframe");

    if (iframes.length > 0) {
      for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i];

        if (type == "changeGlobalColors") {
          const iframes = document.getElementsByTagName("iframe");
          for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];
            iframe?.contentWindow?.postMessage(
              {
                type: "changeGlobalColors",
                primaryColor: payload.primary,
                secondaryColor: payload.secondary,
              },
              "*"
            );
          }
        }

        iframe?.contentWindow?.postMessage(
          {
            type: "changeGlobalColors",
            primaryColor: payload.primary,
            secondaryColor: payload.secondary,
          },
          "*"
        );
      }
    } else {
      console.log("No iframes found");
    }
  };

  const fetchInitialData = async () => {
    const url = getDomainFromEndpoint("/wp-json/custom/v1/get-form-details");
    const iframe = document.getElementById("myIframe") as HTMLIFrameElement;
    // const url =
    //   "https://solitaire-sojourner-02c.zipwp.link/wp-json/custom/v1/get-form-details";
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
          sendMessageToIframes("changeGlobalColors", colors);
        }
        if (result.font) {
          iframe.contentWindow?.postMessage(
            {
              type: "changeFont",
              font: result.font,
            },
            "*"
          );
        }
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const fetchTemplateData = async () => {
    const url = getDomainFromEndpoint(
      "/wp-json/custom/v1/get-selected-template"
    );
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // Empty body as per your instructions
      });
      const result = await response.json();

      if (result && result.length > 0) {
        // Parse the template_json_data from the response
        const parsedData = JSON.parse(result[0].template_json_data);
        setParsedTemplateList(parsedData); // Save locally in component state
      }
    } catch (error) {
      console.error("Error fetching template data:", error);
    }
  };

  useEffect(() => {
    fetchTemplateData();
  }, []);

  const onLoadmsg = () => {
    fetchInitialData();
  };
  return (
    <CustomizeLayout>
      <iframe
        src={currentUrl}
        title="website"
        id="myIframe"
        className="h-full w-full transition-fade shadow-lg rounded-lg"
        onLoad={onLoadmsg}
      />
    </CustomizeLayout>
  );
}

export default CustomDesign;
