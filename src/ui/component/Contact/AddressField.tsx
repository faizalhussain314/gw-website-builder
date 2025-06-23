import React from "react";

interface AddressFieldProps {
  value: string;
  error: string;
  onChange: (name: string, value: string) => void;
}

export const AddressField: React.FC<AddressFieldProps> = ({
  value,
  error,
  onChange,
}) => {
  return (
    <div className="grid mt-6">
      <label
        htmlFor="message"
        className="block text-base font-semibold text-gray-900"
      >
        Address
      </label>
      <div className="mt-2.5">
        <textarea
          name="address"
          id="address"
          rows={4}
          placeholder="Enter your address"
          className={`block w-full rounded-lg bg-white px-4 py-2.5 w-[720px] ${
            error !== ""
              ? "border border-[red]"
              : "border border-[rgba(205, 212, 219, 1)] focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500"
          }`}
          defaultValue={""}
          onChange={(e) => onChange(e.target.name, e.target.value)}
          value={value}
        />
        {error && <span className="mt-2 text-red-600">{error}</span>}
      </div>
    </div>
  );
};
