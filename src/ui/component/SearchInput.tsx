import React from "react";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  error: string | null;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onFocus,
  error,
  placeholder = "Enter your business category or type (e.g., Education, Restaurant)",
}) => {
  return (
    <div className="relative">
      <div className="relative w-full">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`bg-white rounded-lg w-full pl-11 pr-4 py-3 border placeholder:text-[#A9B0B7] placeholder:!font-normal focus:border-palatinate-blue-500 active:border-palatinate-blue-500 focus:border-2 ${
            error ? "border-red-500" : "border-[#CDD4DB]"
          } focus:outline-none`}
          aria-required="true"
          onFocus={onFocus}
        />
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
              strokeWidth="0.2"
            />
          </svg>
        </div>
      </div>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};

export default SearchInput;
