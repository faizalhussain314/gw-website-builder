import React from "react";
import { CategoryList } from "types/Category.type";
import SkeletonLoader from "./SkeletonLoader";

interface CategoryDropdownProps {
  categoryList: CategoryList[];
  inputValue: string;
  onSelect: (category: string) => void;
  isLoading: boolean;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categoryList,
  inputValue,
  onSelect,
  isLoading,
}) => {
  const filteredCategories = categoryList.filter((option) =>
    option.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const renderSkeletonItems = () => (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <li key={`skeleton-${index}`} className="p-4">
          <SkeletonLoader className="h-5 w-full" />
        </li>
      ))}
    </>
  );

  const renderCategoryItems = () => {
    if (filteredCategories.length > 0) {
      return filteredCategories.map((option) => (
        <li
          key={option.id}
          onClick={() => onSelect(option.name)}
          className="p-4 cursor-pointer hover:bg-[#EBF4FF] text-[#1E2022] rounded-md"
        >
          {option.name}
        </li>
      ));
    }

    return <li className="px-4 py-2 text-gray-500">No categories found</li>;
  };

  return (
    <ul className="absolute w-full p-4 mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md max-h-80 z-10 left-0 right-0">
      {isLoading ? renderSkeletonItems() : renderCategoryItems()}
    </ul>
  );
};

export default CategoryDropdown;
