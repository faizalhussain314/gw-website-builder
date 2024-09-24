import { useState, useEffect } from "react";
import { fetchtemplateList } from "../infrastructure/api/laraval-api/templatelist.api";
import { setTemplateList } from "../Slice/activeStepSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";

const useTemplateList = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedTemplateDetails, setSelectedTemplateDetails] =
    useState<any>(null); // Use `any` for now
  const dispatch = useDispatch();

  // Access templateList from Redux state
  const templateList =
    useSelector((state: RootState) => state.userData.templateList) || []; // Always an array

  // Fetch template list from API and set it in Redux
  useEffect(() => {
    const getTemplateList = async () => {
      try {
        const fetchedTemplateList = await fetchtemplateList(); // Assuming this returns templatelist[]
        console.log("Fetched template list:", fetchedTemplateList); // Log the fetched data

        if (fetchedTemplateList && Array.isArray(fetchedTemplateList)) {
          dispatch(setTemplateList(fetchedTemplateList)); // Directly dispatch the fetched data to Redux
          setSelectedTemplateDetails(fetchedTemplateList[0]); // Set the first template as selected by default
        } else {
          console.error("Fetched templateList is not an array");
        }
      } catch (error) {
        console.error("Error occurred while fetching templates:", error);
      }
    };

    getTemplateList();
  }, [dispatch]);

  // Handle template selection and update Redux with the selected template
  const handleBoxClick = (index: number, template: any) => {
    setActiveIndex(index);
    setSelectedTemplateDetails(template);
    const selectedTemplateArray = [template];

    // Update Redux state with the selected template
    dispatch(setTemplateList(selectedTemplateArray));
    console.log("Selected template list set in Redux:", selectedTemplateArray);
  };

  return {
    templateList,
    activeIndex,
    selectedTemplateDetails,
    handleBoxClick,
  };
};

export default useTemplateList;
