import axios from "axios";
import store from "../../../store/store";

const API_URL = import.meta.env.VITE_API_BACKEND_URL;
export const checkImageCount = async (
  pagename: string,
  templateId: number,
  setapiIssue: (value: React.SetStateAction<boolean>) => void
) => {
  const wp_token = store.getState().user.wp_token;

  console.log("auth token", wp_token);
  try {
    const response = await axios.get(
      `${API_URL}check-image-count?page_name=${pagename}&template_id=${templateId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${wp_token}`,
        },
      }
    );

    const data = response.data;
    console.log("response of image count api", data);

    if (data.status) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    setapiIssue(() => true);
    console.error("error with image count check api", e);
  }
};
