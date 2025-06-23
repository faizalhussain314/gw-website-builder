import React from "react";
import PhoneInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

interface PhoneFieldProps {
  value: string;
  error: string;
  onChange: (name: string, value: string) => void;
  onBlur: () => void;
}

export const PhoneField: React.FC<PhoneFieldProps> = ({
  value,
  error,
  onChange,
  onBlur,
}) => {
  return (
    <div className="sm:col-span-2">
      <label
        htmlFor="phone-number"
        className="block text-base font-semibold text-gray-900"
      >
        Phone number
      </label>
      <div className="relative mt-2.5">
        <div className="absolute inset-y-0 left-0 flex items-center"></div>
        <PhoneInput
          type="tel"
          name="phoneNumber"
          id="phone-number"
          autoComplete="tel"
          placeholder="Enter your Phone number"
          onChange={(value) => {
            onChange("phoneNumber", value ?? "");
          }}
          onBlur={onBlur}
          value={value}
          international
          defaultCountry="US"
          flags={flags}
          inputClassName={`block w-full rounded-lg bg-white px-4 py-2.5 outline-none w-[720px] ${
            error !== ""
              ? "border border-[red]"
              : "border border-[rgba(205, 212, 219, 1)] focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500"
          }`}
          className={`w-full rounded-lg bg-white px-4 py-2.5 outline-none ${
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
