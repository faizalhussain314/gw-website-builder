import React, { useEffect } from "react";
import CustomizeLayout from "../../Layouts/CustomizeLayout";
import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";

function CustomDesign() {
  const templateList = useSelector(
    (state: RootState) => state.userData.templateList
  );
  console.log("====================================");
  console.log(templateList);
  console.log("====================================");
  const currentUrl = templateList[0]?.link || "https://gravitywrite.com/de";

  const initialStyles = useSelector((state: RootState) => ({
    primaryColor: state.userData.color.primary,
    secondaryColor: state.userData.color.secondary,
    fontFamily: state.userData.font,
  }));

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
