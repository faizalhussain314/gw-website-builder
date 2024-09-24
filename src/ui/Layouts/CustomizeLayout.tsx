import React, { ReactNode } from "react";
// import CustomizeSidebar from "../component/customizeSidebar";
import CustomizeSidebar from "../component/CustomizeSidebar";
import Header from "../global component/Header";

interface MainLayoutProps {
  children: ReactNode;
}

const CustomizeLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="h-screen flex  flex-nowrap  font-[inter]">
        <div className="w-[20%] ">
          <aside className="z-10 ">
            <CustomizeSidebar />
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
