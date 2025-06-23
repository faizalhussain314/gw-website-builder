import {
  TemplateListData,
  ReduxTemplateList,
  ReduxPage,
  TemplatePageData,
} from "types/customDesign.types";

/**
 * Safely converts string to number, with fallback
 */
export const toNumber = (value: unknown, fallback: number): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
};

/**
 * Converts TemplatePageData to ReduxPage format
 */
export const adaptPageData = (
  pageData: TemplatePageData,
  index: number
): ReduxPage => {
  return {
    id: toNumber(pageData.id, index + 1), // Use index as fallback ID
    title: (pageData.title as string) || `Page ${index + 1}`,
    iframe_url: pageData.iframe_url || "",
    slug: (pageData.slug as string) || `page-${index + 1}`,
    template_id: toNumber(pageData.template_id, 1),
  };
};

/**
 * Adapts API response TemplateListData to Redux store templateList format
 */
export const adaptTemplateDataForRedux = (
  apiData: TemplateListData
): ReduxTemplateList => {
  return {
    // Convert to numbers as required by Redux store
    id: toNumber(apiData.id, 1), // Default ID: 1
    name: (apiData.name as string) || "Default Template",
    site_category_id: toNumber(apiData.site_category_id, 1), // Default category ID: 1
    // dark_theme is required - provide default false if not present
    dark_theme: apiData.dark_theme ?? false,
    // Convert pages array to proper ReduxPage format
    pages:
      apiData.pages?.map((page, index) => adaptPageData(page, index)) || [],
  };
};
