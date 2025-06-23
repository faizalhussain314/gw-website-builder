import React, { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../../Slice/activeStepSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../store/store";
import { updateCategoryDetails } from "@api/wordpress-api";
import { LimitReachedPopup, ApiErrorPopup, SomethingWrong } from "@dialog";
import {
  checkSiteCount,
  sendTokenAndEmailToBackend,
} from "@api/wordpress-api/index.ts";
import {
  SearchInput,
  LoadingButton,
  CategoryDropdown,
  ThreeDotLoader,
} from "@components";
import { useClickOutside, useCategoryApi } from "@hooks";

function Category() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedCategory = useSelector(
    (state: RootState) => state.userData.category
  );
  const userDetails = useSelector((state: RootState) => state.user);

  const {
    categoryList,
    isLoading: isCategoryLoading,
    error: categoryApiError,
  } = useCategoryApi();

  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>(selectedCategory || "");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [limitReached, setLimitReached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mainLoader, setMainLoader] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [issue, setIssue] = useState(false);

  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const originalCategoryRef = useRef<string | null>(selectedCategory);

  // Custom hook for click outside
  useClickOutside(dropdownRef, () => setShowDropdown(false));

  const handleCategoryChange = (value: string | null) => {
    if (value) {
      dispatch(setCategory(value));
      setError(null);
    } else {
      dispatch(setCategory(null));
    }
  };

  const handleClick = async () => {
    const isValidCategory = categoryList.some(
      (category) => category.name.toLowerCase() === inputValue.toLowerCase()
    );

    if (isValidCategory) {
      if (inputValue.trim() === (originalCategoryRef.current || "").trim()) {
        navigate("/name");
        return;
      }

      setError(null);
      setLoading(true);
      try {
        await updateCategoryDetails(inputValue);
        setLoading(false);
        navigate("/name");
      } catch (err) {
        console.error("Error updating category details:", err);
        setIssue(true);
        setLoading(false);
        setError("Failed to update category details. Please try again.");
      }
    } else {
      setError("Please select a valid category from the list.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.trimStart());
    setShowDropdown(true);
  };

  const handleSelect = (category: string) => {
    setInputValue(category);
    handleCategoryChange(category);
    setShowDropdown(false);
  };

  const handleClose = () => {
    window.location.href = "/wp-admin/admin.php?page=gravitywrite_settings";
  };

  const checkSiteLimit = useCallback(async () => {
    try {
      const Limit = checkSiteCount();
      if (!Limit) {
        setLimitReached(true);
      }
    } catch (error) {
      console.error("Error checking site count:", error);
      setApiError(true);
      setIssue(true);
    }
  }, [setLimitReached]);

  useEffect(() => {
    if (categoryApiError) {
      setError(categoryApiError);
    }
  }, [categoryApiError]);

  useEffect(() => {
    setInputValue(selectedCategory || "");
  }, [selectedCategory]);

  useEffect(() => {
    if (userDetails.email) {
      checkSiteLimit();
    }
  }, [checkSiteLimit, userDetails.email]);

  useEffect(() => {
    if (location.hash.includes("/category")) {
      const queryParams = new URLSearchParams(location.hash.split("?")[1]);
      const wp_token = queryParams.get("wp_token");
      const fe_token = queryParams.get("fe_token");
      const email = queryParams.get("email");

      if (wp_token && fe_token && email) {
        setMainLoader(true);
        sendTokenAndEmailToBackend(wp_token, fe_token, email);
      }
    }
  }, []);

  return (
    <React.Fragment>
      {limitReached && <LimitReachedPopup onClose={handleClose} />}
      {issue && <SomethingWrong />}
      {mainLoader && <ThreeDotLoader />}
      {apiError && <ApiErrorPopup alertType="userDetails" />}

      <div className="bg-[#F9FCFF] min-h-screen p-10">
        <h1 className="text-txt-black-600 font-semibold leading-[38px] tracking-[-0.9px] text-3xl mb-2.5">
          I am creating a website for
        </h1>
        <span className="text-lg tracking-[-0.54px] font-normal leading-[26px] text-txt-secondary-400">
          Let's get started by choosing the type of website you'd like to create
        </span>

        <div ref={dropdownRef} className="mt-9 relative">
          <SearchInput
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
            error={error}
          />

          {showDropdown && (
            <CategoryDropdown
              categoryList={categoryList}
              inputValue={inputValue}
              onSelect={handleSelect}
              isLoading={isCategoryLoading}
            />
          )}

          <LoadingButton loading={loading} onClick={handleClick}>
            Continue
          </LoadingButton>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Category;
