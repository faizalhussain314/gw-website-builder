import React, { ReactNode } from "react";

interface IntroLayoutProps {
  children: ReactNode;
}

const IntroLayout: React.FC<IntroLayoutProps> = ({ children }) => {
  return (
    <div className="w-full min-h-screen h-full bg-[#F9FCFF]">
      {/* <Header active={true} /> */}
      <main className="h-[90vh]">{children}</main>
    </div>
  );
};

export default IntroLayout;
