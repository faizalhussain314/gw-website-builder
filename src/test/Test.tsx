import React, { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_BACKEND_URL;

function Test() {
  // State to hold the template list
  const [templateList, setTemplateList] = useState([]);
  // State to hold the selected template object
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Fetch the template list from API on component mount
  useEffect(() => {
    const fetchTemplateList = async () => {
      try {
        const response = await axios.get(`${API_URL}getTemplates`);
        const templates = response.data?.data || []; // Extract data from the API response
        setTemplateList(templates); // Set the template list in state
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchTemplateList();
  }, []);

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template); // Store the selected template in state
    console.log("Selected Template:", template); // You can use this state later
  };

  return (
    <div className="grid grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 auto-rows-auto items-start justify-center gap-6 mb-10">
      {templateList.length > 0 ? (
        templateList.map((template, index) => (
          <div
            key={index}
            className="w-full flex justify-center rounded-b-2xl cursor-pointer hover-element"
            onClick={() => handleTemplateSelect(template)} // Handle template selection
          >
            <div className="w-full border border-solid rounded-t-xl mb-8 rounded-b-lg border-border-tertiary">
              <div className="w-full aspect-[164/179] relative overflow-hidden bg-neutral-300 rounded-xl">
                <iframe
                  id="myIframe"
                  title={`Template ${index + 1}`}
                  className="scale-[0.33] w-[1200px] h-[1600px] absolute left-0 top-0 origin-top-left select-none"
                  src={template.pages?.[0]?.iframe_url || ""}
                ></iframe>
              </div>

              <div className="absolute top-3 right-3 text-xs leading-[1em] pt-1 pb-[4px] zw-xs-semibold text-white flex items-center justify-center rounded-3xl bg-[#F90] px-[12px] pointer-events-none">
                <div className="flex items-center justify-center gap-1 font-sm">
                  Premium
                </div>
              </div>

              <div className="relative h-14">
                <div className="absolute bottom-0 w-full h-14 flex items-center justify-between bg-white px-5 shadow-template-info rounded-b-lg">
                  <div className="zw-base-semibold text-app-heading capitalize">
                    {template.name} (Option {index + 1})
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>No templates available</div>
      )}
    </div>
  );
}

export default Test;

// const fetchInitialData = async () => {
//   const url = getDomainFromEndpoint("/wp-json/custom/v1/get-form-details");
//   const iframe = document.getElementById("myIframe") as HTMLIFrameElement;
//   // const url =
//   //   "https://solitaire-sojourner-02c.zipwp.link/wp-json/custom/v1/get-form-details";
//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ fields: ["color", "font", "logo"] }),
//     });
//     const result = await response.json();

//     if (result) {
//       if (result.color) {
//         const colors = JSON.parse(result.color);
//         sendMessageToIframes("changeGlobalColors", colors);
//       }
//       if (result.font) {
//         iframe.contentWindow?.postMessage(
//           {
//             type: "changeFont",
//             font: result.font,
//           },
//           "*"
//         );
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching initial data:", error);
//   }
// };
