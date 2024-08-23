import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MainLayout from "../../Layouts/MainLayout";
import { useState, useEffect } from "react";
import Sparkle from "../../../assets/sparkle.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  setDescriptionOne,
  setDescriptionTwo,
} from "../../../Slice/activeStepSlice";
import { fetchDescriptionStream } from "../../../infrastructure/api/description.api";

function Description() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const businessName = useSelector(
    (state: RootState) => state.userData.businessName
  );
  const category = useSelector((state: RootState) => state.userData.category);
  const initialDescription1 = useSelector(
    (state: RootState) => state.userData.description1
  );
  const initialDescription2 = useSelector(
    (state: RootState) => state.userData.description2
  );

  const [description1, setDescription1] = useState<string>(
    initialDescription1 || ""
  );
  const [description2, setDescription2] = useState<string>(
    initialDescription2 || ""
  );
  const [loader1, setLoader1] = useState<boolean>(false); // Loader for Description 1
  const [loader2, setLoader2] = useState<boolean>(false); // Loader for Description 2
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDescription1(initialDescription1 || "");
    setDescription2(initialDescription2 || "");
  }, [initialDescription1, initialDescription2]);

  const handleAIWrite = async (type: 1 | 2) => {
    if (type === 2 && !description1) {
      setError("Description 1 is required before generating Description 2.");
      return;
    }
    if (type === 1) {
      setLoader1(true);
      setLoader2(false);
    } else {
      setLoader2(true);
      setLoader1(false);
    }
    setError(null);

    try {
      const reader = await fetchDescriptionStream(
        businessName,
        category,
        type,
        type === 2 ? description1 : undefined
      );

      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop()!;

        for (const line of lines) {
          if (line.trim()) {
            try {
              const json = JSON.parse(line.replace(/^data: /, ""));
              const deltaContent = json.choices[0]?.delta?.content || "";

              if (type === 1) {
                setDescription1((prev) => {
                  const newDescription = prev + deltaContent;
                  dispatch(setDescriptionOne(newDescription));
                  return newDescription;
                });
              } else {
                setDescription2((prev) => {
                  const newDescription = prev + deltaContent;
                  dispatch(setDescriptionTwo(newDescription));
                  return newDescription;
                });
              }
            } catch (err) {
              console.error("Error parsing JSON:", err);
            }
          }
        }
      }
      setLoader1(false);
      setLoader2(false);
    } catch (error) {
      console.error("Error fetching streaming data:", error);
      setLoader1(false);
      setLoader2(false);
    }
  };

  const setReduxValue = () => {
    if (!description1 || !description2) {
      setError("Both descriptions are required.");
    } else {
      dispatch(setDescriptionOne(description1));
      dispatch(setDescriptionTwo(description2));
      navigate("/image");
    }
  };

  return (
    <MainLayout>
      <div className="bg-[rgba(249, 252, 255, 1)] flex font-['inter']">
        <div className="p-8">
          <div className="mt-8 ml-[50px] flex flex-col">
            <h1 className="text-txt-black-600 leading-5 font-semibold text-3xl font-[inter] mb-4">
              What is {businessName}? Tell us more about the {businessName}.
            </h1>
            <span className="mt-4 text-lg leading-6 text-txt-secondary-400">
              Please be as descriptive as you can. Share details such as a brief
              <br />
              about the {businessName}, specialty, menu, etc.
            </span>
          </div>
          <div className="mt-8">
            <form>
              <div className="flex gap-1 items-center ml-[20px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                >
                  <circle
                    cx="13"
                    cy="13"
                    r="13"
                    fill="#DBE9FF"
                    fill-opacity="0.6"
                  />
                  <path
                    d="M12.1607 18V9.761L10.2707 10.916V9.054L12.1607 7.92H13.8827V18H12.1607Z"
                    fill="#2E42FF"
                  />
                </svg>
                <label className="leading-5 font-semibold text-lg">
                  What do you offer/sell? or what services do you provide?
                </label>
              </div>
              <textarea
                className={`bg-white p-4 border h-[100px]  border-[rgba(205, 212, 219, 1)]  w-[720px] mt-4 ${
                  error && "border-red-500 rounded-lg"
                } focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500 ml-[50px]`}
                value={description1}
                onChange={(e) => {
                  const newDescription = e.target.value;
                  setDescription1(newDescription);
                  dispatch(setDescriptionOne(newDescription));
                  if (error) setError(null);
                }}
              />
              <div className="mt-2 flex items-center gap-2 text-app-secondary hover:text-app-accent-hover cursor-pointer ml-[50px]">
                <div className="flex justify-between w-full">
                  <div
                    className="flex gap-2  text-palatinate-blue-600 hover:text-palatinate-blue-800 "
                    onClick={() => handleAIWrite(1)}
                  >
                    <img src="https://tours.mywpsite.org/wp-content/uploads/2024/08/sparkle.svg" />
                    <span className="font-semibold text-sm transition duration-150 ease-in-out">
                      Write Using AI
                    </span>
                    {loader1 && (
                      <button type="button" className=" " disabled>
                        <svg
                          className="text-palatinate-blue-600 animate-spin"
                          viewBox="0 0 64 64"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                        >
                          <path
                            d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                            stroke="currentColor"
                            stroke-width="5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6648 59.9313 22.9614 60.6315 27.4996"
                            stroke="#E5E7EB"
                            stroke-width="5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-1 items-center mt-6 ml-[20px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                >
                  <circle
                    cx="13"
                    cy="13"
                    r="13"
                    fill="#DBE9FF"
                    fill-opacity="0.6"
                  />
                  <path
                    d="M9.03008 17.986V16.516L13.3421 12.673C13.6781 12.3743 13.9114 12.092 14.0421 11.826C14.1727 11.56 14.2381 11.3033 14.2381 11.056C14.2381 10.72 14.1657 10.4213 14.0211 10.16C13.8764 9.894 13.6757 9.684 13.4191 9.53C13.1671 9.376 12.8754 9.299 12.5441 9.299C12.1941 9.299 11.8837 9.38067 11.6131 9.544C11.3471 9.70267 11.1394 9.915 10.9901 10.181C10.8407 10.447 10.7707 10.734 10.7801 11.042H9.04408C9.04408 10.37 9.19341 9.78433 9.49208 9.285C9.79541 8.78567 10.2107 8.39833 10.7381 8.123C11.2701 7.84767 11.8837 7.71 12.5791 7.71C13.2231 7.71 13.8017 7.85467 14.3151 8.144C14.8284 8.42867 15.2321 8.82533 15.5261 9.334C15.8201 9.838 15.9671 10.419 15.9671 11.077C15.9671 11.5577 15.9017 11.9613 15.7711 12.288C15.6404 12.6147 15.4444 12.9157 15.1831 13.191C14.9264 13.4663 14.6067 13.772 14.2241 14.108L11.1651 16.817L11.0111 16.397H15.9671V17.986H9.03008Z"
                    fill="#2E42FF"
                  />
                </svg>
                <label className="leading-5 font-semibold text-lg">
                  What steps do customers need to take to start working with the
                  business?
                  <br /> What actions do visitors need to take to work with you?
                </label>
              </div>
              <textarea
                className={`bg-white p-4 border h-[100px] border-[rgba(205, 212, 219, 1)] w-[720px]  scroll- mt-4 ${
                  error && "border-red-500 rounded-lg"
                } focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500 ml-[50px]`}
                value={description2}
                onChange={(e) => {
                  const newDescription = e.target.value;
                  setDescription2(newDescription);
                  dispatch(setDescriptionTwo(newDescription));
                  if (error) setError(null);
                }}
              />
              <div className="mt-2 flex items-center gap-2 text-app-secondary hover:text-app-accent-hover cursor-pointer ml-[50px]">
                <div className="flex justify-between w-full">
                  <div
                    className="flex gap-2  text-palatinate-blue-600 hover:text-palatinate-blue-800 "
                    onClick={() => handleAIWrite(2)}
                  >
                    <img src="https://tours.mywpsite.org/wp-content/uploads/2024/08/sparkle.svg" />
                    <span className="font-semibold text-sm transition duration-150 ease-in-out">
                      Write Using AI
                    </span>
                    {loader2 && (
                      <button type="button" className=" " disabled>
                        <svg
                          className="text-palatinate-blue-600 animate-spin"
                          viewBox="0 0 64 64"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                        >
                          <path
                            d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                            stroke="currentColor"
                            stroke-width="5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6648 59.9313 22.9614 60.6315 27.4996"
                            stroke="#E5E7EB"
                            stroke-width="5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {error && (
                <div className="text-red-500 font-semibold mt-4 ml-[50px]">
                  {error}
                </div>
              )}
            </form>
            <div className="flex gap-4 ml-[50px] mt-2">
              <Link to="/name">
                <button className="previous-btn flex px-[10px] py-[13px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-lg w-[150px] gap-3 justify-center">
                  <ArrowBackIcon />
                  Back
                </button>
              </Link>
              <button
                onClick={setReduxValue}
                className="tertiary px-[30px] py-[10px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-md w-[150px]"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Description;
