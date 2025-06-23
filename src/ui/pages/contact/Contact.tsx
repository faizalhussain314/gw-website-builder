import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateContactForm } from "../../../Slice/activeStepSlice";
import { RootState } from "../../../store/store";
import "react-phone-number-input/style.css";
import arrow from "../../../assets/arrow.svg";
import { handleEnterKey } from "@utils";
import {
  EmailField,
  PhoneField,
  AddressField,
  FormActions,
  ContactHeader,
} from "@components";
import { useContactForm } from "@hooks/useContactForm";
import { updateFormDetail } from "@api/wordpress-api";

function Contact() {
  const ContactFormRedux = useSelector(
    (state: RootState) => state.userData.contactform
  );

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    formData,
    formError,
    isFormValid,
    setFormError,
    validateEmail,
    validatePhoneNumber,
    handleChange,
  } = useContactForm(ContactFormRedux);

  const handleSubmit = async (e: React.KeyboardEvent<HTMLFormElement>) => {
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

      try {
        const response = await updateFormDetail({ contactform: formData });

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

  return (
    <React.Fragment>
      <form
        onSubmit={handleSubmit}
        onKeyDown={(event) =>
          handleEnterKey({
            event,
            callback: () => handleSubmit(event),
          })
        }
      >
        <div className="bg-[#F9FCFF] w-full p-10">
          <ContactHeader />

          <form className="w-full mt-9">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-2">
              <EmailField
                value={formData.email}
                error={formError.email}
                onChange={handleChange}
                onBlur={validateEmail}
              />
              <PhoneField
                value={formData.phoneNumber}
                error={formError.phoneNumber}
                onChange={handleChange}
                onBlur={() => validatePhoneNumber(formData.phoneNumber)}
              />
            </div>
            <AddressField
              value={formData.address}
              error={formError.address}
              onChange={handleChange}
            />
          </form>

          <FormActions
            isFormValid={isFormValid}
            loading={loading}
            arrowIcon={arrow}
          />
        </div>
      </form>
    </React.Fragment>
  );
}

export default Contact;
