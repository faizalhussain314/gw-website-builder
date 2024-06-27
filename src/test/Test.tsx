import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Test: React.FC = () => {
  const businessName = useSelector(
    (state: RootState) => state.userData.businessName
  );
  const description = useSelector(
    (state: RootState) => state.userData.description1
  );

  const sendMessageToIframe = (data: {
    type: string;
    businessName: string;
    description: string;
  }) => {
    const iframe = document.getElementById("myIframe") as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(data, "*"); // Replace '*' with specific origin for security
    } else {
      console.log("Iframe element or its contentWindow not found!");
    }
  };

  useEffect(() => {
    // Send business name and description to iframe when component mounts
    setTimeout(() => {
      sendMessageToIframe({ type: "start", businessName, description });
    }, 1000);
  }, [businessName, description]);

  return (
    <div className="h-screen flex font-[inter] w-screen">
      <iframe
        id="myIframe"
        src="http://localhost:8080/test1.html"
        title="website"
        className="h-full w-full"
      ></iframe>
    </div>
  );
};

export default Test;
