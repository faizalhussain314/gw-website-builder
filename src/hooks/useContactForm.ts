import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";

interface FormData {
  email: string;
  phoneNumber: string;
  address: string;
}

interface FormError {
  email: string;
  phoneNumber: string;
  address: string;
}

interface UseContactFormReturn {
  formData: FormData;
  formError: FormError;
  isFormValid: boolean;
  setFormError: Dispatch<SetStateAction<FormError>>;
  validateEmail: () => void;
  validatePhoneNumber: (phone: string) => void;
  handleChange: (name: string, value: string) => void;
}

export const useContactForm = (
  initialData?: FormData
): UseContactFormReturn => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    phoneNumber: "",
    address: "",
  });

  const [formError, setFormError] = useState<FormError>({
    email: "",
    phoneNumber: "",
    address: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email || "",
        phoneNumber: initialData.phoneNumber || "",
        address: initialData.address || "",
      });
    }
  }, [initialData]);

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

  const validatePhoneNumber = (phone: string) => {
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
    const processedValue = value?.trimStart();
    setFormError((prevData) => ({
      ...prevData,
      [name]: "",
    }));
    setFormData((prevData) => ({
      ...prevData,
      [name]: processedValue,
    }));
  };

  useEffect(() => {
    const isValid =
      !!formData.email &&
      !formError.email &&
      !!formData.phoneNumber &&
      !formError.phoneNumber &&
      !!formData.address;

    setIsFormValid(isValid);
  }, [formData, formError]);

  return {
    formData,
    formError,
    isFormValid,
    setFormError,
    validateEmail,
    validatePhoneNumber,
    handleChange,
  };
};
