export const validateEmailAddress = (email: string): string => {
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return validEmail ? "" : "Enter valid email address";
};

export const validatePhoneNumberInput = (phone: string): string => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { isValidPhoneNumber } = require("react-phone-number-input");
  return isValidPhoneNumber(phone) ? "" : "Enter a valid phone number";
};

export const validateAddressInput = (address: string): string => {
  return address ? "" : "Address is required";
};
