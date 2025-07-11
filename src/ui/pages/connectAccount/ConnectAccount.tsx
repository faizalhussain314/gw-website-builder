import { useNavigate } from "react-router-dom";
import useDomainEndpoint from "../../../hooks/useDomainEndpoint";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

const Mode = import.meta.env.VITE_MODE;

function ConnectAccount() {
  const navigate = useNavigate();
  const { getDomainFromEndpoint } = useDomainEndpoint();
  const userName = useSelector((state: RootState) => state.user.username);

  const onContinue = () => {
    const callBackUrl = getDomainFromEndpoint(
      "wp-admin/admin.php?page=gw-website-builder"
    );

    if (userName) {
      navigate("/category");
    } else {
      if (Mode == "staging") {
        // window.location.href = `https://staging.gravitywrite.com/login?domain=wordpress-react&callback_url=${callBackUrl}`;
        window.location.href = `https://gravitywrite-frontend.pages.dev/login?domain=wordpress-react&callback_url=${callBackUrl}`;
      } else {
        window.location.href = `https://app.gravitywrite.com/login?domain=wordpress-react&callback_url=${callBackUrl}`;
      }
    }
  };
  return (
    <div className="w-full h-screen relative isolate overflow-hidden pt-[100px] pb-[360px]">
      <img
        src="https://plugin.mywpsite.org/connectGWBg.png"
        alt="background image"
        className="absolute inset-0 object-cover -z-10 size-full"
      />

      {/* <img
        src={spaceShip}
        alt="space-ship gif"
        className="hidden mac:inline-block absolute top-[35%] left-[131px] w-[226px] h-[226px]"
      />
      <img
        src={spaceShip}
        alt="space-ship gif"
        className="hidden mac:inline-block absolute top-[25%] right-[137px] w-[226px] h-[226px]"
      /> */}

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
