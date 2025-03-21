type ImportWarningProps = {
  onClose: () => void;
  continueImport: () => void;
  isimportLoading: boolean;
};

const ImportWarning = ({
  onClose,
  continueImport,
  isimportLoading,
}: ImportWarningProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 backdrop-blur-xl bg-opacity-50 z-50">
      <div className="relative bg-white shadow-lg p-8 sm:p-8 w-full max-w-[500px] pb-6 z-10 rounded-[10px]">
        <div
          className="absolute top-5 right-5 cursor-pointer"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M13.9731 12.2675L8.61581 6.96206L13.9195 1.61056L12.2675 -0.0268555L6.96498 5.32756L1.61231 0.0262279L-0.0268555 1.66539L5.33164 6.97664L0.0262279 12.334L1.66539 13.9731L6.98073 8.61114L12.3357 13.9195L13.9731 12.2675Z"
              fill="#6C777D"
            />
          </svg>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <div className="flex items-center justify-center gap-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g clip-path="url(#clip0_1741_1374)">
                <path
                  d="M22.3125 3.5625C22.5714 3.5625 22.7812 3.35263 22.7812 3.09375C22.7812 2.83487 22.5714 2.625 22.3125 2.625C22.0536 2.625 21.8438 2.83487 21.8438 3.09375C21.8438 3.35263 22.0536 3.5625 22.3125 3.5625Z"
                  fill="#FF1526"
                />
                <path
                  d="M22.3125 21.375C22.5714 21.375 22.7812 21.1651 22.7812 20.9062C22.7812 20.6474 22.5714 20.4375 22.3125 20.4375C22.0536 20.4375 21.8438 20.6474 21.8438 20.9062C21.8438 21.1651 22.0536 21.375 22.3125 21.375Z"
                  fill="#FF1526"
                />
                <path
                  d="M19.7344 2.15625C20.1227 2.15625 20.4375 1.84145 20.4375 1.45312C20.4375 1.0648 20.1227 0.75 19.7344 0.75C19.346 0.75 19.0312 1.0648 19.0312 1.45312C19.0312 1.84145 19.346 2.15625 19.7344 2.15625Z"
                  fill="#FF1526"
                />
                <path
                  d="M3.32812 22.7812C3.71645 22.7812 4.03125 22.4665 4.03125 22.0781C4.03125 21.6898 3.71645 21.375 3.32812 21.375C2.9398 21.375 2.625 21.6898 2.625 22.0781C2.625 22.4665 2.9398 22.7812 3.32812 22.7812Z"
                  fill="#FF1526"
                />
                <path
                  d="M2.625 2.15625C2.88388 2.15625 3.09375 1.94638 3.09375 1.6875C3.09375 1.42862 2.88388 1.21875 2.625 1.21875C2.36612 1.21875 2.15625 1.42862 2.15625 1.6875C2.15625 1.94638 2.36612 2.15625 2.625 2.15625Z"
                  fill="#FF1526"
                />
                <path
                  d="M1.21875 19.9688C1.47763 19.9688 1.6875 19.7589 1.6875 19.5C1.6875 19.2411 1.47763 19.0312 1.21875 19.0312C0.959867 19.0312 0.75 19.2411 0.75 19.5C0.75 19.7589 0.959867 19.9688 1.21875 19.9688Z"
                  fill="#FF1526"
                />
                <path
                  d="M12 3.09375C7.08909 3.09375 3.09375 7.08909 3.09375 12C3.09375 16.9109 7.08909 20.9062 12 20.9062C16.911 20.9062 20.9062 16.911 20.9062 12C20.9062 7.08905 16.911 3.09375 12 3.09375ZM13.3253 18.0135C12.9714 18.3674 12.5007 18.5625 12 18.5625C10.9661 18.5625 10.125 17.7214 10.125 16.6875C10.125 16.1862 10.3202 15.7153 10.6747 15.3615C11.0286 15.0076 11.4994 14.8125 12 14.8125C12.5007 14.8125 12.9714 15.0076 13.3257 15.3618C13.6798 15.7153 13.875 16.1863 13.875 16.6875C13.875 17.1887 13.6798 17.6597 13.3253 18.0135ZM13.875 12C13.875 13.0339 13.0339 13.875 12 13.875C10.9661 13.875 10.125 13.0339 10.125 12V7.3125C10.125 6.27863 10.9661 5.4375 12 5.4375C12.5007 5.4375 12.9714 5.63259 13.3257 5.98683C13.6798 6.34031 13.875 6.81127 13.875 7.3125V12Z"
                  fill="#FF1526"
                />
                <path
                  d="M12 6.375C11.4831 6.375 11.0625 6.79556 11.0625 7.3125V12C11.0625 12.5169 11.4831 12.9375 12 12.9375C12.5169 12.9375 12.9375 12.5169 12.9375 12V7.3125C12.9375 7.06195 12.84 6.82669 12.6631 6.65002C12.4856 6.47255 12.2502 6.375 12 6.375Z"
                  fill="#FF1526"
                />
                <path
                  d="M12 15.75C11.7498 15.75 11.5144 15.8476 11.3372 16.0247C11.16 16.2017 11.0625 16.437 11.0625 16.6875C11.0625 17.2044 11.4831 17.625 12 17.625C12.2502 17.625 12.4856 17.5275 12.6628 17.3503C12.84 17.1733 12.9375 16.938 12.9375 16.6875C12.9375 16.437 12.84 16.2017 12.6631 16.025C12.4856 15.8475 12.2502 15.75 12 15.75Z"
                  fill="#FF1526"
                />
                <path
                  d="M19.955 4.04498C17.8303 1.92019 15.0051 0.75 12 0.75C8.99494 0.75 6.16978 1.92019 4.04498 4.04498C1.92019 6.16973 0.75 8.99494 0.75 12C0.75 15.0051 1.92019 17.8303 4.04498 19.955C6.16978 22.0798 8.99494 23.25 12 23.25C15.0051 23.25 17.8303 22.0798 19.955 19.955C22.0798 17.8303 23.25 15.0051 23.25 12C23.25 8.99489 22.0798 6.16973 19.955 4.04498ZM12 22.3125C6.31364 22.3125 1.6875 17.6864 1.6875 12C1.6875 6.31364 6.31364 1.6875 12 1.6875C17.6864 1.6875 22.3125 6.31364 22.3125 12C22.3125 17.6864 17.6864 22.3125 12 22.3125Z"
                  fill="#FF1526"
                />
              </g>
              <defs>
                <clipPath id="clip0_1741_1374">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <p className="text-2xl font-semibold text-neutral-950">
              All your content will be deleted
            </p>
          </div>
          <p className="text-xl text-center text-[#4D586B] mt-5">
            This action will permanently delete your changes in the current
            website Are you sure you want to import new template?
          </p>
          <div className="flex items-center justify-center gap-5 mt-8 w-full">
            <button
              className="flex items-center justify-center px-6 py-4 text-white text-base font-medium rounded-lg bg-[#E6F0FE] w-full previous-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="flex items-center justify-center px-6 py-4 text-white text-base font-medium rounded-lg tertiary w-full"
              onClick={continueImport}
              disabled={isimportLoading}
            >
              {isimportLoading ? (
                <div className="flex">
                  {" "}
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                </div>
              ) : (
                "Proceed"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportWarning;
