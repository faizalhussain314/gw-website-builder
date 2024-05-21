import GravityWriteLogo from "../assets/logo.svg";

function Header() {
  return (
    <>
      <div className="border-b">
        <div className="sticky top-0 w-full bg-white ">
          <div className=" items-center justify-between h-full border-r">
            <div className="flex items-center justify-between  h-full border-r">
              <div className="flex items-center justify-between py-2 pr-2 border-r cursor-pointer md:pr-7 ps-3">
                <div className="py-2.5 pr-5 left-0">
                  {" "}
                  <img src={GravityWriteLogo} alt="" />
                </div>
              </div>
              <div className="flex items-center justify-between py-2 pr-2 border-r cursor-pointer md:pr-7 ps-3">
                <div className="py-2.5 pr-5 ">
                  <button className=" px-2 md:px-4 py-2 text-md bg-palatinate-blue-600 hover:bg-palatinate-blue-700 focus:bg-palatinate-blue-800 text-white focus:ring-2 ring-palatinate-blue-200  flex items-center justify-center outline-none rounded-lg font-medium text-center tracking-tight transition duration-300 ease-in-out">
                    <span className="mr-1 ">⏰</span> Black Friday Sale - 💰 $97
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
