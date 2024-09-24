import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import partyImoji from "../../assets/partyemoji.svg";

interface PopupProps {
  businessName: string;
  description: string;
  onClose: () => void;
  secondDescription: string;
}

const Popup: React.FC<PopupProps> = ({
  businessName,
  description,
  onClose,
  secondDescription,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 backdrop-blur-xl bg-opacity-50 z-50">
      <div className="bg-white shadow-lg p-8 sm:p-8 w-full max-w-xl sm:max-w-lg md:max-w-xl pb-6 z-10 rounded-[10px]">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl sm:text-2xl font-bold  inline-flex justify-center items-center">
            Congratulations,
            <br /> you’re almost there!
            <div className="flex justify-center items-center mt-8 ml-3">
              <img src={partyImoji} />
            </div>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Before we hit the final button, let’s quickly double-check everything.
        </p>
        <div className="shadow-xl rounded-lg border border-[#F0F0F1] p-5 mt-6 overflow-y-auto max-h-[300px]">
          <div className="">
            <p className="font-semibold text-base mb-1">Business Name:</p>
            <p className="text-base">{businessName}</p>
          </div>
          <div className="w-full my-4 bg-[#F0F0F1] h-[1px]"></div>
          <p className="font-semibold text-base mb-4">Business Description:</p>
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              className="flex shrink-0"
            >
              <circle
                cx="13"
                cy="13"
                r="13"
                fill="#DBE9FF"
                fill-opacity="0.6"
              />
              <path
                d="M12.1607 18V9.761L10.2707 10.916V9.054L12.1607 7.92H13.8827V18H12.1607Z"
                fill="#2E42FF"
              />
            </svg>
            <div className="bg-white border border-gray-300 rounded-lg p-4">
              <p className="font-semibold">
                What do you offer/sell? or what services do you provide?
              </p>
              <p className="text-gray-500 mt-2  overflow-y-auto">
                {description}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              className="flex shrink-0"
            >
              <circle
                cx="13"
                cy="13"
                r="13"
                fill="#DBE9FF"
                fill-opacity="0.6"
              />
              <path
                d="M9.03008 17.986V16.516L13.3421 12.673C13.6781 12.3743 13.9114 12.092 14.0421 11.826C14.1727 11.56 14.2381 11.3033 14.2381 11.056C14.2381 10.72 14.1657 10.4213 14.0211 10.16C13.8764 9.894 13.6757 9.684 13.4191 9.53C13.1671 9.376 12.8754 9.299 12.5441 9.299C12.1941 9.299 11.8837 9.38067 11.6131 9.544C11.3471 9.70267 11.1394 9.915 10.9901 10.181C10.8407 10.447 10.7707 10.734 10.7801 11.042H9.04408C9.04408 10.37 9.19341 9.78433 9.49208 9.285C9.79541 8.78567 10.2107 8.39833 10.7381 8.123C11.2701 7.84767 11.8837 7.71 12.5791 7.71C13.2231 7.71 13.8017 7.85467 14.3151 8.144C14.8284 8.42867 15.2321 8.82533 15.5261 9.334C15.8201 9.838 15.9671 10.419 15.9671 11.077C15.9671 11.5577 15.9017 11.9613 15.7711 12.288C15.6404 12.6147 15.4444 12.9157 15.1831 13.191C14.9264 13.4663 14.6067 13.772 14.2241 14.108L11.1651 16.817L11.0111 16.397H15.9671V17.986H9.03008Z"
                fill="#2E42FF"
              />
            </svg>
            <div className="bg-white border border-gray-300 rounded-lg p-4">
              <p className="font-semibold">
                What steps do customers need to take to start working with the
                business? what action visitor needs to take work with you?
              </p>
              <p className="text-gray-500 mt-2  overflow-y-auto">
                {secondDescription}
              </p>
            </div>
          </div>
          {/* <div className="">
            <p className="font-semibold">Business Name:</p>
            <p>{businessName}</p>
          </div> */}
        </div>
        <div className="flex w-full flex-col sm:flex-row mt-6">
          <Link
            to={"/custom-design"}
            className="tertiary w-full text-white py-3 px-4 rounded-lg  font-semibold text-base mb-4 sm:mb-0 flex justify-center items-center"
          >
            <button className="">Start Building the website</button>
          </Link>
          <button
            onClick={onClose}
            className="text-[#88898A] hover:text-gray-900 text-base font-semibold"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
