import { Link } from "react-router-dom";
import aibuilder from "../../../assets/aibuilder.svg";
import IntroLayout from "../../Layouts/IntroLayout";

function Welcome() {
  return (
    <IntroLayout>
      <div className="bg-gl-gray-400 w-full min-h-[90vh]  flex items-center  font-['inter'] flex-1 p-6">
        <div className="flex w-full h-full items-center  top-1/2 align-middle flex-1 sm:flex-col">
          {/* 1 */}
          <div className="w-full flex flex-col align-middle items-center ">
            <div className="h-[449px] flex flex-col gap-4 sm:gap-1 p-4">
              <h3 className="font-semibold text-3xl sm:text-xl text-txt-black-600 leading-9 md:text-xl">
                Building a website has never been this easy!
              </h3>

              <div className="  font-normal text-lg text-txt-secondary-400 leading-7 sm:leading-6 sm:text-sm md:text-sm">
                <span className="text-xl leading-7 font-medium text-txt-secondary-400 sm:text-lg md:text-base">
                  Here is how the AI Website Builder works:
                </span>
                <ol className=" font-normal  text-txt-secondary-400 leading-7 sm:leading-6 sm:text-sm md:text-sm">
                  <li>1.Create a free account on GravityWrite platform.</li>
                  <li>2.Describe your dream website in your own words.</li>
                  <li>3.watch as AI crafts your Wordpress website instantly</li>
                  <li>
                    4.Refine the website with an easy drag & drop builder.
                  </li>
                  <li>5.launch</li>
                </ol>
              </div>
              <Link to={"/connect-account"}>
                {" "}
                <button className=" tertiary px-[10px] py-[15px] text-xl sm:text-sm text-white mt-8 sm:mt-2 rounded-md w-[211px]">
                  Let’s Get Started
                </button>
              </Link>
            </div>
          </div>
          {/* 2 */}
          <div className="w-full flex items-center h-full justify-center ">
            <img
              src={aibuilder}
              alt=""
              className=" h-[480px] sm:h-[332px] md:h-[360px]"
            />
          </div>
        </div>
      </div>
    </IntroLayout>
  );
}

export default Welcome;
