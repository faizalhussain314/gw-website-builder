import React, { useState } from "react";
import Profilepic from "../assets/profilepic.svg";
import ProfileArrowIcon from "../assets/icons/profile-arrow-icon.svg";
import CrownIcon from "../assets/icons/crown.svg";
import AiGenerate from "../assets/icons/aigenerate.svg";
import LogoutIcon from "../assets/icons/logout.svg";

const ProfileSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div>
        <div className="flex flex-col absolute bottom-0  w-[97%] mac:w-[90%] rounded-lg   justify-center  py-2 my-4 mx-2 ">
          {isOpen && (
            <div className="  mt-2 w-full bg-white rounded-lg shadow-xl z-20 pt-2 justify-evenly absolute bottom-20">
              <div className="flex items-center justify-center  ">
                <img
                  src={Profilepic}
                  alt="Profile"
                  className="w-7 h-7 rounded-full mr-3"
                />
                <div className="flex gap-1 justify-center items-center">
                  <div className="flex flex-col ">
                    <p className="mac:text-lg text-sm  font-medium m-0 ">
                      Adam Zamba
                    </p>
                    <p className="mac:text-sm text-xs  text-gray-600 m-0">
                      adamzamba@gmail.com
                    </p>
                  </div>
                  <div className="h-full flex items-center  w-full">
                    <span className="text-xs text-center text-gray-500">
                      Free plan
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex  justify-center items-center p-2">
                <button
                  onClick={toggleMenu}
                  className=" text-lg tertiary w-full text-white flex items-center justify-center gap-2 px-4 py-1 rounded-md"
                >
                  <img src={CrownIcon} />
                  Upgrade
                </button>
              </div>

              <div className="border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                  <div className="flex-none">
                    {" "}
                    <img src={AiGenerate} />
                  </div>{" "}
                  <div className="w-full">
                    <span className="flex flex-1 justify-evenly w-full gap-2">
                      AI Website Generation <span>1/2</span>
                    </span>

                    <div className="w-full bg-blue-200 rounded-full h-1.5 mb-4 dark:bg-blue-100">
                      <div
                        className="h-1.5 rounded-full bg-blue-gradient"
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="px-3"></div>
                <button
                  onClick={toggleMenu}
                  className="flex items-center gap-1 justify-start  w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  <img src={LogoutIcon} className="flex-none" />
                  <span className="flex-1"> Log out</span>
                </button>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 border w-[90%] px-2 mac:w-full rounded-lg gap-1  z-0 shadow flex justify-between  py-2 ">
            <img
              src={Profilepic}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className=" font-semibold mac:text-base text-sm">
                Adam Zamba
              </h3>
              <p className=" font-normal mac:text-sm text-xs ">
                {" "}
                Adamzamba@gmail.com
              </p>
            </div>
            <button
              onClick={toggleMenu}
              className="flex items-center bg-transparent border-none cursor-pointer p-0 focus:outline-none"
            >
              <img src={ProfileArrowIcon} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSection;
