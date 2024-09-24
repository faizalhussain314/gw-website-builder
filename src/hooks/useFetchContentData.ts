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
          ],
        }),
      });

      const data = await response.json();
      if (data) {
        const colors = JSON.parse(data.color);
        dispatch(setBusinessName(data.businessName || ""));
        dispatch(setDescriptionOne(data.description1 || ""));
        dispatch(setDescriptionTwo(data.description2 || ""));
        dispatch(setCategory(data.category || null));
        dispatch(setTemplateId(data.templateid || 0));
        dispatch(setTemplatename(data.templatename || ""));
        dispatch(setContent(data.content || []));
        if (data.color) {
          dispatch(
            setColor(
              colors || { primary: JSON.parse(colors.primary), secondary: "" }
            )
          );
        }
        dispatch(setFont(data.font || ""));
        dispatch(setTemplateList(data.templateList || []));
      }
      console.log("colors: ", JSON.parse(data.color));
      return data;
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  }, [dispatch, getDomainFromEndpoint]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return fetchContent;
};

export default useFetchContentData;
