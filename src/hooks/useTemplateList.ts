import { useState, useEffect } from "react";
import { fetchtemplateList } from "../infrastructure/api/laraval-api/templatelist.api";
import { setTemplateList, setTemplateId } from "../Slice/activeStepSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";

const useTemplateList = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedTemplateDetails, setSelectedTemplateDetails] =
    useState<any>(null); // Use `any` for now
  const dispatch = useDispatch();

  const templateList =
    useSelector((state: RootState) => state.userData.templateList) || [];

  // Fetch template list from API and set it in Redux
  useEffect(() => {
    const getTemplateList = async () => {
      try {
        const fetchedTemplateList = await fetchtemplateList(); // Assuming this returns templatelist[]
        console.log("Fetched template list:", fetchedTemplateList);

        if (fetchedTemplateList && Array.isArray(fetchedTemplateList)) {
          // dispatch(setTemplateList(fetchedTemplateList)); // Dispatch to Redux
          setSelectedTemplateDetails(fetchedTemplateList[0]);
        } else {
          console.error("Fetched templateList is not an array");
        }
      } catch (error) {
        console.error("Error occurred while fetching templates:", error);
      }
    };

    getTemplateList();
  }, [dispatch]);

  // Handle template selection and update Redux
  const handleBoxClick = (
    index: number,
    template: any,
    template_id: number
  ) => {
    setActiveIndex(index);
    dispatch(setTemplateId(template_id));
    dispatch(setTemplateList(template));
    setSelectedTemplateDetails(template);
    console.log("individual tempalte list", template);
  };

  return {
    templateList,
    activeIndex,
    selectedTemplateDetails,
    handleBoxClick, // Pass the function to handle clicks
  };
};

export default useTemplateList;
