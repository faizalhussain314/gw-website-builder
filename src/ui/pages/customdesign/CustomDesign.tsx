import React, { useEffect } from "react";
import CustomizeLayout from "../../Layouts/CustomizeLayout";
import { RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import useDomainEndpoint from "../../../hooks/useDomainEndpoint";

function CustomDesign() {
  const templateList = useSelector(
    (state: RootState) => state.userData.templateList
  );
  const dispatch = useDispatch();
  console.log("template list type:", templateList);
  const currentUrl =
    templateList?.[0]?.pages?.[0]?.iframe_url ||
    "https://creative.mywpsite.org/";
  const { getDomainFromEndpoint } = useDomainEndpoint();

  const initialStyles = useSelector((state: RootState) => ({
    primaryColor: state.userData.color.primary,
    secondaryColor: state.userData.color.secondary,
    fontFamily: state.userData.font,
  }));

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

  console.log("currenturl", currentUrl);

  const onLoadmsg = () => {
    fetchInitialData();
  };

  return (
    <CustomizeLayout>
      <iframe
        src={templateList?.[0]?.pages?.[0]?.iframe_url}
        title="website"
        id="myIframe"
        className="h-full w-full transition-fade shadow-lg rounded-lg"
        onLoad={onLoadmsg}
      />
    </CustomizeLayout>
  );
}

export default CustomDesign;
