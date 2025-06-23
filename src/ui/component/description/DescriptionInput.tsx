import React from "react";
import { handleEnterKey } from "@utils";
import NumberIcon from "./NumberIcon";
import AIWriteButton from "./AIWriteButton";

interface DescriptionInputProps {
  number: "1" | "2";
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAIWrite: () => void;
  onEnterKey: () => void;
  className: string;
  isLoading: boolean;
  isDisabled: boolean;
  hasError: boolean;
  errorMessage?: string;
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({
  number,
  label,
  placeholder,
  value,
  onChange,
  onAIWrite,
  onEnterKey,
  className,
  isLoading,
  isDisabled,
  hasError,
  errorMessage,
}) => {
  return (
    <div className={number === "2" ? "mt-6" : ""}>
      <div className="flex items-center gap-6">
        <NumberIcon number={number} />
        <label className="text-lg font-semibold leading-5 max-w-[639px]">
          {label}
        </label>
      </div>
      <textarea
        className={className}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={(event) =>
          handleEnterKey({
            event,
            callback: onEnterKey,
            value: value,
            setValue: (newValue) => {
              const syntheticEvent = {
                target: { value: newValue },
              } as React.ChangeEvent<HTMLTextAreaElement>;
              onChange(syntheticEvent);
            },
          })
        }
      />

      <AIWriteButton
        onAIWrite={onAIWrite}
        isLoading={isLoading}
        isDisabled={isDisabled}
      />

      {hasError && errorMessage && (
        <div className="text-red-500 mt-4 ml-[50px]">{errorMessage}</div>
      )}
    </div>
  );
};

export default DescriptionInput;
