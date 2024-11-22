import illustration from "../../../assets/Illustration.png";
import { useNavigate } from "react-router-dom";
import { getDomainFromEndpoint } from "../../../core/utils/getDomainFromEndpoint.utils";
import CloseIcon from "../../global component/CloseIcon";
import bgImage from "../../../assets/connectGWBg.png";
import spaceShip from "../../../assets/Spaceship.gif";

function ConnectAccount() {
  const navigate = useNavigate();
  const onContinue = () => {
    navigate("/category");
  };
  return (
    <div className="w-full h-screen relative isolate overflow-hidden pt-[100px] pb-[360px]">
      <img
        src={bgImage}
        alt="background image"
        className="absolute inset-0 -z-10 size-full object-cover"
      />

      <img
        src={spaceShip}
        alt="space-ship gif"
        className="hidden mac:inline-block absolute top-[35%] left-[131px] w-[226px] h-[226px]"
      />
      <img
        src={spaceShip}
        alt="space-ship gif"
        className="hidden mac:inline-block absolute top-[25%] right-[137px] w-[226px] h-[226px]"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="">
            <p className="text-center text-2xl mac:text-5xl font-bold mb-11 mx-w-[900px]">
              Connect your account with GravityWrite to maximize the potential
              of our AI-powered website builder.
            </p>
            <button
              className="flex items-center justify-center px-6 py-4 text-white text-base font-medium rounded-lg tertiary w-full max-w-[280px] mx-auto"
              onClick={onContinue}
            >
              Continue with GravityWrite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConnectAccount;
