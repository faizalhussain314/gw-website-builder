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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    if (newName) {
      setError(null);
    }
  };

  const handleClick = async () => {
    if (name) {
      try {
        await updateBusinessName(name, getDomainFromEndpoint);
        dispatch(setBusinessName(name));
        navigate("/description");
      } catch (error) {
        console.error("Failed to update business name:", error);
      }
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
      <div className="bg-[#F9FCFF] flex font-['inter']">
        <div className="p-[40px] w-full">
          <div className="flex flex-col">
            <h1 className="text-txt-black-600 font-semibold leading-[38px] tracking-[-0.9px] text-3xl mb-2.5">
              What is name of your {category} website?
            </h1>
            <span className="text-lg tracking-[-0.54px] font-normal leading-[26px] text-txt-secondary-500">
              Please be as descriptive as you can. Share details such as a brief
              about the {category}, specialty, menu, etc.
            </span>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                value={name}
                autoFocus
                onChange={handleChange}
                className={`bg-white px-[15px] py-[10px] border placeholder:text-[#A9B0B7] placeholder:!font-normal ${
                  error ? "border-red-500" : "border-[rgba(205, 212, 219, 1)]"
                } rounded-md w-full mt-[35px]  focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500 placeholder:text-[#1e2022] placeholder:font-normal`}
                placeholder={`Enter name of your ${category}`}
              />
              {error && <div className="mt-2 text-red-600">{error}</div>}
              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={handlePrevious}
                  className="previous-btn flex px-[30px] font-medium py-[15px] text-base sm:text-sm text-white sm:mt-2  rounded-lg  gap-2.5 justify-center"
                >
                  <ArrowBackIcon fontSize="small" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleClick}
                  className="tertiary px-[35px] font-medium py-[15px] text-base sm:text-sm text-white  sm:mt-2 rounded-lg "
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
