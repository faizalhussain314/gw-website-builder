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

  const currentUrl = templateList[0]?.link || "https://tours.mywpsite.org/";
  const { getDomainFromEndpoint } = useDomainEndpoint();

  const initialStyles = useSelector((state: RootState) => ({
    primaryColor: state.userData.color.primary,
    secondaryColor: state.userData.color.secondary,
    fontFamily: state.userData.font,
  }));

  useEffect(() => {
    const sendMessageToIframes = (type: string, payload) => {
      const iframes = document.getElementsByTagName("iframe");

      if (iframes.length > 0) {
        for (let i = 0; i < iframes.length; i++) {
          const iframe = iframes[i];

          // Define onload behavior
          iframe.onload = () => {
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
            console.log(`Iframe loaded, sending ${type}:`, payload);
          };

          // If iframe is already loaded, send the message immediately
          // if (iframe?.contentWindow) {
          //   if (type == "changeGlobalColors") {
          //     const iframes = document.getElementsByTagName("iframe");
          //     for (let i = 0; i < iframes.length; i++) {
          //       const iframe = iframes[i];
          //       iframe?.contentWindow?.postMessage(
          //         {
          //           type: "changeGlobalColors",
          //           primaryColor: payload.primary,
          //           secondaryColor: payload.secondary,
          //         },
          //         "*"
          //       );
          //     }
          //   }
          //   iframe?.contentWindow?.postMessage({ type, ...payload }, "*");
          //   console.log(`Iframe is already loaded, sending ${type}:`, payload);
          // }
        }
      } else {
        console.log("No iframes found");
      }
    };

    const fetchInitialData = async () => {
      const url = getDomainFromEndpoint("/wp-json/custom/v1/get-form-details");
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
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [dispatch, getDomainFromEndpoint]);

  useEffect(() => {
    const iframe = document.getElementById("myIframe") as HTMLIFrameElement;
    if (iframe) {
      iframe.onload = () => {
        if (
          initialStyles.primaryColor &&
          initialStyles.secondaryColor &&
          initialStyles.fontFamily
        ) {
          iframe.contentWindow?.postMessage(
            {
              type: "changeGlobalColors",
              primaryColor: initialStyles.primaryColor,
              secondaryColor: initialStyles.secondaryColor,
            },
            "*"
          );
          iframe.contentWindow?.postMessage(
            {
              type: "changeFont",
              font: initialStyles.fontFamily,
            },
            "*"
          );
        }
      };
    }
  }, [initialStyles]);

  console.log("currenturl", currentUrl);

  return (
    <CustomizeLayout>
      <iframe
        src={currentUrl}
        title="website"
        id="myIframe"
        className="h-full w-full transition-fade shadow-lg rounded-lg"
      />
    </CustomizeLayout>
  );
}

export default CustomDesign;
