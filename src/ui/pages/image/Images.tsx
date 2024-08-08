import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState, useEffect, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { RootState } from "../../../store/store"; // Adjust the import according to your store location
import { Keyword, Image } from "../../../types/Image.type";
import MainLayout from "../../Layouts/MainLayout";
import { addImage } from "../../../Slice/activeStepSlice"; // Adjust the import according to your slice location

function Images() {
  const dispatch = useDispatch();
  const category = useSelector((state: RootState) => state.userData.category);
  const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([{ keyword: category }]);
  const [images, setImages] = useState<Image[]>([]);

  const fetchImages = async (keyword: string) => {
    try {
      const response = await axios.get("https://api.pexels.com/v1/search", {
        params: { query: keyword, per_page: 16 },
        headers: {
          Authorization:
            "nWeTc6fhESNX19X80CrPqDuP6zGGDrJelkvQpje9A0HjdnFtjRRXvn8D",
        },
      });
      setImages(
        response.data.photos.map(
          (photo: { id: number; src: { landscape: string } }) => ({
            id: photo.id,
            imagelink: photo.src.landscape,
          })
        )
      );
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages(category);
  }, [category]);

  const handleImageClick = (id: number, imagelink: string) => {
    setSelectedImageIds((prevSelectedImageIds) =>
      prevSelectedImageIds.includes(id)
        ? prevSelectedImageIds.filter((imageId) => imageId !== id)
        : [...prevSelectedImageIds, id]
    );

    dispatch(
      addImage({
        url: imagelink,
        description: "", // Add a description if needed
      })
    );
  };

  const handleInputChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const newKeywords = [...keywords];
      newKeywords[index] = { keyword: event.target.value };
      setKeywords(newKeywords);
    };

  // const addKeyword = () => {
  //   setKeywords([...keywords, { keyword: "" }]);
  // };

  const handleSearch = () => {
    keywords.forEach((kw) => {
      fetchImages(kw.keyword);
    });
  };

  return (
    <MainLayout>
      <div className="bg-[rgba(249, 252, 255, 1)] flex font-['inter']">
        <div className="p-8">
          <div className="mt-8 ml-[50px] flex flex-col">
            <h1 className="text-txt-black-600 leading-5 font-semibold text-3xl font-[inter] mb-4">
              Select Images
            </h1>

            <form onSubmit={(e) => e.preventDefault()}>
              {keywords.map((kw, index) => (
                <input
                  key={index}
                  type="text"
                  value={kw.keyword}
                  onChange={handleInputChange(index)}
                  className="bg-white p-3 border border-[rgba(205, 212, 219, 1)] rounded-md w-[720px] mt-4 focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500"
                />
              ))}

              <button
                type="button"
                onClick={handleSearch}
                className="mt-4 bg-palatinate-blue-500 text-white px-3 py-1 rounded-md"
              >
                Search
              </button>
              <div className="flex gap-3 m-6 cursor-pointer">
                <span className="text-md leading-6 underline text-palatinate-blue-500 indent-px">
                  Search Result
                </span>
                <span className="text-md leading-6 indent-px">
                  Selected Images({selectedImageIds.length})
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4 overflow-auto max-h-[600px]">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className={`relative w-full h-40 rounded-md overflow-hidden cursor-pointer ${
                      selectedImageIds.includes(img.id)
                        ? "border-4 border-palatinate-blue-500"
                        : "border"
                    }`}
                    onClick={() => handleImageClick(img.id, img.imagelink)}
                  >
                    <img
                      src={img.imagelink}
                      className="w-full h-full object-cover"
                      alt="Selected"
                    />
                    {selectedImageIds.includes(img.id) && (
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
            </form>
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 left-0 pb-8 bg-app-light-background  px-8 pb-4 lg:px-16 xl:px-36 z-30 bg-[#F9FCFF] w-full flex justify-between">
        <div className="flex gap-4">
          <Link to={"/description"}>
            <button className="previous-btn flex px-[10px] py-[13px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-md w-[150px] gap-3 justify-center">
              <ArrowBackIcon />
              Previous
            </button>
          </Link>
          <Link to={"/contact"}>
            <button className="tertiary px-[30px] py-[10px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-md w-[150px]">
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
    </MainLayout>
  );
}

export default Images;
