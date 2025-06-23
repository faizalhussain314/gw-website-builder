import React, { useState, useRef, useEffect } from "react";
import { Slider } from "@mui/material";
import { useDispatch } from "react-redux";
import { useStoreContent } from "@hooks";
import { sendIframeMessage } from "@utils/sendIframeMessage.utils";
import { uploadLogo } from "@utils/customizesidebar/logoUploadUtils";
import { cancelLogoChange } from "@utils/customizesidebar/cancelLogoChange";
import uploadLogoIcon from "@assets/icons/uploadfile.svg";
import useDomainEndpoint from "@hooks/useDomainEndpoint";

interface LogoSectionProps {
  businessName: string;
  value: number;
  onWidthChange: (value: number) => void;
}

export const LogoSection: React.FC<LogoSectionProps> = ({
  businessName,
  value,
  onWidthChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const { getDomainFromEndpoint } = useDomainEndpoint();
  const storeContent = useStoreContent();

  const extractFileName = (url: string): string => {
    return url?.split("/").pop() || "Unknown file";
  };

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadLogo(
        file,
        getDomainFromEndpoint,
        setLogoUrl,
        setError,
        setSuccessMessage,
        setLoading,
        dispatch,
        storeContent,
        sendIframeMessage
      );
    }
  };

  const handleCancelLogoChange = async () => {
    setIsRemoving(true);
    setSuccessMessage("Please wait, removing logo...");
    setError(null);
    try {
      await cancelLogoChange(
        businessName,
        setLogoUrl,
        dispatch,
        setSuccessMessage,
        setError
      );

      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setSuccessMessage("Logo removed successfully");
    } catch (err) {
      setError("Error while removing logo");
    }
    setIsRemoving(false);
  };

  const handleChange = (event: Event, newValue: number | number[]) => {
    onWidthChange(newValue as number);
  };

  useEffect(() => {
    const savedLogoUrl = localStorage.getItem("logoUrl");
    if (savedLogoUrl) {
      setLogoUrl(savedLogoUrl);
    }
  }, []);

  return (
    <div className="mt-6">
      <label className="block text-base font-semibold mb-2.5">
        Website Logo
      </label>
      <input
        type="file"
        className="w-full p-3 border border-[#DFEAF6] rounded-md hidden"
        onChange={handleLogoChange}
        ref={inputRef}
        name={extractFileName(logoUrl)}
      />
      <button
        onClick={() => {
          inputRef.current?.click();
        }}
        className="p-3 border border-[#DFEAF6] w-full rounded-md text-[#88898A] font-medium flex items-center gap-2 flex-1"
      >
        <img src={uploadLogoIcon} className="w-5" alt="Upload" />
        <span>{logoUrl ? extractFileName(logoUrl) : "upload logo here"}</span>
      </button>

      {loading && (
        <p className="text-sm text-blue-500 mt-2">Uploading logo...</p>
      )}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      {successMessage && (
        <p className="text-sm text-green-500 mt-2">{successMessage}</p>
      )}
      {logoUrl && (
        <div className="relative bg-white p-2.5 mt-2.5 border border-[#DFEAF6] rounded-md shadow-lg">
          <button
            onClick={handleCancelLogoChange}
            className="absolute top-2 right-2 flex items-center justify-center w-4 h-4 p-2 text-xs bg-red-500 text-white rounded-full z-10"
            title="Cancel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 text-white bg-white"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                clipRule="evenodd"
              />
            </svg>
            X
          </button>

          <img
            src={logoUrl}
            alt="Uploaded Logo"
            className="mt-2 h-6 cursor-pointer"
          />
          {isRemoving ? (
            <div className="flex items-center justify-center mt-2">
              <svg
                className="w-5 h-5 text-red-500 animate-spin"
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
            <div className="h-8 mt-4 custom-slider relative">
              <Slider
                aria-label="Logo Size"
                value={value}
                onChange={handleChange}
                min={10}
                max={200}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
