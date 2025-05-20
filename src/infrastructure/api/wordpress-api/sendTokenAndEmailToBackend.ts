import wordpressAxios from "@config/wordpressAxios";

export const sendTokenAndEmailToBackend = async (
  wp_token: string,
  fe_token: string,
  email: string
) => {
  const endpoint = "wp-json/custom/v1/user-details-react";
  try {
    const response = await wordpressAxios.post(endpoint, {
      email: email,
      wp_token: wp_token,
      fe_token: fe_token,
    });

    console.log(response);
  } catch (error) {
    console.log("api error in store user detail:", error);
    return error;
  }
};
