import Connectlogo from "../../assets/connect.svg";
import { Link } from "react-router-dom";

function ConnectAccount() {
  return (
    <div className="bg-gl-gray-400  w-full min-h-[90vh] flex items-center  font-['inter'] flex-1 p-6 align-middle justify-center items-center">
      <div className="bg-white shadow-custom rounded-xl p-8 justify-center max-w-xl flex flex-col justify-center">
        <h3 className="text-txt-black-600 text-xl align-middle text-center">
          Almost There...
        </h3>
        <span className="text-base text-txt-secondary-400 leading-5 text-center">
          Let's connect your GravityWrite account with this website
        </span>
        <div className="flex justify-center m-4">
          <img src={Connectlogo} alt="" className="justify-center" />
        </div>
        <div className="text-base justify-center flex">
          <span className="text-base font-normal text-txt-secondary-400 leading-6 text-center">
            Click the button below to connect your GravityWrite account
            <span className="text-txt-black-600 leading-7">
              {" "}
              abc@gmail.com{" "}
            </span>
            with{" "}
            <span className="text-txt-black-600 leading-7">
              https://abcd.gravitywrite.link
            </span>
          </span>
        </div>
        <div className="flex justify-center align-middle">
          <Link to="/category">
            {" "}
            <button className="tertiary px-[10px] py-[15px] text-xl sm:text-sm text-white mt-8 rounded-md w-[211px]">
              Continue
            </button>
          </Link>
        </div>
        <span className="text-palatinate-blue-500 underline text-center mt-4 cursor-pointer">
          Want to use a different account?
        </span>
      </div>
    </div>
  );
}

export default ConnectAccount;
