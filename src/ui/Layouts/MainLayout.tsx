import React, { ReactNode } from "react";
import Header from "../global component/Header";
import Sidebar from "../global component/Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex font-[inter]">
      <div className=" mac:w-[20%] w-[25%]">
        <aside className="z-10 fixed">
          <Sidebar />
        </aside>
      </div>
      <div className="mac:w-[80%] w-[75%]">
        <Header active={false} />

        <main>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
