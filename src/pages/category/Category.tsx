import Autocomplete, {
  AutocompleteChangeReason,
  AutocompleteChangeDetails,
} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import MainLayout from "../../Layouts/MainLayout";
import { CategoryList } from "../../types/Category.type";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../Slice/activeStepSlice";
import { useNavigate } from "react-router-dom";
import { fetchCategoryList } from "../../infrastructure/api/categorylist.api";
import { RootState } from "../../store/store";

function Category() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedCategory = useSelector(
    (state: RootState) => state.userData.category
  );
  const [categoryList, setCategoryList] = useState<CategoryList[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCategoryList = async () => {
      try {
        const categories = await fetchCategoryList();
        setCategoryList(categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError("Failed to load categories. Please try again later.");
      }
    };

    getCategoryList();
  }, []);

  const handleCategoryChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: string | null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _reason: AutocompleteChangeReason,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _details?: AutocompleteChangeDetails<string>
  ) => {
    if (value) {
      dispatch(setCategory(value));
      setError(null);
    } else {
      dispatch(setCategory(null));
    }
  };

  const handleClick = () => {
    if (selectedCategory) {
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
              value={selectedCategory}
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
