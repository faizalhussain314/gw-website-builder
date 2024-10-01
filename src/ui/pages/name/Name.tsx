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
      <div className="p-10 w-full h-full bg-[#F9FCFF]">
        <h1 className="text-txt-black-600 font-semibold tracking-[-0.9px] text-3xl mb-2.5">
          What is {category} name? Tell us more about the {category}.
        </h1>
        <span className="text-lg tracking-[-0.54px] font-normal text-txt-secondary-500">
          Please be as descriptive as you can. Share details such as a brief
          about the {category}, specialty, menu, etc.
        </span>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            value={name}
            onChange={handleChange}
            className={`bg-white px-4 py-2.5 border ${
              error ? "border-red-500" : "border-[rgba(205, 212, 219, 1)]"
            } rounded-md w-full mt-9 focus:border-palatinate-blue-500 active:border-palatinate-blue-500 active:outline-palatinate-blue-500 focus:outline-palatinate-blue-500 placeholder:text-[#1e2022] placeholder:font-normal`}
          />
          {error && <div className="mt-2 text-red-600">{error}</div>}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handlePrevious}
              className="previous-btn flex px-[30px] font-medium py-[15px] text-base sm:text-sm text-white rounded-lg gap-2.5 justify-center"
            >
              <ArrowBackIcon fontSize="small" />
              Previous
            </button>
            <button
              type="button"
              onClick={handleClick}
              className="tertiary px-[35px] font-medium py-[15px] text-base sm:text-sm text-white rounded-lg "
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

export default Name;
