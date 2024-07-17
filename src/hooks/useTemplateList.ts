import { useState, useEffect } from "react";
import { templatelist } from "../types/Preview.type";
import { fetchtemplateList } from "../infrastructure/api/templatelist.api";

const useTemplateList = () => {
  const [templateList, setTemplateList] = useState<templatelist[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedTemplateDetails, setSelectedTemplateDetails] =
    useState<templatelist | null>(null);

  useEffect(() => {
    const templateList = async () => {
      try {
        const templatelist = await fetchtemplateList();
        setTemplateList(templatelist || []);
        if (templatelist && templatelist.length > 0) {
          setSelectedTemplateDetails(templatelist[0]);
        }
      } catch (error) {
        console.error("Error occurred while fetching templates:", error);
      }
    };

    templateList();
  }, []);

  const handleBoxClick = (index: number, list: templatelist) => {
    setActiveIndex(index);
    setSelectedTemplateDetails(list);
  };

  return {
    templateList,
    activeIndex,
    selectedTemplateDetails,
    handleBoxClick,
  };
};

export default useTemplateList;
