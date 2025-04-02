import React, { ReactNode } from "react";
import CustomizeSidebar from "../component/CustomizeSidebar";

interface MainLayoutProps {
  children: ReactNode;
  setLimitReached: React.Dispatch<React.SetStateAction<boolean>>;
  setPlanExpired: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomizeLayout: React.FC<MainLayoutProps> = ({
  children,
  setLimitReached,
  setPlanExpired,
}) => {
  return (
    <>
      <div className="h-screen flex  flex-nowrap  font-[inter]">
        <div className="w-[20%] ">
          <aside className="z-10 ">
            <CustomizeSidebar
              setLimitReached={setLimitReached}
              setPlanExpired={setPlanExpired}
            />
          </aside>
        </div>
        <div className="w-[80%]">
          {/* <Header active={false} /> */}
          <main className="w-full h-full">{children}</main>
        </div>
      </div>
    </>
  );
};

export default CustomizeLayout;
