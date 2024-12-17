import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../Layouts/MainLayout";
import { useState, useEffect } from "react";
import useDomainEndpoint from "../../../hooks/useDomainEndpoint";
import { useDispatch, useSelector } from "react-redux";
import { updateContactForm } from "../../../Slice/activeStepSlice";
import { RootState } from "../../../store/store";
import useFetchCustomContentData from "../../../hooks/useFetchCustomContentData";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { isValidPhoneNumber } from "react-phone-number-input";
import arrow from "../../../assets/arrow.svg";
import { handleEnterKey } from "../../../core/utils/handleEnterKey";

function Contact() {
  const ContactFormRedux = useSelector(
    (state: RootState) => state.userData.contactform
  );
  const businessName = useSelector(
    (state: RootState) => state.userData.businessName
  );
  const category = useSelector((state: RootState) => state.userData.category);
  const [loading, setLoading] = useState(false);
  const fetchCustomContent = useFetchCustomContentData();

  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [formError, setFormError] = useState({
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const { getDomainFromEndpoint } = useDomainEndpoint();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Populate formData from Redux when the component loads
  useEffect(() => {
    if (ContactFormRedux) {
      setFormData({
        email: ContactFormRedux.email || "",
        phoneNumber: ContactFormRedux.phoneNumber || "",
        address: ContactFormRedux.address || "",
      });
    }
  }, [ContactFormRedux]);

  const validateEmail = () => {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    if (!validEmail) {
      setFormError((prevData) => ({
        ...prevData,
        email: "Enter valid email address",
      }));
    } else {
      setFormError((prevData) => ({
        ...prevData,
        email: "",
      }));
    }
  };

  const validatePhoneNumber = (phone) => {
    if (!isValidPhoneNumber(phone)) {
      setFormError((prevData) => ({
        ...prevData,
        phoneNumber: "Enter a valid phone number",
      }));
    } else {
      setFormError((prevData) => ({
        ...prevData,
        phoneNumber: "",
      }));
    }
  };

  const handleChange = (name: string, value: string) => {
    const proccessedvalue = value?.trimStart();
    setFormError((prevData) => ({
      ...prevData,
      [name]: "",
    }));
    setFormData((prevData) => ({
      ...prevData,
      [name]: proccessedvalue,
    }));
  };

  useEffect(() => {
    fetchCustomContent(["contactform"]);
  }, [fetchCustomContent]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    validateEmail();
    validatePhoneNumber(formData.phoneNumber);

    let valid = true;

    if (!formData.email || formError.email) {
      valid = false;
    }

    if (!formData.phoneNumber || formError.phoneNumber) {
      valid = false;
    }

    if (!formData.address) {
      setFormError((prevData) => ({
        ...prevData,
        address: "Address is required",
      }));
      valid = false;
    }

    if (!valid) {
      return;
    }

    setLoading(true);

    if (
      formData.email &&
      formData.phoneNumber &&
      !formError.email &&
      !formError.phoneNumber
    ) {
      dispatch(
        updateContactForm({
          email: formData.email,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
        })
      );

      const url = getDomainFromEndpoint(
        "/wp-json/custom/v1/update-form-details"
      );
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contactform: formData }),
        });

        const result = await response.json();
        setLoading(false);
        navigate("/design");
        return result;
      } catch (error) {
        console.error("Error making API call:", error);
        setLoading(false);
        navigate("/design");
        return null;
      }
    }
  };

  useEffect(() => {
    const isValid =
      !!formData.email &&
      !formError.email &&
      !!formData.phoneNumber &&
      !formError.phoneNumber &&
      !!formData.address;

    setIsFormValid(isValid); // `isValid` is now always a boolean
  }, [formData, formError]);

  // useEffect(() => {
  //   const isValid =
  //     validateEmail() &&
  //     validatePhoneNumber(formData.phoneNumber) &&
  //     formData.address;
  //   setIsFormValid(isValid);
  // }, [formData.email, formData.phoneNumber, formData.address]);

  return (
    <MainLayout>
      <form
        onSubmit={handleSubmit}
        onKeyDown={(event) =>
          handleEnterKey({
            event,
            callback: handleSubmit,
          })
        }
      >
        <div className="bg-[#F9FCFF] w-full p-10">
          <h1 className="text-txt-black-600 font-semibold text-3xl font-[inter] mb-2.5">
            How can people get in touch with {businessName} {category}
          </h1>
          <span className="text-lg text-txt-secondary-500 max-w-[720px]">
            People provide the contact information details below. These will be
            used on the website.
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
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    value={formData.email}
                    onBlur={() => {
                      validateEmail();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === " " && formData.email.length === 0) {
                        e.preventDefault();
                      }
                    }}
                    className={`block w-full rounded-lg bg-white px-4 py-2.5 w-[720px] ${
                      formError.email !== ""
                        ? "border border-[red]"
                        : "border border-[rgba(205, 212, 219, 1)] focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500"
                    }`}
                  />
                  <span className="mt-2 text-red-600">{formError?.email}</span>
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
                  <PhoneInput
                    type="tel"
                    name="phoneNumber"
                    id="phone-number"
                    autoComplete="tel"
                    placeholder="Enter your Phone number"
                    onChange={(value) => {
                      handleChange("phoneNumber", value);
                      // validatePhoneNumber(value);
                    }}
                    onBlur={() => validatePhoneNumber(formData.phoneNumber)}
                    value={formData.phoneNumber}
                    international
                    defaultCountry="US"
                    flags={flags}
                    inputClassName={`block w-full rounded-lg bg-white px-4 py-2.5 outline-none w-[720px] ${
                      formError.phoneNumber !== ""
                        ? "border border-[red]"
                        : "border border-[rgba(205, 212, 219, 1)] focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500"
                    }`}
                    className={`w-full rounded-lg bg-white px-4 py-2.5 outline-none w-[720px] ${
                      formError.phoneNumber !== ""
                        ? "border border-[red]"
                        : "border border-[rgba(205, 212, 219, 1)] focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500"
                    }`}
                  />
                  <span className="mt-2 text-red-600">
                    {formError?.phoneNumber}
                  </span>
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
                  name="address"
                  id="address"
                  rows={4}
                  placeholder="Enter your address"
                  className={`block w-full rounded-lg bg-white px-4 py-2.5 w-[720px] ${
                    formError.address !== ""
                      ? "border border-[red]"
                      : "border border-[rgba(205, 212, 219, 1)] focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500"
                  }`}
                  defaultValue={""}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  value={formData.address}
                />
                {formError.address && (
                  <span className="mt-2 text-red-600">{formError.address}</span>
                )}
              </div>
            </div>
          </form>
          <div className="bottom-0 flex items-center justify-between w-full mt-6">
            <div className="flex items-center gap-4">
              <Link to={"/description"}>
                <button className="previous-btn flex px-[30px] py-[15px] text-base text-white sm:mt-2 rounded-md w-[150px] gap-3 justify-center font-medium">
                  <img src={arrow} alt="arrow-icon" />
                  Previous
                </button>
              </Link>
              {/* <Link to={"/design"}> */}
              <button
                className={`tertiary px-[30px] py-[15px] text-base text-white sm:mt-2 font-medium rounded-md w-[150px] min-h-[54px] ${
                  !isFormValid
                    ? "bg-[#ccc] cursor-not-allowed"
                    : "bg-[#125BFF] cursor-pointer"
                } `}
                type="submit"
              >
                {loading ? (
                  <div className="flex min-w-[65px] justify-center items-center">
                    {" "}
                    <svg
                      className="w-5 h-5 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  "Continue"
                )}
              </button>
              {/* </Link> */}
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
      </form>
    </MainLayout>
  );
}

export default Contact;
