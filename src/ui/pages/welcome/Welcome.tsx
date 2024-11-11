import { useNavigate } from "react-router-dom";
import aibuilder from "../../../assets/aibuilder.svg";
import IntroLayout from "../../Layouts/IntroLayout";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

function Welcome() {
  const userDetails = useSelector((state: RootState) => state?.user);
  const navigate = useNavigate();

  const handleRedirection = () => {
    if (userDetails?.username || userDetails?.username?.trim().length > 0) {
      console.log("Redirection to /category");
      navigate("/category");
    } else {
      console.log("Redirection to /connect-account");
      navigate("/connect-account");
    }
  };

  return (
    <IntroLayout>
      <div className="bg-[#F9FCFF] w-full h-full flex items-center justify-between max-w-[1144px] mx-auto">
        {/* 1 */}
        <div className="flex flex-col items-center align-middle">
          <div className="flex flex-col ">
            <h3 className="font-semibold text-3xl  text-txt-black-600 leading-[38px] mb-[25px] tracking-[-0.9px]">
              Building a website has never been this easy!
            </h3>
            <div className="text-lg font-normal leading-7 text-txt-secondary-400 sm:leading-6 sm:text-sm md:text-sm">
              <span className="tracking-[-0.6px] text-xl leading-7 font-medium text-txt-black-600 sm:text-lg md:text-base">
                Here is how the AI Website Builder works:
              </span>
              <ol className="list-outside px-6 mt-[10px] list-decimal font-normal text-[#5F5F5F] leading-[35px] sm:text-sm md:text-sm">
                <li>Create a free account on GravityWrite platform.</li>
                <li>Describe your dream website in your own words.</li>
                <li>Watch as AI crafts your Wordpress website instantly.</li>
                <li>Refine the website with an easy drag & drop builder.</li>
                <li>Launch.</li>
              </ol>
            </div>
            <button
              className="px-[35px] w-fit not-italic py-[15px] tertiary text-lg sm:text-sm text-white mt-[35px] sm:mt-2 rounded-[10px] capitalize tracking-[-0.36px] font-medium"
              onClick={handleRedirection}
            >
              Let's get started
            </button>
          </div>
        </div>
        {/* 2 */}
        <div className="h-full flex items-center">
          <img src={aibuilder} alt="" className="w-[461px] h-[449px]" />
        </div>
      </div>
    </IntroLayout>
  );
}

export default Welcome;
