import { useNavigate } from "react-router-dom";

import bgImage from "../../../assets/connectGWBg.png";
import spaceShip from "../../../assets/Spaceship.gif";
import useDomainEndpoint from "../../../hooks/useDomainEndpoint";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

function ConnectAccount() {
  const navigate = useNavigate();
  const { getDomainFromEndpoint } = useDomainEndpoint();
  const userName = useSelector((state: RootState) => state.user.email);

  const onContinue = () => {
    const callBackUrl = getDomainFromEndpoint(
      "wp-admin/admin.php?page=gw-website-builder#/category"
    );

    // window.location.href = `https://staging.gravitywrite.com/login?domain=wordpress&callback_url=${callBackUrl}`;

    // const callBackUrl =
    //   "http://localhost:5173/wp-content/plugins/gw-website-builder-main/API/dist/#/category";

    if (userName) {
      navigate("/category");
    } else {
      window.location.href = `https://staging.gravitywrite.com/login?domain=wordpress-react&callback_url=${callBackUrl}`;
    }
    // navigate("/category");
  };
  return (
    <div className="w-full h-screen relative isolate overflow-hidden pt-[100px] pb-[360px]">
      <img
        src={bgImage}
        alt="background image"
        className="absolute inset-0 object-cover -z-10 size-full"
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

      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid justify-center">
            <p className="text-center text-[52px] mac:text-[44px] leading-[56px] tracking-tight font-bold mb-11 max-w-[800px]">
              Create stunning websites by linking GravityWrite and the AI
              Website Builder.
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
