import React, { useState } from "react";
import ProfileArrowIcon from "../../assets/icons/profile-arrow-icon.svg";
import CrownIcon from "../../assets/icons/crown.svg";
// import ProfilePicture from "../../assets/ProfilePic.png";
import AiGenerate from "../../assets/icons/aigenerate.svg";
import LogoutIcon from "../../assets/icons/logout.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import useDomainEndpoint from "../../hooks/useDomainEndpoint";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getDomainFromEndpoint } = useDomainEndpoint();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const userDetails = useSelector((state: RootState) => state.user);
  const progressPercentage = Math.min(
    (userDetails.generatedSite / userDetails.max_genration) * 100,
    100
  );

  const handleLogOut = async () => {
    try {
      const endpoint = getDomainFromEndpoint("/wp-json/custom/v1/disconnect");

      const response = await axios.get(endpoint);
      console.log("API call successful:", response?.data);

      if (
        response?.data?.success === true ||
        response?.data?.data?.message ===
          "Disconnection has already been completed."
      ) {
        console.log("True block executed, redirecting...");

        window.location.href = "/wp-admin/admin.php?page=gravitywrite_settings";
      } else {
        console.error("Unexpected API response:", response?.data);
      }
    } catch (error) {
      console.error("Error in logout API:", error);
    }
  };

  return (
    <div className="relative w-full rounded-lg">
      {/* Account Action Button Section */}
      <div
        className="w-full flex justify-between gap-x-3 p-5"
        onClick={toggleMenu}
      >
        <div
          className={`px-3 py-2.5 flex items-center justify-between w-full max-w-[84%] border rounded-lg cursor-pointer ${
            isOpen ? "border-palatinate-blue-600" : "border-[#E5E7EB]"
          }`}
        >
          <p className="text-base font-medium truncate w-full max-w-[90%]">
            {userDetails?.username}
          </p>
          <button
            onClick={toggleMenu}
            className="flex items-center bg-transparent border-none cursor-pointer p-0 focus:outline-none"
          >
            <img
              src={ProfileArrowIcon}
              className={`${
                isOpen ? "rotate-180 " : "-rotate-180"
              }transition-all duration-200 ease-in`}
            />
          </button>
        </div>
        <img
          src={userDetails?.gravator}
          alt="Profile"
          className="w-10 h-10 rounded-full shrink-0"
        />
      </div>
      {/* Account Action Popup Section */}
      {isOpen && (
        <div className="absolute bottom-[90%] w-[96%] left-2 bg-white rounded-lg border border-[#DAE1E9] shadow-lg z-20 py-4 px-2 transition-all duration-300 ease-in-out">
          <div className="w-full flex items-center justify-center gap-3 px-2">
            <img
              src={userDetails?.gravator}
              alt="Profile"
              className="w-7 h-7 rounded-full shrink-0"
            />
            <div className="w-full flex gap-2 justify-between items-center max-w-[90%]">
              <div className="flex flex-col max-w-[70%] shrink-0">
                <p className="text-base font-semibold truncate w-full">
                  {userDetails?.username}
                </p>
                <p className="text-sm text-[#6B7280] w-full truncate">
                  {userDetails?.email}
                </p>
              </div>
              <span className="text-sm text-[#8E9AAC] w-fit">
                {userDetails.plan}
              </span>
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
              <span>
                {userDetails?.generatedSite}/{userDetails?.max_genration}
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 my-2 dark:bg-blue-100">
              <div
                className="h-2 rounded-full bg-blue-gradient"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          <button
            onClick={handleLogOut}
            className="flex items-center gap-2.5 w-full px-4 py-2 text-left text-gray-700 hover:bg-palatinate-blue-50 cursor-pointer rounded-md"
          >
            <img src={LogoutIcon} className="flex-none" />
            <span className="flex-1"> Log out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
