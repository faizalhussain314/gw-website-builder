import illustration from "../../../assets/Illustration.png";

type Props = {
  onContinue: () => void;
};

export default function ConnectionToGWPopup({ onContinue }: Props) {
  return (
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
