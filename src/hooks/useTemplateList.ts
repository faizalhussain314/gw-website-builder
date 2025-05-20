import { useState, useEffect } from "react";
import { fetchtemplateList } from "../infrastructure/api/laraval-api/templatelist.api";
import {
  setTemplateList,
  setTemplateId,
  setPagesFromTemplate,
} from "../Slice/activeStepSlice";
import { useDispatch } from "react-redux";
import { Template } from "../types/design.type";

// Define the type returned by your API for a page.
interface FetchedTemplatePage {
  id: number;
  title: string;
  slug: string;
  template_id: number;
  iframe_url: string;
}

// Define the type returned by your API for a template.
interface FetchedTemplate {
  id: number;
  name: string;
  dark_theme: number; // 0 or 1 from API
  site_category_id: number;
  pages: FetchedTemplatePage[];
  is_premium: boolean;
  styles: {
    defaultFont: { primary: string; secondary: string };
    defaultColor: { primary: string; secondary: string };
    fonts: { primary: string; secondary: string }[];
    color: { primary: string; secondary: string }[];
  };
}

// Conversion function: converts FetchedTemplate to Template.
const convertFetchedTemplate = (fetched: FetchedTemplate): Template => ({
  id: fetched.id,
  name: fetched.name,
  dark_theme: fetched.dark_theme === 1, // convert number to boolean
  site_category_id: fetched.site_category_id,
  pages: fetched.pages,
  is_premium: fetched.is_premium,
  styles: fetched.styles,
});

interface UseTemplateListReturn {
  templateList: Template[];
  activeIndex: number | null;
  selectedTemplateDetails: Template | null;
  handleBoxClick: (
    index: number,
    template: Template,
    template_id: number
  ) => void;
}

const useTemplateList = (): UseTemplateListReturn => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedTemplateDetails, setSelectedTemplateDetails] =
    useState<Template | null>(null);
  const [fetchedTemplates, setFetchedTemplates] = useState<Template[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const getTemplateList = async () => {
      try {
        // Use a type assertion so that the returned value is treated as FetchedTemplate[]
        const fetchedTemplateList =
          (await fetchtemplateList()) as unknown as FetchedTemplate[];

        if (Array.isArray(fetchedTemplateList)) {
          const convertedTemplates = fetchedTemplateList.map(
            convertFetchedTemplate
          );
          setFetchedTemplates(convertedTemplates);
          // Optionally, set the first template as the selected details.
          if (convertedTemplates.length > 0) {
            setSelectedTemplateDetails(convertedTemplates[0]);
          }
        } else {
          console.error("Fetched templateList is not an array");
        }
      } catch (error) {
        console.error("Error occurred while fetching templates:", error);
      }
    };

    getTemplateList();
  }, [dispatch]);

  const handleBoxClick = (
    index: number,
    template: Template,
    template_id: number
  ): void => {
    setActiveIndex(template_id);
    dispatch(setTemplateId(template_id));

    dispatch(setTemplateList({ ...template, dark_theme: template.dark_theme }));
    setSelectedTemplateDetails(template);

    dispatch(setPagesFromTemplate(template.pages));
  };

  return {
    templateList: fetchedTemplates,
    activeIndex,
    selectedTemplateDetails,
    handleBoxClick,
  };
};

export default useTemplateList;
