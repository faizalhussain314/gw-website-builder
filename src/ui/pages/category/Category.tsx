import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../../Slice/activeStepSlice";
import { useNavigate } from "react-router-dom";
import { fetchCategoryList } from "../../../infrastructure/api/laraval-api/categorylist.api";
import { RootState } from "../../../store/store";
import MainLayout from "../../Layouts/MainLayout";
import { CategoryList } from "../../../types/Category.type";
import SearchIcon from "@mui/icons-material/Search";
import useDomainEndpoint from "../../../hooks/useDomainEndpoint";
import { getCategoryDetails } from "../../../infrastructure/api/wordpress-api/category/getCategoryDetails.api";
import { updateCategoryDetails } from "../../../infrastructure/api/wordpress-api/category/updateCategoryDetails.api.ts";

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

  useEffect(() => {
    const fetchInitialCategory = async () => {
      const content = await getCategoryDetails(getDomainFromEndpoint);
      if (content && content.category) {
        console.log("content", content);
        setInputValue(content.category);
        dispatch(setCategory(content.category));
      }
    };

    fetchInitialCategory();

    const getCategoryList = async () => {
      try {
        const categories = await fetchCategoryList();
        setCategoryList(categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError("Failed to load categories. Please try again later.");
      }
    };

    getCategoryList();
  }, [dispatch, getDomainFromEndpoint]);

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
    if (selectedCategory) {
      await updateCategoryDetails(selectedCategory, getDomainFromEndpoint);
      navigate("/name");
    } else {
      setError("Please select a category before continuing.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    handleCategoryChange(e.target.value);
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

  return (
    <MainLayout>
      <div className="bg-[rgba(249, 252, 255, 1)] flex font-['inter']">
        <div className="p-8">
          <div className="mt-8 ml-[50px]">
            <h1 className="text-txt-black-600 leading-5 font-semibold text-3xl font-[inter] mb-4">
              I am creating a website for
            </h1>
            <span className="mt-4 text-lg leading-6 text-txt-secondary-400">
              Let’s get started by choosing the type of website you’d like to
              create
            </span>
          </div>
        </div>
      </div>
      <div className="relative  pl-20" ref={dropdownRef}>
        <div
          className={`relative w-3/4 ${
            showDropdown && categoryList.length > 0
              ? "border border-gray-300 rounded-md"
              : ""
          }`}
        >
          {!error && (
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          )}

          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter a keyword to search your business"
            className={`bg-white rounded-md w-full px-10 py-2 border ${
              error ? "border-red-500" : "border-gray-300"
            } focus:outline-none`}
            aria-required="true"
            onFocus={() => setShowDropdown(true)}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          {showDropdown && categoryList.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 rounded-md w-full mt-1 max-h-60 overflow-y-auto">
              {categoryList
                .filter((option) =>
                  option.name.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((option) => (
                  <li
                    key={option.id}
                    onClick={() => handleSelect(option.name)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {option.name}
                  </li>
                ))}
            </ul>
          )}
        </div>
        <button
          onClick={handleClick}
          type="submit"
          className="tertiary px-[30px] py-[15px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-lg bg-blue-500 hover:bg-blue-600"
        >
          Continue
        </button>
      </div>
    </MainLayout>
  );
}

export default Category;
