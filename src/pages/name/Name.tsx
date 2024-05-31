import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../Layouts/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setBusinessName } from "../../Slice/activeStepSlice";
import { RootState } from "../../store/store";

function Name() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const category = useSelector((state: RootState) => state.userData.category);
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: { target: { value: string } }) => {
    const newName = event.target.value;
    setName(newName);
    if (newName) {
      setError(null);
    }
  };

  const handleClick = () => {
    if (name) {
      dispatch(setBusinessName(name));
      navigate("/description");
    } else {
      setError("Please enter a business name.");
    }
  };

  return (
    <MainLayout>
      <div className="bg-[rgba(249, 252, 255, 1)] flex font-['inter']">
        <div className="p-8">
          <div className="mt-8 ml-[50px] flex flex-col">
            <h1 className="text-txt-black-600 leading-5 font-semibold text-3xl font-[inter] mb-4">
              What is abc {category}? Tell us more about the {category}.
            </h1>
            <span className="mt-4 text-lg leading-6 text-txt-secondary-400">
              Please be as descriptive as you can. Share details such as a brief
              about the restaurant, specialty, menu, etc.
            </span>
            <form>
              <input
                type="text"
                value={name}
                onChange={handleChange}
                className={`bg-white p-3 border ${
                  error ? "border-red-500" : "border-[rgba(205, 212, 219, 1)]"
                } rounded-md w-[720px] mt-4 focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500`}
              />
              {error && <div className="mt-2 text-red-600">{error}</div>}
              <div className="flex gap-4">
                <Link to={"/category"}>
                  <button className="previous-btn flex px-[10px] py-[13px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-md w-[150px] gap-3 justify-center">
                    <ArrowBackIcon />
                    Previous
                  </button>
                </Link>
                <button
                  type="button"
                  onClick={handleClick}
                  className="tertiary px-[30px] py-[10px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-md w-[150px]"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Name;
