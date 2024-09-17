import React, { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../Layouts/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { setBusinessName } from "../../../Slice/activeStepSlice";
import { RootState } from "../../../store/store";
import useDomainEndpoint from "../../../hooks/useDomainEndpoint";
import { getBusinessName } from "../../../infrastructure/api/wordpress-api/name/getBusinessName.api";
import { updateBusinessName } from "../../../infrastructure/api/wordpress-api/name/updateBusinessName.api";

function Name() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getDomainFromEndpoint } = useDomainEndpoint();

  const category = useSelector((state: RootState) => state.userData.category);
  const initialName = useSelector(
    (state: RootState) => state.userData.businessName
  );
  const [name, setName] = useState<string>(initialName || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialName = async () => {
      const content = await getBusinessName(getDomainFromEndpoint);
      if (content && content.businessName) {
        setName(content.businessName);
        dispatch(setBusinessName(content.businessName));
      }
    };

    fetchInitialName();
  }, [dispatch, getDomainFromEndpoint]);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    if (newName) {
      setError(null);
      await updateBusinessName(newName, getDomainFromEndpoint); // Store content on every change
      dispatch(setBusinessName(newName));
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

  const handlePrevious = () => {
    if (name) {
      dispatch(setBusinessName(name));
    }
    navigate("/category");
  };

  return (
    <MainLayout>
      <div className="bg-[rgba(249, 252, 255, 1)] flex font-['inter']">
        <div className="p-8">
          <div className="mt-8 ml-[50px] flex flex-col">
            <h1 className="text-txt-black-600 leading-5 font-semibold text-3xl font-[inter] mb-4">
              What is {category} name? Tell us more about the {category}.
            </h1>
            <span className="mt-4 text-lg leading-6 text-txt-secondary-400">
              Please be as descriptive as you can. Share details such as a brief
              about the {category}, specialty, menu, etc.
            </span>
            <form onSubmit={(e) => e.preventDefault()}>
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
                <button
                  onClick={handlePrevious}
                  className="previous-btn flex px-[10px] py-[13px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-md w-[150px] gap-3 justify-center"
                >
                  <ArrowBackIcon />
                  Previous
                </button>

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
