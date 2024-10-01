import { useDispatch } from "react-redux";
import {
  setBusinessName,
  setDescriptionOne,
  setDescriptionTwo,
  setCategory,
  setTemplateId,
  setTemplatename,
  setContent,
  setColor,
  setFont,
  setTemplateList,
  setLogo,
  updateContactForm,
} from "../Slice/activeStepSlice";
import useDomainEndpoint from "./useDomainEndpoint";
import { useCallback } from "react";

const useFetchCustomContentData = () => {
  const dispatch = useDispatch();
  const { getDomainFromEndpoint } = useDomainEndpoint();

  // The hook function that accepts specific fields as an argument
  const fetchCustomContent = useCallback(
    async (fields: string[]) => {
      const url = getDomainFromEndpoint("wp-json/custom/v1/get-form-details");
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields, // Dynamically pass the fields you need
          }),
        });

        const data = await response.json();
        if (data) {
          // Conditionally dispatch the fetched data based on the fields
          if (fields.includes("businessName")) {
            dispatch(setBusinessName(data.businessName || ""));
          }
          if (fields.includes("description1")) {
            dispatch(setDescriptionOne(data.description1 || ""));
          }
          if (fields.includes("description2")) {
            dispatch(setDescriptionTwo(data.description2 || ""));
          }
          if (fields.includes("category")) {
            dispatch(setCategory(data.category || null));
          }
          if (fields.includes("templateid")) {
            dispatch(setTemplateId(data.templateid || 0));
          }
          if (fields.includes("templatename")) {
            dispatch(setTemplatename(data.templatename || ""));
          }
          if (fields.includes("logo")) {
            dispatch(setLogo(data.logo || ""));
          }
          if (fields.includes("content")) {
            dispatch(setContent(data.content || []));
          }
          if (fields.includes("color")) {
            const colors = JSON.parse(data.color);
            dispatch(
              setColor(
                colors || { primary: JSON.parse(colors.primary), secondary: "" }
              )
            );
          }
          if (fields.includes("font")) {
            dispatch(setFont(data.font || ""));
          }
          if (fields.includes("templateList")) {
            dispatch(setTemplateList(data.templateList || []));
          }
          if (fields.includes("contactform")) {
            try {
              const contactForm = JSON.parse(data.contactform); // Parse the whole string first
              console.log(contactForm, "Parsed contact form");

              dispatch(
                updateContactForm({
                  email: contactForm.email || "",
                  address: contactForm.address || "",
                  phoneNumber: contactForm.phoneNumber || "",
                })
              );
            } catch (error) {
              console.error("Error parsing contact form:", error);
            }
          }
        }
        return data;
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    },
    [dispatch, getDomainFromEndpoint]
  );

  return fetchCustomContent;
};

export default useFetchCustomContentData;
