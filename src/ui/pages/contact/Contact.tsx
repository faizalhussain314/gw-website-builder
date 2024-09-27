import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import MainLayout from "../../Layouts/MainLayout";

function Contact() {
  return (
    <MainLayout>
      <div className="bg-[#F9FCFF]">
        <div className="w-full p-10">
          <div className="flex flex-col">
            <h1 className="text-txt-black-600 font-semibold text-3xl font-[inter] mb-2.5">
              How can people get in touch with abc restaurant
            </h1>
            <span className="text-lg leading-6 text-txt-secondary-500 max-w-[720px]">
              People provide the contact information details below. These will
              be used on the website.
            </span>

            <form className="w-full mt-9">
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-2 ">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-base font-semibold text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-3">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      className="block w-full rounded-lg bg-white px-4 py-2.5 border border-[rgba(205, 212, 219, 1)] w-[720px]  focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="phone-number"
                    className="block text-base font-semibold text-gray-900"
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
                      placeholder="Enter your Phone number"
                      className="block w-full rounded-lg bg-white px-4 py-2.5 border border-[rgba(205, 212, 219, 1)] w-[720px]  focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="grid mt-6">
                <label
                  htmlFor="message"
                  className="block text-base font-semibold text-gray-900"
                >
                  Address
                </label>
                <div className="mt-2.5">
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    placeholder="Enter your address"
                    className="block w-full rounded-lg bg-white px-4 py-2.5 border border-[rgba(205, 212, 219, 1)] w-[720px] focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500"
                    defaultValue={""}
                  />
                </div>
              </div>
              <div className="mt-10"></div>
            </form>
            <div className="bottom-0 flex items-center justify-between w-full">
              <div className="flex gap-4 items-center">
                <Link to={"/description"}>
                  <button className="previous-btn flex px-[10px] py-[13px] text-base text-white sm:mt-2 rounded-md w-[150px] gap-3 justify-center font-medium">
                    <ArrowBackIcon fontSize="small" />
                    Previous
                  </button>
                </Link>
                <Link to={"/design"}>
                  <button className="tertiary px-[30px] py-[10px] text-base text-white sm:mt-2 font-medium rounded-md w-[150px] ">
                    Continue
                  </button>
                </Link>
              </div>
              <Link to={"/design"}>
                <div className="cursor-pointer">
                  <span className="text-base text-[#6C777D] leading-5 hover:text-palatinate-blue-600">
                    Skip Step
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Contact;
