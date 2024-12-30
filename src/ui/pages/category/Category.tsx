import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../../Slice/activeStepSlice";
import { useNavigate } from "react-router-dom";
import { fetchCategoryList } from "../../../infrastructure/api/laraval-api/categorylist.api";
import { RootState } from "../../../store/store";
import MainLayout from "../../Layouts/MainLayout";
import { CategoryList } from "../../../types/Category.type";
import useDomainEndpoint from "../../../hooks/useDomainEndpoint";
import { getCategoryDetails } from "../../../infrastructure/api/wordpress-api/category/getCategoryDetails.api";
import { updateCategoryDetails } from "../../../infrastructure/api/wordpress-api/category/updateCategoryDetails.api.ts";
import LimitReachedPopup from "../../component/dialogs/LimitReachedPopup.tsx";
import axios from "axios";
import {
  setUsername,
  setPlan,
  setWebsiteGenerationLimit,
  setEmail,
  setGravator,
  setGeneratedSite,
  setMaxGeneration,
} from "../../../Slice/userSlice";
import ThreeDotLoader from "../../component/loader/ThreeDotLoader.tsx";
import ApiErrorPopup from "../../component/dialogs/ApiErrorPopup.tsx";

function Category() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getDomainFromEndpoint } = useDomainEndpoint();

  const selectedCategory = useSelector(
    (state: RootState) => state.userData.category
  );
  const [categoryList, setCategoryList] = useState<CategoryList[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>(selectedCategory || "");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDetails = useSelector((state: RootState) => state.user);
  const [limitReached, setLimitReached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mainLoader, setMainLoader] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [erros, setErrors] = useState({ titile: "", message: "" });
  const wp_token = useSelector((state: RootState) => state.user.wp_token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await fetchCategoryList(
          dispatch,
          getDomainFromEndpoint
        );
        setCategoryList(categories);
      } catch (err) {
        console.error("Error fetching category list:", err);

        setError("Failed to fetch category list. Please try again.");
      }
    };

    if (wp_token) {
      fetchData();
    } else {
      console.error("Token not available, waiting for Redux update.");
    }
  }, [wp_token, dispatch, getDomainFromEndpoint]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      setError(null);
      setLoading(true);
      try {
        await updateCategoryDetails(inputValue, getDomainFromEndpoint);
        setLoading(false);
        navigate("/name");
      } catch (err) {
        console.error("Error updating category details:", err);
        setLoading(false);
        setError("Failed to update category details. Please try again.");
      }
    } else {
      setError("Please select a valid category from the list.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.trimStart());
    handleCategoryChange(e.target.value.trimStart());
    setShowDropdown(true);
  };

  const handleSelect = (category: string) => {
    setInputValue(category);
    handleCategoryChange(category);
    setShowDropdown(false);
  };
  // const getContent = async () => {
  //   const url = getDomainFromEndpoint("wp-json/custom/v1/get-form-details");

  //   try {
  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         fields: ["category"],
  //       }),
  //     });

  //     const result = await response.json();
  //     return result;
  //   } catch (error) {
  //     console.error("Error making API call:", error);
  //     return null;
  //   }
  // };

  const handleClose = () => {
    // if (userDetails.generatedSite >= userDetails.max_genration) {
    //   return;
    // } else {
    //   // setLimitReached(false);
    window.location.href = "/wp-admin/admin.php?page=gravitywrite_settings";
  };

  const checkSiteCount = useCallback(async () => {
    const endpoint = getDomainFromEndpoint(
      "/wp-json/custom/v1/check-site-count"
    );
    if (!endpoint) {
      console.error("Endpoint is not available.");
      return;
    }

    try {
      const response = await axios.get(endpoint);
      if (response?.data?.status === false) {
        setLimitReached(true);
      }
    } catch (error) {
      console.error("Error checking site count:", error);
    }
  }, [setLimitReached, getDomainFromEndpoint]);

  useEffect(() => {
    if (userDetails.email) {
      checkSiteCount();
    }
  }, [userDetails.email, checkSiteCount]);

  useEffect(() => {
    if (location.hash.includes("/category")) {
      const queryParams = new URLSearchParams(location.hash.split("?")[1]);
      const wp_token = queryParams.get("wp_token");
      const fe_token = queryParams.get("fe_token");
      const email = queryParams.get("email");

      if (wp_token && fe_token && email) {
        setMainLoader(true);
        sendTokenAndEmailToBackend(wp_token, fe_token, email);
      } else {
        console.error("Missing token or email in URL");
      }
    }
  }, [location]);

  const sendTokenAndEmailToBackend = async (
    wp_token: string,
    fe_token: string,
    email: string
  ) => {
    try {
      const endpoint = getDomainFromEndpoint(
        "wp-json/custom/v1/user-details-react"
      );

      const response = await axios.post(endpoint, {
        email: email,
        wp_token: wp_token,
        fe_token: fe_token,
      });

      await fetchUserDetails();
    } catch (error) {
      console.error("Error sending data to backend:", error);
      setApiError(true);
    }
  };

  // Function to fetch user details
  const fetchUserDetails = async () => {
    try {
      const url = getDomainFromEndpoint(
        "/wp-json/custom/v1/get-gwuser-details"
      );

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: [
            "id",
            "name",
            "email",
            "gravator",
            "plan_detail",
            "website_used",
            "website_total",
          ],
        }),
      });

      const result = await response.json();

      if (result) {
        dispatch(setUsername(result[0]?.name));
        dispatch(setPlan(result[0]?.plan_detail));
        dispatch(setWebsiteGenerationLimit(parseInt(result[0]?.website_total)));
        dispatch(setEmail(result[0]?.email));
        dispatch(setGravator(result[0]?.gravator));
        dispatch(setGeneratedSite(parseInt(result[0]?.website_used)));
        dispatch(setMaxGeneration(parseInt(result[0]?.website_total)));
        setMainLoader(false);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    setInputValue(selectedCategory || "");
  }, [selectedCategory]);

  return (
    <MainLayout>
      {limitReached && (
        <LimitReachedPopup
          onClose={handleClose}
          limit={userDetails.max_genration}
        />
      )}

      {mainLoader && <ThreeDotLoader />}
      {apiError && <ApiErrorPopup alertType="userDetails" />}
      <div className="bg-[#F9FCFF] min-h-screen p-10">
        <h1 className="text-txt-black-600 font-semibold leading-[38px] tracking-[-0.9px] text-3xl mb-2.5">
          I am creating a website for
        </h1>
        <span className="text-lg tracking-[-0.54px] font-normal leading-[26px] text-txt-secondary-400 ">
          Let's get started by choosing the type of website you'd like to create
        </span>

        <div ref={dropdownRef} className="mt-9">
          <div className="relative w-full">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter your business category or type (e.g., E-commerce, Restaurant)"
              className={`bg-white rounded-lg w-full pl-11 pr-4 py-3 border placeholder:text-[#A9B0B7] placeholder:!font-normal focus:border-palatinate-blue-500 active:border-palatinate-blue-500 focus:border-2 ${
                error ? "border-red-500" : "border-[#CDD4DB]"
              } focus:outline-none`}
              aria-required="true"
              onFocus={() => setShowDropdown(true)}
            />
            {/* <SearchIcon className="absolute text-gray-400 transform top-[10px] left-[10px]" />  */}
            <div className="absolute transform top-4 left-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
              >
                <path
                  d="M12.6417 14.1521C11.4092 15.2354 9.82167 15.889 8.09083 15.889C4.17667 15.889 1 12.5535 1 8.4445C1 4.3355 4.17667 1 8.09083 1C12.0033 1 15.1808 4.3355 15.1808 8.4445C15.1808 10.2628 14.5583 11.9305 13.5267 13.2229L15.8175 15.6291C15.9392 15.7569 16 15.9249 16 16.0938C16 16.6074 15.5525 16.75 15.375 16.75C15.215 16.75 15.055 16.6861 14.9325 16.5575L12.6417 14.1521ZM8.09083 2.31337C4.8675 2.31337 2.25167 5.06088 2.25167 8.4445C2.25167 11.8281 4.8675 14.5756 8.09083 14.5756C11.3125 14.5756 13.93 11.8281 13.93 8.4445C13.93 5.06088 11.3125 2.31337 8.09083 2.31337Z"
                  fill="#ABB3BB"
                  stroke="#ABB3BB"
                  stroke-width="0.2"
                />
              </svg>
            </div>
            {error && <p className="mt-2 text-red-500">{error}</p>}
            {showDropdown && (
              <ul className="absolute w-full p-4 mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md max-h-80">
                {categoryList.filter((option) =>
                  option.name.toLowerCase().includes(inputValue.toLowerCase())
                ).length > 0 ? (
                  categoryList
                    .filter((option) =>
                      option.name
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    )
                    .map((option) => (
                      <li
                        key={option.id}
                        onClick={() => handleSelect(option.name)}
                        className="p-4 cursor-pointer hover:bg-[#EBF4FF] text-[#1E2022] rounded-md"
                      >
                        {option.name}
                      </li>
                    ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">
                    No categories found
                  </li>
                )}
              </ul>
            )}
          </div>
          <button
            onClick={handleClick}
            type="submit"
            className="tertiary px-[35px] py-[15px] text-base  text-white mt-[25px] sm:mt-2 rounded-lg bg-blue-500 hover:bg-blue-600 tracking-[-0.32px] font-medium leading-[22px]"
          >
            {loading ? (
              <div className="flex min-w-[65px] justify-center items-center">
                {" "}
                <svg
                  className="w-5 h-5 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              </div>
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default Category;
