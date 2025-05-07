import React from "react";

// Define alert types that you want to handle
type alertType = "contentError" | "userDetails" | "word limit";

type ApiErrorPopupProps = {
  alertType: alertType;
};

const ApiErrorPopup: React.FC<ApiErrorPopupProps> = ({ alertType }) => {
  let title = "";
  let message = "";

  if (alertType === "contentError") {
    title = "Oops! Error While Generating Content";
    message =
      "There was an issue while generating content. Please try again later!";
  } else if (alertType === "userDetails") {
    title = "Oops! Error while fetching user details!";
    message =
      " An error occurred while fetching your user details. Please try again!";
  } else if (alertType === "word limit") {
    title = "Word Usage Limit Reached!";
    message = `To build more websites please upgrade your Plan!`;
  }

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
              {title}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            <p className="text-lg text-center text-gray-700">{message}</p>
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
};

export default ApiErrorPopup;
