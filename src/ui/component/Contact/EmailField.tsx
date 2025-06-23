import React from "react";

interface EmailFieldProps {
  value: string;
  error: string;
  onChange: (name: string, value: string) => void;
  onBlur: () => void;
}

export const EmailField: React.FC<EmailFieldProps> = ({
  value,
  error,
  onChange,
  onBlur,
}) => {
  return (
    <div className="sm:col-span-2">
      <label
        htmlFor="email"
        className="block text-base font-semibold text-gray-900"
      >
        Email
      </label>
      <div className="mt-3">
        <input
          type="email"
          name="email"
          id="email"
          autoComplete="email"
          placeholder="Enter your email"
          onChange={(e) => onChange(e.target.name, e.target.value)}
          value={value}
          onBlur={onBlur}
          onKeyDown={(e) => {
            if (e.key === " " && value.length === 0) {
              e.preventDefault();
            }
          }}
          className={`block w-full rounded-lg bg-white px-4 py-2.5  ${
            error !== ""
              ? "border border-[red]"
              : "border border-[rgba(205, 212, 219, 1)] focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500"
          }`}
        />
        <span className="mt-2 text-red-600">{error}</span>
      </div>
    </div>
  );
};
