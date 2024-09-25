import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState, useEffect, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { RootState } from "../../../store/store"; // Adjust the import according to your store location
import { Keyword, Image } from "../../../types/Image.type";
import MainLayout from "../../Layouts/MainLayout";
// import { addImage } from "../../../Slice/activeStepSlice"; // Adjust the import according to your slice location

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

    // dispatch(
    //   addImage({
    //     url: imagelink,
    //     description: "", // Add a description if needed
    //   })
    // );
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
      <div className="p-10 pb-0 bg-[#F9FCFF] h-full flex flex-col justify-between overflow-hidden">
        <div className="h-full overflow-y-auto no-scrollbar">
          <h1 className="text-txt-black-600 font-semibold text-3xl mb-6">
            Select Images
          </h1>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col">
            <div className="flex items-center gap-x-2">
              {keywords.map((kw, index) => (
                <input
                  key={index}
                  type="text"
                  value={kw.keyword}
                  onChange={handleInputChange(index)}
                  className="bg-white px-4 py-2.5 border border-[rgba(205, 212, 219, 1)] rounded-lg w-full focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500"
                />
              ))}

              <button
                type="button"
                onClick={handleSearch}
                className="bg-palatinate-blue-600 px-[30px] py-[10px] text-lg sm:text-sm text-white rounded-md w-[150px]"
              >
                Search
              </button>
            </div>
            <div className="flex gap-5 mt-8 mb-6 items-center">
              <span className="text-base cursor-pointer text-palatinate-blue-600 py-1.5 border-b border-palatinate-blue-600">
                Search Result
              </span>
              <span className="text-base py-1.5 cursor-pointer">
                Selected Images({selectedImageIds.length})
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4 max-h-full p-1">
              {images.map((img) => (
                <div
                  key={img.id}
                  className={`relative w-full h-40 rounded-md overflow-hidden cursor-pointer ${
                    selectedImageIds.includes(img.id)
                      ? "ring ring-palatinate-blue-600"
                      : "border"
                  }`}
                  onClick={() => handleImageClick(img.id, img.imagelink)}
                >
                  <img
                    src={img.imagelink}
                    className="object-cover w-full h-full"
                    alt="Selected"
                  />
                  {selectedImageIds.includes(img.id) && (
                    <div className="absolute top-0 right-0 p-1 m-2 rounded-full bg-palatinate-blue-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-white"
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
        <div className="flex justify-between items-center pt-10 pb-6 mt-auto">
          <div className="flex gap-4 items-center">
            <Link to={"/description"}>
              <button className="previous-btn flex px-[10px] py-[13px] text-base text-white sm:mt-2 font-medium rounded-md w-[150px] gap-3 justify-center">
                <ArrowBackIcon fontSize="small" />
                Previous
              </button>
            </Link>
            <Link to={"/contact"}>
              <button className="tertiary px-[30px] py-[10px] text-base text-white sm:mt-2 rounded-md w-[150px] font-medium">
                Continue
              </button>
            </Link>
          </div>
          <div className="cursor-pointer">
            <Link to={"/contact"}>
              <span className="text-base text-[#6C777D] hover:text-palatinate-blue-600">
                Skip Step
              </span>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Images;
