import React, { ReactNode } from "react";
import Header from "../global component/Header";
import Sidebar from "../global component/Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex font-[inter]">
      <div className="w-[20%] ">
        <aside className="z-10 fixed">
          <Sidebar />
        </aside>
      </div>
      <div className="w-[80%]">
        <Header active={false} />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
