import React, { useRef, useState } from "react";
import ProfileArrowIcon from "../../assets/icons/profile-arrow-icon.svg";
import CrownIcon from "../../assets/icons/crown.svg";
// import ProfilePicture from "../../assets/ProfilePic.png";
import AiGenerate from "../../assets/icons/aigenerate.svg";
import LogoutIcon from "../../assets/icons/logout.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import useDomainEndpoint from "../../hooks/useDomainEndpoint";
import axios from "axios";
import { useClickOutside } from "@hooks/useClickOutside";
import SignOut from "./dialogs/SignOut";

const ProfileSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getDomainFromEndpoint } = useDomainEndpoint();

  const [logOut, setlogOut] = useState(false);

  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, () => {
    setIsOpen(false);
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const userDetails = useSelector((state: RootState) => state.user);
  const progressPercentage = Math.min(
    (userDetails.generatedSite / userDetails.max_genration) * 100,
    100
  );

  // Check if user data is loaded
  const isLoading = !userDetails?.username || !userDetails?.email;

  const upgradeAccount = () => {
    window.open("https://app.gravitywrite.com/pricing", "_blank");
  };

  const handleLogOut = async () => {
    try {
      const endpoint = getDomainFromEndpoint("/wp-json/custom/v1/disconnect");

      const response = await axios.get(endpoint);

      if (
        response?.data?.success === true ||
        response?.data?.data?.message ===
          "Disconnection has already been completed."
      ) {
        // console.log("signout sucessfull", response.data);
        window.location.href = "/wp-admin/admin.php?page=gravitywrite_settings";
      } else {
        console.error("Unexpected API response:", response?.data);
      }
    } catch (error) {
      console.error("Error in logout API:", error);
    }
  };

  // Skeleton component for loading state
  const SkeletonLoader = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );

  return (
    <>
      {logOut && (
        <SignOut
          onClose={() => setlogOut(false)}
          Signout={handleLogOut}
          cancel={() => setlogOut(false)}
        />
      )}
      <div className="relative w-full rounded-lg" ref={wrapperRef}>
        {/* Account Action Button Section */}
        <div
          className="flex justify-between w-full p-5 gap-x-3"
          onClick={!isLoading ? toggleMenu : undefined}
        >
          <div
            className={`px-3 py-2.5 flex items-center justify-between w-full max-w-[84%] border rounded-lg ${
              !isLoading ? "cursor-pointer" : ""
            } ${isOpen ? "border-palatinate-blue-600" : "border-[#E5E7EB]"}`}
          >
            {isLoading ? (
              <SkeletonLoader className="h-5 w-32" />
            ) : (
              <p className="text-base font-medium truncate w-full max-w-[90%]">
                {userDetails?.username}
              </p>
            )}
            <button
              onClick={!isLoading ? toggleMenu : undefined}
              className={`flex items-center p-0 bg-transparent border-none focus:outline-none ${
                !isLoading ? "cursor-pointer" : ""
              }`}
              disabled={isLoading}
            >
              <img
                src={ProfileArrowIcon}
                className={`${
                  isOpen ? "rotate-180 " : "-rotate-180"
                }transition-all duration-200 ease-in ${
                  isLoading ? "opacity-50" : ""
                }`}
              />
            </button>
          </div>
          {isLoading ? (
            <SkeletonLoader className="w-10 h-10 rounded-full" />
          ) : (
            <img
              src={userDetails?.gravator}
              alt="Profile"
              className="w-10 h-10 rounded-full shrink-0"
            />
          )}
        </div>

        {isOpen && !isLoading && (
          <div className="absolute bottom-[90%] w-[96%] left-2 bg-white rounded-lg border border-[#DAE1E9] shadow-lg z-20 py-4 px-2 transition-all duration-300 ease-in-out">
            <div className="flex items-center justify-center w-full gap-3 px-2">
              <img
                src={userDetails?.gravator}
                alt="Profile"
                className="rounded-full w-7 h-7 shrink-0"
              />
              <div className="w-full flex gap-2 justify-between items-center max-w-[90%]">
                <div className="flex flex-col max-w-[70%] shrink-0">
                  <p className="w-full text-base font-semibold truncate">
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
            <div className="flex items-center justify-center px-4 my-5">
              <button
                onClick={upgradeAccount}
                className="flex items-center justify-center w-full gap-2 px-4 py-3 text-base text-white rounded-lg tertiary"
              >
                <img src={CrownIcon} />
                Upgrade
              </button>
            </div>
            <div className="h-[1px] w-full bg-gray-200"></div>

            <div className="px-4 py-2 pt-4">
              <div className="flex items-center justify-between w-full gap-2 text-gray-700">
                <div className="flex items-center gap-x-2.5">
                  <img src={AiGenerate} />
                  <span className="">AI Website Generation</span>
                </div>
                <span>
                  {userDetails?.generatedSite}/{userDetails?.max_genration}
                </span>
              </div>
              <div className="w-full h-2 my-2 bg-blue-200 rounded-full dark:bg-blue-100">
                <div
                  className="h-2 rounded-full bg-blue-gradient"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            <button
              onClick={() => setlogOut(true)}
              className="flex items-center gap-2.5 w-full px-4 py-2 text-left text-gray-700 hover:bg-palatinate-blue-50 cursor-pointer rounded-md"
            >
              <img src={LogoutIcon} className="flex-none" />
              <span className="flex-1"> Log out</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileSection;
