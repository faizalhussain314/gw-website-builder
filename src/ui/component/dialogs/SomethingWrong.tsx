import React from "react";

function SomethingWrong() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 backdrop-blur-xl bg-opacity-50 z-50">
      <div className="relative bg-white shadow-lg p-8 sm:p-8 w-full max-w-[500px] pb-6 z-10 rounded-[10px]">
        <div className="flex flex-col items-center justify-center p-4">
          <img
            src="https://plugin.mywpsite.org/Error.gif"
            className="w-auto h-52"
          />
          <div className="flex items-center justify-center gap-2.5 -mt-4">
            <p className="text-2xl font-semibold text-neutral-950 text-center">
              Something Went Wrong
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            <p className="text-lg text-center text-gray-700">
              We encountered an unexpected issue while processing your request
            </p>
          </div>

          <div className="flex items-center justify-center gap-5 mt-8 w-full">
            <button
              className="flex items-center justify-center px-6 py-4 text-white text-base font-medium rounded-lg tertiary w-full"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SomethingWrong;
