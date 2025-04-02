import axios from "axios";
import { getDomainFromEndpoint } from "../../../../core/utils/getDomainFromEndpoint.utils";

export const checkImageCount = async (
  pagename: string,
  template_id: number,
  setapiIssue: (value: React.SetStateAction<boolean>) => void
) => {
  const enpoint = getDomainFromEndpoint("wp-json/custom/v1/check-image-count");

  try {
    const response = await axios.post(enpoint, {
      page_name: pagename,
      template_id: template_id,
    });

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
