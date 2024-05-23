import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MainLayout from "../../Layouts/MainLayout";

function Description() {
  return (
    <MainLayout>
      <div className="bg-[rgba(249, 252, 255, 1)] flex font-['inter']">
        <div className="p-8">
          <div className="mt-8 ml-[50px] flex flex-col">
            <h1 className="text-txt-black-600 leading-5 font-semibold text-3xl font-[inter] mb-4">
              What is abc restaurant? Tell us more about the restaurant.
            </h1>
            <span className="mt-4 text-lg leading-6 text-txt-secondary-400">
              Please be as descriptive as you can. Share details such as a brief
              <br />
              about the restaurant, specialty, menu, etc.
            </span>
          </div>
          <div></div>{" "}
          <div className="mt-8">
            <form>
              <div className="flex gap-1 items-center ml-[20px]">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                >
                  <circle
                    cx="13"
                    cy="13"
                    r="13"
                    fill="#DBE9FF"
                    fill-opacity="0.6"
                  />
                  <path
                    d="M12.1607 18V9.761L10.2707 10.916V9.054L12.1607 7.92H13.8827V18H12.1607Z"
                    fill="#2E42FF"
                  />
                </svg>{" "}
                <label className="leading-5 font-semibold text-lg">
                  What do you offer/sell? or what services do you provide?{" "}
                </label>
              </div>
              <textarea className="bg-white p-4 border h-[100px]  border-[rgba(205, 212, 219, 1)]  w-[720px] mt-4 focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500 ml-[50px]" />
              <div className="flex gap-1 items-center ml-[20px] mt-4">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                >
                  <circle
                    cx="13"
                    cy="13"
                    r="13"
                    fill="#DBE9FF"
                    fill-opacity="0.6"
                  />
                  <path
                    d="M9.03008 17.986V16.516L13.3421 12.673C13.6781 12.3743 13.9114 12.092 14.0421 11.826C14.1727 11.56 14.2381 11.3033 14.2381 11.056C14.2381 10.72 14.1657 10.4213 14.0211 10.16C13.8764 9.894 13.6757 9.684 13.4191 9.53C13.1671 9.376 12.8754 9.299 12.5441 9.299C12.1941 9.299 11.8837 9.38067 11.6131 9.544C11.3471 9.70267 11.1394 9.915 10.9901 10.181C10.8407 10.447 10.7707 10.734 10.7801 11.042H9.04408C9.04408 10.37 9.19341 9.78433 9.49208 9.285C9.79541 8.78567 10.2107 8.39833 10.7381 8.123C11.2701 7.84767 11.8837 7.71 12.5791 7.71C13.2231 7.71 13.8017 7.85467 14.3151 8.144C14.8284 8.42867 15.2321 8.82533 15.5261 9.334C15.8201 9.838 15.9671 10.419 15.9671 11.077C15.9671 11.5577 15.9017 11.9613 15.7711 12.288C15.6404 12.6147 15.4444 12.9157 15.1831 13.191C14.9264 13.4663 14.6067 13.772 14.2241 14.108L11.1651 16.817L11.0111 16.397H15.9671V17.986H9.03008Z"
                    fill="#2E42FF"
                  />
                </svg>{" "}
                <label className="leading-6 font-semibold text-lg ">
                  What steps do customers need to take to start working with the
                  business? what action
                  <br /> visitor needs to take work with you?{" "}
                </label>
              </div>
              <textarea className="bg-white p-4 border h-[100px]  border-[rgba(205, 212, 219, 1)]  w-[720px] mt-4 focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500 ml-[50px]" />
            </form>
          </div>
          <div className="flex gap-4 ml-[50px] mt-2">
            <Link to={"/name"}>
              <button className=" previous-btn flex px-[10px] py-[13px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-lg w-[150px] gap-3 justify-center">
                <ArrowBackIcon />
                Previous
              </button>
            </Link>
            <Link to={"/image"}>
              {" "}
              <button className=" tertiary px-[30px] py-[10px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-md w-[150px] ">
                Continue
              </button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Description;
