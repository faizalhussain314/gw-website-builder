import Autocomplete, {
  AutocompleteChangeReason,
  AutocompleteChangeDetails,
} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import MainLayout from "../../Layouts/MainLayout";
import { CategoryList } from "../../types/Category.type";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCategory } from "../../Slice/activeStepSlice";
import { useNavigate } from "react-router-dom";

function Category() {
  const [_selectedCategory, setSelectedCategory] = useState<string | null>("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categoryList: CategoryList[] = [
    { id: 1, name: "restaurant" },
    { id: 2, name: "cafe" },
    { id: 3, name: "bakery" },
    { id: 4, name: "bar" },
    { id: 5, name: "grocery store" },
    { id: 6, name: "supermarket" },
    { id: 7, name: "bookstore" },
    { id: 8, name: "clothing store" },
    { id: 9, name: "electronics store" },
    { id: 10, name: "furniture store" },
    { id: 11, name: "gym" },
    { id: 12, name: "pharmacy" },
    { id: 13, name: "hair salon" },
    { id: 14, name: "nail salon" },
    { id: 15, name: "barber shop" },
    { id: 16, name: "movie theater" },
    { id: 17, name: "museum" },
    { id: 18, name: "park" },
    { id: 19, name: "zoo" },
    { id: 20, name: "library" },
  ];

  const handleCategoryChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<string>
  ) => {
    console.log("Event:", event);
    console.log("Value:", value);
    console.log("Reason:", reason);
    console.log("Details:", details);
    setSelectedCategory(value);
    dispatch(setCategory(value));
    if (value) {
      setError(null);
    }
  };

  const handleClick = () => {
    if (_selectedCategory) {
      navigate("/name");
    } else {
      setError("Please select a category before continuing.");
    }
  };

  return (
    <MainLayout>
      <div className="bg-[rgba(249, 252, 255, 1)] flex font-['inter']">
        <div className="p-8">
          <div className="mt-8 ml-[50px] ">
            <h1 className="text-txt-black-600 leading-5 font-semibold text-3xl font-[inter] mb-4">
              I am creating a website for
            </h1>
            <span className="mt-4 text-lg leading-6 text-txt-secondary-400">
              Let’s get started by choosing the type of website you’d like to
              create
            </span>
            <Autocomplete
              id="free-solo-demo"
              freeSolo
              options={categoryList.map((option) => option.name)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  error={!!error}
                  helperText={error}
                />
              )}
              onChange={handleCategoryChange}
              className="bg-white rounded-md w-[720px] mt-4"
              aria-required="true"
            />
            <button
              onClick={handleClick}
              type="submit"
              className="tertiary px-[30px] py-[15px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-lg"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Category;
