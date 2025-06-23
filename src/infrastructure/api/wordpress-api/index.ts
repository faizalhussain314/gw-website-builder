import { fetchWpToken } from "./fetchToken";
import { checkSiteCount } from "./checkSiteCount";
import { getUserDetails } from "./userDetails";
import { sendTokenAndEmailToBackend } from "./sendTokenAndEmailToBackend";
import { updateCategoryDetails } from "./category/updateCategoryDetails.api";
import { checkWordCount } from "./checkWordCount";
import { getBusinessName } from "./name/getBusinessName.api";
import { updateBusinessName } from "./name/updateBusinessName.api";
import { updateWordCount } from "./updateWordCount";
import {
  updateDescriptions,
  getDescriptions,
} from "./description/DescriptionService";
import { getFormDataByName } from "./formDetails";
import { saveSelectedTemplate } from "./desgin/saveSelectedtemplate";
import { updateFormDetail } from "./updateFormDetail";

export {
  fetchWpToken,
  checkSiteCount,
  getUserDetails,
  sendTokenAndEmailToBackend,
  updateCategoryDetails,
  checkWordCount,
  getBusinessName,
  updateBusinessName,
  updateWordCount,
  getDescriptions,
  updateDescriptions,
  getFormDataByName,
  saveSelectedTemplate,
  updateFormDetail,
};
export {
  checkImageCount,
  deletePage,
  deleteStyle,
  savePagesToDB,
} from "./final-preview";
