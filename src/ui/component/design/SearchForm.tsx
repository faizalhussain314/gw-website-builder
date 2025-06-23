// SearchForm.tsx
import React from "react";

interface SearchFormProps {
  category: string;
  handleKeyDown: (event: React.KeyboardEvent<HTMLFormElement>) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ category, handleKeyDown }) => {
  return (
    <form
      className="my-8"
      onSubmit={(e) => e.preventDefault}
      onKeyDown={handleKeyDown}
    >
      <div className="relative flex items-center">
        <div className="flex items-center h-12 mr-0">
          <div className="absolute flex items-center left-3">
            <button
              className="flex items-center justify-center w-auto h-auto p-0 bg-transparent border-0 cursor-pointer focus:outline-none"
              disabled
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                className="w-5 h-5 text-zip-app-inactive-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="w-full">
          <input
            className="w-full h-12 px-3 border rounded-md shadow-sm outline-none placeholder:zw-placeholder zw-input border-app-border focus:border-app-secondary  pl-11 false"
            value={category}
            disabled
            placeholder="Search categories..."
          />
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
