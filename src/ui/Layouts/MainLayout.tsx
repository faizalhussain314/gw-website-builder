import React, { ReactNode } from "react";
import Header from "../global component/Header";
import Sidebar from "../global component/Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-[23%]">
        <Sidebar />
      </div>
      {/* Main Container */}
      <div className="flex flex-col flex-1 max-w-full max-h-screen">
        {/* <Header active={false} /> */}

        <main className="flex flex-col flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
