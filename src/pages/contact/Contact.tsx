import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import MainLayout from "../../Layouts/MainLayout";

function Contact() {
  return (
    <MainLayout>
      <div className="bg-[rgba(249, 252, 255, 1)] flex font-['inter']">
        <div className="p-8 w-full">
          <div className="mt-8 ml-[50px] flex flex-col">
            <h1 className="text-txt-black-600 leading-5 font-semibold text-3xl font-[inter] mb-4">
              How can people get in touch with abc restaurant
            </h1>
            <span className="mt-4 text-lg leading-6 text-txt-secondary-400">
              People provide the contact information details below. These will
              be used on the website.
            </span>

            <form className=" mt-16 max-w-4xl sm:mt-20 ">
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-2 ">
                <div className="sm:col-span-2 ">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      className="block w-full rounded-md bg-white p-2 border border-[rgba(205, 212, 219, 1)] rounded-md w-[720px]  focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="phone-number"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Phone number
                  </label>
                  <div className="relative mt-2.5">
                    <div className="absolute inset-y-0 left-0 flex items-center"></div>
                    <input
                      type="tel"
                      name="phone-number"
                      id="phone-number"
                      autoComplete="tel"
                      className="block w-full rounded-md bg-white p-2 border border-[rgba(205, 212, 219, 1)] rounded-md w-[720px]  focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="grid">
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold leading-6 mt-2 text-gray-900"
                >
                  Address
                </label>
                <div className="mt-2.5">
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    className="block w-full rounded-md bg-white p-2 border border-[rgba(205, 212, 219, 1)] rounded-md w-[720px]  focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500"
                    defaultValue={""}
                  />
                </div>
              </div>
              <div className="mt-10"></div>
            </form>
            <div className="flex justify-between bottom-0 max-w-4xl">
              <div className="flex gap-4">
                {" "}
                <Link to={"/image"}>
                  <button className=" previous-btn flex px-[10px] py-[13px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-md w-[150px] gap-3 justify-center">
                    <ArrowBackIcon />
                    Previous
                  </button>
                </Link>
                <Link to={"/"}>
                  <button className=" tertiary px-[30px] py-[10px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-md w-[150px] ">
                    Continue
                  </button>
                </Link>
              </div>
              <div className="mt-8 cursor-pointer flex items-center">
                <span className="text-base text-[#6C777D] leading-5">
                  Skip This Step
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Contact;
