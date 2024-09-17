import { useState, useEffect } from "react";
import { templatelist } from "../types/Preview.type";
import { fetchtemplateList } from "../infrastructure/api/laraval-api/templatelist.api";
import { setTemplateList } from "../Slice/activeStepSlice";
import { useDispatch } from "react-redux";

const useTemplateList = () => {
  const [templateList, setTemplateListState] = useState<templatelist[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedTemplateDetails, setSelectedTemplateDetails] =
    useState<templatelist | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const templateList = async () => {
      try {
        const templatelist = await fetchtemplateList();
        setTemplateListState(templatelist || []);
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
    console.log("template list", list);
    const listArray = [list];
    dispatch(setTemplateList(listArray));
  };

  return {
    templateList,
    activeIndex,
    selectedTemplateDetails,
    handleBoxClick,
  };
};

export default useTemplateList;
