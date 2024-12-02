import Stepper from "../component/SideStepper";
import GravityWriteLogo from "../../assets/logo.svg";
import MenuIcon from "../../assets/menu.svg";
import { useState } from "react";
import ProfileSection from "../component/ProfileSection";

function Sidebar() {
  const [active, setActive] = useState<boolean>(false);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <div
      className={`${
        active ? "hidden" : ""
      } bg-white w-full h-screen border-r border-[#DFEAF6] flex flex-col`}
    >
      <>
        {/* Header Section */}
        <div className="flex items-center justify-between py-4 border-b cursor-pointer pr-7 ps-3 sidebar-header">
          <img
            src="https://plugin.mywpsite.org/logo.svg"
            alt="gravity write logo"
            className="h-10 p-2 rounded-md"
          />
          <div className="relative cursor-pointer group" onClick={handleClick}>
            <img
              src={MenuIcon}
              alt="menu"
              className="hidden w-5 h-auto group"
            />
          </div>
        </div>
        {/* Stepper Section */}
        <Stepper />
      </>
      {/* Account Section */}
      <div className="mt-auto">
        <ProfileSection />
      </div>
    </div>
  );
}

export default Sidebar;
