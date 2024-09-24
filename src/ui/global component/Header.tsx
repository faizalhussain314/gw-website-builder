import GravityWriteLogo from "../../assets/logo.svg";

interface HeaderProps {
  active: boolean;
}

const Header: React.FC<HeaderProps> = ({ active }) => {
  return (
    <>
      <div className="border-b border-[#DFEAF6]">
        <div className="sticky top-0 w-full bg-white pb-[2px]">
          <div className="items-center justify-between h-full border-r ">
            <div className="flex items-center justify-between h-full border-r">
              <div className="flex items-center justify-between pt-[11px] pb-[14px] pr-2  cursor-pointer md:pr-7 ps-3">
                <div className=" pr-5 left-0 pt-[11px] pb-[11px]">
                  {!active && <div className="h-[25px] w-1"></div>}
                  {active && (
                    <img
                      src="https://tours.mywpsite.org/wp-content/uploads/2024/08/logo.svg"
                      alt="gravity write logo"
                      className="h-10 p-2 rounded-md cursor-pointer hover:bg-palatinate-blue-50"
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between py-2 pr-2 border-r cursor-pointer md:pr-7 ps-3">
                <div className="py-2.5 pr-5 ">
                  {active && (
                    <button className="flex items-center justify-center px-2 py-2 text-sm font-medium tracking-tight text-center text-white transition duration-300 ease-in-out rounded-lg outline-none md:px-4 bg-palatinate-blue-600 hover:bg-palatinate-blue-700 focus:bg-palatinate-blue-800 focus:ring-2 ring-palatinate-blue-200">
                      <span className="mr-1 ">⏰</span> upgrade - 💰 $97
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
