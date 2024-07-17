import React, { ReactNode } from "react";
import Header from "../global component/Header";

interface IntroLayoutProps {
  children: ReactNode;
}

const IntroLayout: React.FC<IntroLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen">
      <Header active={true} />
      <main className="h-[90vh]">{children}</main>
    </div>
  );
};

export default IntroLayout;
