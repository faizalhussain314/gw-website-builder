import { useCallback, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTemplateList } from "@Slice/activeStepSlice";
import { RootState } from "@store/store";
import { CustomDesignService } from "@api/wordpress-api/customDesignService";
import { TemplateListData } from "types/customDesign.types";
import { adaptTemplateDataForRedux } from "@utils/customdesign/templateDataAdapter";

export const useCustomDesign = () => {
  const [parsedTemplateList, setParsedTemplateList] =
    useState<TemplateListData | null>(null);
  const dispatch = useDispatch();

  // Fix: Memoize service instantiation to prevent recreation on every render
  const customDesignService = useMemo(() => new CustomDesignService(), []);

  const businessName = useSelector(
    (state: RootState) => state.userData.businessName
  );

  const fetchInitialData = useCallback(async (): Promise<void> => {
    try {
      await customDesignService.fetchInitialData(businessName);
    } catch (error) {
      console.error("Error in fetchInitialData:", error);
    }
  }, [businessName, customDesignService]);

  const fetchTemplateData = useCallback(async (): Promise<void> => {
    try {
      const parsedData = await customDesignService.fetchTemplateData();
      if (parsedData) {
        setParsedTemplateList(parsedData);
        // Fix: Use adapter to convert API response to Redux expected format
        const reduxTemplateData = adaptTemplateDataForRedux(parsedData);
        dispatch(setTemplateList(reduxTemplateData));
      }
    } catch (error) {
      console.error("Error in fetchTemplateData:", error);
    }
  }, [dispatch, customDesignService]);

  useEffect(() => {
    fetchTemplateData();
  }, [fetchTemplateData]);

  return {
    parsedTemplateList,
    fetchInitialData,
    fetchTemplateData,
  };
};
