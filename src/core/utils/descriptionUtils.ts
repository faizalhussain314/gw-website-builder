export const getInputClass = (
  descriptionType: "des1" | "des2",
  description1Error: boolean,
  description2Error: boolean
) => {
  let base =
    "bg-white px-4 py-2.5 border h-[100px] border-[rgba(205,212,219,1)] w-[96%] mt-5 rounded-lg placeholder:font-normal text-[#5f5f5f] focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500 ml-[50px]";

  if (descriptionType === "des1" && description1Error) {
    base += " border-red-500";
  }

  if (descriptionType === "des2" && description2Error) {
    base += " border-red-500";
  }

  return base;
};

export const validateDescriptions = (
  description1: string,
  description2: string
) => {
  let errorMessage = "";
  let desc1Error = false;
  let desc2Error = false;

  if (!description1.trim() && !description2.trim()) {
    desc1Error = true;
    desc2Error = true;
    errorMessage = "Descriptions are required.";
  } else if (description1.trim() && !description2.trim()) {
    desc1Error = false;
    desc2Error = true;
    errorMessage = "Description is required.";
  } else if (!description1.trim() && description2.trim()) {
    desc1Error = true;
    desc2Error = false;
    errorMessage = "Description is required.";
  } else if (!description2.trim()) {
    desc2Error = true;
    errorMessage = "Description is required.";
  } else if (description1.length <= 25) {
    desc1Error = true;
    desc2Error = false;
    errorMessage = "Description must have atleast 25 characters ";
  } else if (description2.length <= 25) {
    desc2Error = true;
    desc1Error = false;
    errorMessage = "Description must have atleast 25 characters ";
  }

  return { errorMessage, desc1Error, desc2Error };
};
