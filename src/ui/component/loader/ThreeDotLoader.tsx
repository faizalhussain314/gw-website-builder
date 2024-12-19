import React from "react";

function ThreeDotLoader() {
  return (
    <div className="fixed inset-0 space-x-2 justify-center items-center  h-screen  bg-slate-100 bg-opacity-50 backdrop-blur-sm z-50">
      <div className="top-1/2 left-1/2 fixed flex space-x-1">
        <div className="h-12 w-12 bg-gradient-to-r from-[#963fff] via-[#2e42ff] to-[#2e42ff] text-white transition-all duration-300 flex gap-2.5 items-center justify-center rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-12 w-12 bg-gradient-to-r from-[#963fff] via-[#2e42ff] to-[#2e42ff] text-white transition-all duration-300 flex gap-2.5 items-center justify-center rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-12 w-12 bg-gradient-to-r from-[#963fff] via-[#2e42ff] to-[#2e42ff] text-white transition-all duration-300 flex gap-2.5 items-center justify-center rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}

export default ThreeDotLoader;
