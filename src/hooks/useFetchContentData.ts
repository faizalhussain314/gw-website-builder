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
import { useCallback, useEffect } from "react";

const useFetchContentData = () => {
  const dispatch = useDispatch();
  const { getDomainFromEndpoint } = useDomainEndpoint();

  const fetchContent = useCallback(async () => {
    const url = getDomainFromEndpoint("wp-json/custom/v1/get-form-details");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: [
            "businessName",
            "description1",
            "description2",
            "images",
            "designs",
            "templateid",
            "templatename",
            "logo",
            "category",
            "content",
            "color",
            "font",
            "templateList",
            "contactform",
          ],
        }),
      });

      // Log full response for debugging
      console.log("Full API Response:", response);

      // Check if response is ok (status 200)
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const data = await response.json();

      // Log parsed data
      console.log("Parsed API Data:", data);

      // Handle the data properly
      if (data) {
        dispatch(setBusinessName(data.businessName || ""));
        dispatch(setDescriptionOne(data.description1 || ""));
        dispatch(setDescriptionTwo(data.description2 || ""));
        dispatch(setCategory(data.category || null));
        dispatch(setTemplateId(data.templateid || 0));
        dispatch(setTemplatename(data.templatename || ""));
        dispatch(setLogo(data.logo || ""));
        dispatch(setContent(data.content || []));
        dispatch(updateContactForm(JSON.parse(data.contactform)));

        if (data.templateList) {
          try {
            const parsedTemplateList = JSON.parse(data.templateList);
            dispatch(setTemplateList(parsedTemplateList || []));
          } catch (error) {
            console.error("Error parsing templateList:", error);
          }
        }

        if (data.color) {
          try {
            const parsedColor = JSON.parse(data.color);
            dispatch(setColor(parsedColor || { primary: "", secondary: "" }));
          } catch (error) {
            console.error("Error parsing color:", error);
          }
        }

        dispatch(setFont(data.font || ""));
      }

      return data; // Return the data for further use
    } catch (error) {
      console.error("Error fetching content:", error);
      return null; // Return null on error
    }
  }, [dispatch, getDomainFromEndpoint]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return fetchContent;
};

export default useFetchContentData;
