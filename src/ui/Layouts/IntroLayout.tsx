import React from "react";
import { Outlet } from "react-router-dom";

const IntroLayout: React.FC = () => {
  return (
    <div className="w-full min-h-screen h-full bg-[#F9FCFF]">
      <main className="h-[90vh]">
        <Outlet />
      </main>
    </div>
  );
};

export default IntroLayout;
