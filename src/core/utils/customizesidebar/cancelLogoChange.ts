import axios from "axios";
import { sendIframeMessage } from "../sendIframeMessage.utils";
import { getDomainFromEndpoint } from "../getDomainFromEndpoint.utils";
import { Dispatch } from "redux";
import { setLogo } from "../../../Slice/activeStepSlice";

export const cancelLogoChange = async (
  businessName: string,
  setLogoUrl: React.Dispatch<React.SetStateAction<string | null>>,
  dispatch: Dispatch,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const endpoint = getDomainFromEndpoint("wp-json/custom/v1/delete-sitelogo");
    const response = await axios.delete(endpoint);

    if (response.data.success) {
      sendIframeMessage("bussinessName", businessName);
      setSuccessMessage(null);
      setError(null);

      setLogoUrl("");
      dispatch(setLogo(null));

      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    } else {
      setError("Unexpected response while deleting logo");
    }
  } catch (error) {
    setError("Error while deleting logo");
  }
};
