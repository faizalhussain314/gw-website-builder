import React, { useState } from "react";
import ProfileArrowIcon from "../../assets/icons/profile-arrow-icon.svg";
import CrownIcon from "../../assets/icons/crown.svg";
import ProfilePicture from "../../assets/profilepic.svg";
import AiGenerate from "../../assets/icons/aigenerate.svg";
import LogoutIcon from "../../assets/icons/logout.svg";

const ProfileSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="absolute bottom-1 w-[90%] left-3 rounded-lg">
      {isOpen && (
        <div className="w-full bg-white rounded-lg border border-[#DAE1E9] shadow-xl z-20 py-4 justify-evenly absolute bottom-20 px-2">
          <div className="flex items-center justify-center px-4">
            <img
              src={ProfilePicture}
              alt="Profile"
              className="w-7 h-7 rounded-full mr-3"
            />
            <div className="flex gap-2 justify-between items-center w-full">
              <div className="flex flex-col max-w-[60%]">
                <p className="text-base font-semibold truncate w-full">
                  Adam Zamba
                </p>
                <p className="text-sm text-[#6B7280] w-full truncate">
                  adamzamba@gmail.com
                </p>
              </div>
              <span className="text-sm text-[#8E9AAC] w-fit">Free plan</span>
            </div>
          </div>
          <div className="flex justify-center items-center my-5 px-4">
            <button
              onClick={toggleMenu}
              className="text-base tertiary w-full text-white flex items-center justify-center gap-2 px-4 py-3 rounded-lg"
            >
              <img src={CrownIcon} />
              Upgrade
            </button>
          </div>
          <div className="h-[1px] w-full bg-gray-200"></div>

          <div className="px-4 py-2 pt-4">
            <div className="flex items-center justify-between gap-2 w-full text-gray-700">
              <div className="flex items-center gap-x-2.5">
                <img src={AiGenerate} />
                <span className="">AI Website Generation</span>
              </div>
              <span>1/2</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 my-2 dark:bg-blue-100">
              <div
                className="h-2 rounded-full bg-blue-gradient"
                style={{ width: "50%" }}
              ></div>
            </div>
          </div>
          <button
            onClick={toggleMenu}
            className="flex items-center gap-2.5 w-full px-4 py-2 text-left text-gray-700 hover:bg-palatinate-blue-50 cursor-pointer rounded-md"
          >
            <img src={LogoutIcon} className="flex-none" />
            <span className="flex-1"> Log out</span>
          </button>
        </div>
      )}
      <div
        className="absolute bottom-1 border w-[90%] mac:w-full rounded-lg z-0 shadow flex justify-between px-4 py-2 cursor-pointer"
        onClick={toggleMenu}
      >
        <div className="flex items-center gap-x-3">
          <img
            src={ProfilePicture}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col w-full">
            <p className="text-base font-semibold truncate w-full">
              Adam Zamba
            </p>
            <p className="text-sm text-[#6B7280] w-full truncate">
              adamzamba@gmail.com
            </p>
          </div>
        </div>
        <button
          onClick={toggleMenu}
          className="flex items-center bg-transparent border-none cursor-pointer p-0 focus:outline-none"
        >
          <img src={ProfileArrowIcon} />
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;
