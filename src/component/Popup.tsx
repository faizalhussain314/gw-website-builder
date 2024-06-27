import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import partyImoji from "../assets/partyemoji.svg";

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
      <div className="bg-white rounded-lg shadow-lg p-8 sm:p-8 w-full max-w-xl sm:max-w-lg md:max-w-xl pb-6 z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl sm:text-2xl font-bold  inline-flex justify-center items-center">
            Congratulations,
            <br /> you’re almost there!{" "}
            <div className="flex justify-center items-center mt-8 ml-3">
              <img src={partyImoji} />
            </div>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <CloseIcon fontSize="large" />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Before we hit the final button, let’s quickly double-check everything.
        </p>
        <div className="shadow-xl rounded-lg p-4 mb-6 mt-6 overflow-y-auto max-h-72">
          <div className="">
            <p className="font-semibold">Business Name:</p>
            <p>{businessName}</p>
          </div>
          <p className="font-semibold mt-4">Business Description:</p>
          <div className="bg-white border border-gray-300 rounded-lg p-4 mt-2">
            <p className="font-semibold">
              1. What do you offer/sell? or what services do you provide?
            </p>
            <p className="text-gray-500 mt-2  overflow-y-auto">{description}</p>
          </div>
          <div className="bg-white border border-gray-300 rounded-lg p-4 mt-2">
            <p className="font-semibold">
              2. What steps do customers need to take to start working with the
              business? what action visitor needs to take work with you?
            </p>
            <p className="text-gray-500 mt-2  overflow-y-auto">
              {secondDescription}
            </p>
          </div>
          {/* <div className="">
            <p className="font-semibold">Business Name:</p>
            <p>{businessName}</p>
          </div> */}
        </div>
        <div className="flex w-full flex-col sm:flex-row justify-between items-center">
          {" "}
          <Link
            to={"/custom-design"}
            className="tertiary w-full text-white py-3 px-4 rounded-lg  mb-4 sm:mb-0 flex justify-center items-center"
          >
            <button className="">Start Building the website</button>
          </Link>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
