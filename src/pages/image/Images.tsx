import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { Keyword, Image } from "../../types/Image.type";
import MainLayout from "../../Layouts/MainLayout";

function Images() {
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [keywords, setKeywords] = useState<Keyword[]>([
    { keyword: "restaurant" },
  ]);

  const image: Image[] = [
    {
      id: 1,
      imagelink:
        "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg",
    },
    {
      id: 2,
      imagelink:
        "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      id: 3,
      imagelink:
        "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      id: 4,
      imagelink:
        "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
  ];

  const handleImageClick = (id: number) => {
    setSelectedImageId(id);
  };

  const handleInputChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newKeywords = [...keywords];
      newKeywords[index] = { keyword: event.target.value };
      setKeywords(newKeywords);
    };

  return (
    <MainLayout>
      <div className="bg-[rgba(249, 252, 255, 1)] flex font-['inter']">
        <div className="p-8">
          <div className="mt-8 ml-[50px] flex flex-col">
            <h1 className="text-txt-black-600 leading-5 font-semibold text-3xl font-[inter] mb-4">
              Select Images
            </h1>

            <form>
              {keywords.map((kw, index) => (
                <input
                  key={index}
                  type="text"
                  value={kw.keyword}
                  onChange={handleInputChange(index)}
                  className="bg-white p-3 border border-[rgba(205, 212, 219, 1)] rounded-md w-[720px] mt-4 focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500"
                />
              ))}
              <div className="flex gap-3 m-6 cursor-pointer">
                <span className="text-md leading-6 underline text-palatinate-blue-500 indent-px">
                  Search Result
                </span>
                <span className="text-md leading-6 indent-px">
                  Selected Images(10)
                </span>
              </div>
              <div className="flex gap-4 overflow-y-auto">
                {image.map((img) => (
                  <div
                    key={img.id}
                    className={`relative w-52 rounded-md overflow-hidden cursor-pointer ${
                      selectedImageId === img.id
                        ? "border-4 border-palatinate-blue-500"
                        : "border"
                    }`}
                    onClick={() => handleImageClick(img.id)}
                  >
                    <img
                      src={img.imagelink}
                      className="w-full h-full object-cover"
                      alt="Selected"
                    />
                    {selectedImageId === img.id && (
                      <div className="absolute top-0 right-0 m-2 bg-palatinate-blue-500 rounded-full p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <div className="flex  gap-4">
                  {" "}
                  <Link to={"/description"}>
                    <button className=" previous-btn flex px-[10px] py-[13px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-md w-[150px] gap-3 justify-center">
                      <ArrowBackIcon />
                      Previous
                    </button>
                  </Link>
                  <Link to={"/contact"}>
                    <button className=" tertiary px-[30px] py-[10px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-md w-[150px] ">
                      Continue
                    </button>
                  </Link>
                </div>
                <div className="mt-8 cursor-pointer flex items-center">
                  <Link to={"/contact"}>
                    <span className="text-base text-[#6C777D] leading-5">
                      Skip This Step
                    </span>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Images;
