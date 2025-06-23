import React from "react";
import Sidebar from "../global component/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <div className="flex">
      <div className="w-[23%]">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 max-w-full max-h-screen">
        <main className="flex flex-col flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
