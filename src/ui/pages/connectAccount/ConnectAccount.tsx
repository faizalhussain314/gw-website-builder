// import Connectlogo from "../../../assets/connect.svg";
// import { Link } from "react-router-dom";
import illustration from "../../../assets/Illustration.png";
import { useNavigate } from "react-router-dom";
import { getDomainFromEndpoint } from "../../../core/utils/getDomainFromEndpoint.utils";

function ConnectAccount() {
  const navigate = useNavigate();
  const onContinue = () => {
    // const domainLink = getDomainFromEndpoint("");
    // const callbackUrl = `${domainLink}/wp-admin/admin.php?page=gw-website-builder#/category`;
    // const redirectUrl = `https://app.gravitywrite.com/login?callbackurl=${encodeURIComponent(
    //   callbackUrl
    // )}&source=ai-website-builder`;

    // window.location.href = redirectUrl;

    navigate("/category");
  };
  return (
    // <div className="bg-gl-gray-400 w-full min-h-[90vh] flex items-center  font-['inter'] flex-1 p-6 align-middle justify-center">
    //   <div className="flex flex-col justify-center max-w-[500px] p-8 bg-white shadow-custom rounded-xl">
    //     <h3 className="text-xl tracking-[-0.6px] font-semibold leading-[30px] text-center text-txt-black-600">
    //       Almost There...
    //     </h3>
    //     <span className="text-base mt-3 font-normal leading-[22px] tracking-[-0.48px] text-center text-txt-secondary-400">
    //       Let's connect your GravityWrite account with this website
    //     </span>
    //     <div className="flex justify-center mt-[25px] mb-5">
    //       <img src={Connectlogo} alt="" className="justify-center" />
    //     </div>
    //     <div className="flex tracking-[-0.48px] leading-6 justify-center text-base">
    //       <span className="text-base font-normal text-center text-txt-secondary-400">
    //         Click the button below to connect your GravityWrite account
    //         <span className="font-medium text-txt-black-600">
    //           {" "}
    //           abc@gmail.com{" "}
    //         </span>
    //         with{" "}
    //         <span className="font-medium text-txt-black-600">
    //           https://abcd.gravitywrite.link
    //         </span>
    //       </span>
    //     </div>
    //     <div className="flex mt-[35px] justify-center align-middle">
    //       <Link
    //         to="/category"
    //         className="text-lg leading-7 font-medium tracking-[-0.36px] text-white rounded-[10px] px-[61.5px] py-[12px] tertiary sm:text-sm"
    //       >
    //         Continue
    //       </Link>
    //     </div>
    //     <Link
    //       to="/"
    //       className="mt-[15px] text-base text-center underline leading-6 tracking-[-0.48px] font-medium cursor-pointer text-palatinate-blue-500"
    //     >
    //       Want to use a different account?
    //     </Link>
    //   </div>
    // </div>

    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 backdrop-blur-xl bg-opacity-50 z-50">
      <div className="relative bg-white shadow-lg p-8 sm:p-8 w-full max-w-[500px] pb-11 z-10 rounded-[10px]">
        <div className="flex flex-col items-center justify-center mt-4">
          <img src={illustration} alt="illustration of connection to GW" />
          <p className="text-lg text-center text-[#4D586B] mt-4 mb-8">
            To take full advantage of our AI-powered website builder, you'll
            need to connect your account with GravityWrite.
          </p>
          <button
            className="flex items-center justify-center px-6 py-4 text-white text-base font-medium rounded-lg tertiary w-full max-w-[280px]"
            onClick={onContinue}
          >
            Continue with GravityWrite
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConnectAccount;
