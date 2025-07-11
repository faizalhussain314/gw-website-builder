import { useState } from "react";
import { Link } from "react-router-dom";
import Crediticon from "./icon/Crediticon";

interface creditOverlayProps {
  toolName?: string;
}

export default function CreditOverlay(props: creditOverlayProps) {
  const { toolName } = props;

  const isSidebarOpen = useState(false);
  return (
    <div
      className={`absolute top-0 w-full h-full z-[1000] select-none -translate-x-1/2 left-1/2 bg-[linear-gradient(180deg,_rgba(255,255,255,0)_0%,_#ffffff_53.79%)] ${
        isSidebarOpen && "sm:left-[60%]"
      } duration-200 `}
    >
      <div className="flex items-center justify-center h-full mx-auto credit-blur">
        <div className="grid place-items-center">
          <Crediticon />
          {/* Pop up */}
          <div className="text-center text-gw-black-950 mt-[18px]">
            <h2 className="mb-2 text-2xl font-semibold tracking-tight">
              🎉 Credit System Update
            </h2>
            <p className=" max-w-[442px] mb-6 text-[#171A1E] text-center font-inter text-base font-normal leading-6 tracking-[-0.4px]">
              GravityWrite now uses credits for generations. Update your
              WordPress plugin to stay compatible
            </p>

            <div className="flex flex-col items-center justify-center gap-y-2">
              <button
                // variant="primary"
                className="w-[200px] bg-palatinate-blue-600 text-white rounded p-2"
                onClick={() => {
                  window.open(
                    "https://gravitywrite.com/ai-website-builder",
                    "_blank"
                  );
                }}
              >
                Update Plugin Now
              </button>
              {/* <Link
                to="/"
                className="text-sm font-medium cursor-pointer text-palatinate-blue-600 hover:text-palatinate-blue-700 active:text-palatinate-blue-800 active:scale-95"
              >
                Maybe Later
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
