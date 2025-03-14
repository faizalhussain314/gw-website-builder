import { useDispatch } from "react-redux";
import {
  setBusinessName,
  setDescriptionOne,
  setDescriptionTwo,
  setCategory,
  setTemplateId,
  setTemplatename,
  setLogo,
  setContent,
  setColor,
  setFont,
  setTemplateList,
  updateContactForm,
  setlastStep,
  setStyle,
} from "../Slice/activeStepSlice";
import useDomainEndpoint from "./useDomainEndpoint";
import { useCallback } from "react";
import axios from "axios";

const useFetchContentData = () => {
  const dispatch = useDispatch();
  const { getDomainFromEndpoint } = useDomainEndpoint();

  // Define emptyTable inside the hook
  const emptyTable = async (endpoint: string, data: object) => {
    const url = getDomainFromEndpoint(endpoint);

    if (!url) return null;

    try {
      const response = await axios.delete(url, {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(data),
      });
      return response.data;
    } catch (error) {
      console.error(`Error clearing table at ${url}:`, error);
      return null;
    }
  };

  const fetchContent = useCallback(async () => {
    const url = getDomainFromEndpoint("wp-json/custom/v1/get-form-details");

    try {
      const response = await axios.post(url, {
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
          "lastStep",
        ],
      });

      const data = response.data;

      if (data) {
        dispatch(setBusinessName(data.businessName || ""));
        dispatch(setDescriptionOne(data.description1 || ""));
        dispatch(setDescriptionTwo(data.description2 || ""));
        dispatch(setCategory(data.category || null));
        dispatch(setTemplateId(data.templateid || 0));
        dispatch(setTemplatename(data.templatename || ""));
        dispatch(setLogo(data.logo || ""));
        dispatch(setContent(data.content || []));
        if (data.font) {
          dispatch(
            setFont(JSON.parse(data.font) || { primary: "", secondary: "" })
          );
        }

        if (data.color) {
          const parsedColor = JSON.parse(data.color);
          dispatch(setColor(parsedColor || { primary: "", secondary: "" }));
        }

        if (data.templateList) {
          const parsedTemplateList = JSON.parse(data.templateList);
          const Style = parsedTemplateList?.styles;
          dispatch(setTemplateList(parsedTemplateList || []));
          console.log("parsed Template List", Style);
          dispatch(setStyle(Style));
        }

        if (data.contactform) {
          const parsedContactForm = JSON.parse(data.contactform);
          dispatch(updateContactForm(parsedContactForm));
        }

        dispatch(setlastStep(data.lastStep || ""));
      }

      console.log("create type for this data's", data);

      return data;
    } catch (error) {
      console.error("Error fetching content:", error);
      return null;
    }
  }, [dispatch, getDomainFromEndpoint]);

  return { fetchContent, emptyTable };
};

export default useFetchContentData;
