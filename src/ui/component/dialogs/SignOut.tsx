import React, { useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Caution from "../../../assets/caution.svg";
import { useClickOutside } from "../../../hooks/useClickOutside";

type SignOutProps = {
  onClose: () => void;
  Signout: () => void;
  cancel: () => void;
};

const SignOut: React.FC<SignOutProps> = ({ onClose, Signout, cancel }) => {
  const wrapperRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  useClickOutside(wrapperRef, () => {
    onClose();
  });

  const handleSignout = async () => {
    setIsLoading(true);
    try {
      await Signout();
    } catch (error) {
      console.error("Error during signout:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-white rounded-lg shadow-lg text-center relative max-w-[450px] mx-auto px-7 py-9"
        ref={wrapperRef}
      >
        <button
          className="absolute right-4 top-4"
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon className="text-gray-600" />
        </button>

        <div className="flex items-center gap-x-2.5 w-full justify-center">
          <img src={Caution} alt="Caution" />
          <h2 className="text-[22px] leading-7 font-semibold">SignOut!</h2>
        </div>
        <p className="mt-5 mb-9 text-[#656567] text-lg">
          You will now be logged out. Do you want to proceed?
        </p>

        <div className="mt-6 flex gap-4 w-full items-center">
          <button
            className="previous-btn w-full flex px-3 py-3.5 text-base font-medium text-white rounded-lg justify-center"
            onClick={cancel}
          >
            Cancel
          </button>
          <button
            className="tertiary w-full px-6 py-3.5 text-base text-white font-medium rounded-lg"
            onClick={handleSignout}
          >
            {isLoading ? "Signing out..." : "Signout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignOut;
