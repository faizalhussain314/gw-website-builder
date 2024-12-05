import React from "react";

function ThreeDotLoader() {
  return (
    <div className="fixed inset-0 space-x-2 justify-center items-center  h-screen  bg-slate-100 bg-opacity-50 backdrop-blur-sm z-50">
      <div className="top-1/2 left-1/2 fixed flex space-x-1">
        <div className="h-20 w-8 tertiary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-20 w-8 tertiary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-20 w-8 tertiary rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}

export default ThreeDotLoader;
