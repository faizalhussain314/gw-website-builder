import Stepper from "../component/SideStepper";
import GravityWriteLogo from "../assets/logo.svg";
import MenuIcon from "../assets/menu.svg";
import { useState } from "react";

function Sidebar() {
  const [active, setActive] = useState<boolean>(false);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <>
      <div
        className={`bg-white min-h-screen w-[20vw] z-10 border-2 ${
          active ? "hidden" : ""
        }`}
      >
        <div className="flex items-center justify-between py-4 border-b cursor-pointer pr-7 ps-3 sidebar-header">
          <img
            src={GravityWriteLogo}
            alt="gravity write logo"
            className="h-10 p-2 rounded-md cursor-pointer hover:bg-palatinate-blue-50"
          />
          <div className="relative cursor-pointer group" onClick={handleClick}>
            <img
              src={MenuIcon}
              alt="menu"
              className="w-5 h-auto group hidden"
            />
          </div>
        </div>

        <Stepper />
      </div>
    </>
  );
}

export default Sidebar;
