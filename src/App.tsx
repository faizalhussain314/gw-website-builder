import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import ContinuePopup from "./ui/component/dialogs/ContinuePopup";
import useFetchContentData from "./hooks/useFetchContentData";
import useSessionHandler from "./hooks/useSessionHandler";
import useLastStepUpdate from "./hooks/useLastStepUpdate";
import { clearUserData, setlastStep } from "./Slice/activeStepSlice";
import AppRoutes from "./routes/AppRoutes";
import CloseIcon from "./ui/global component/CloseIcon";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isSessionActive, setSessionActive } = useSessionHandler();
  const { updateLastStep } = useLastStepUpdate();

  const [showPopup, setShowPopup] = useState(false);
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isRefresh, setIsRefresh] = useState(false);

  const { fetchContent, emptyTable } = useFetchContentData();

  useEffect(() => {
    if (performance.navigation.type === 1) {
      setIsRefresh(true);
    }
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchContent();
        setFetchedData(data);

        const hasData =
          data?.category || data?.bussinessName || data?.description1;
        console.log("hasData", hasData);

        if (
          hasData &&
          !isSessionActive &&
          !isRefresh &&
          location.pathname === "/"
        ) {
          console.log("hasData", hasData);
          setShowPopup(true);
        }

        if (data?.lastStep) {
          dispatch(setlastStep(data.lastStep));
          return;
        }

        setSessionActive();
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setFirstLoad(false);
      }
    };

    if (firstLoad) {
      getData();
    }
  }, [
    fetchContent,
    dispatch,
    firstLoad,
    isSessionActive,
    isRefresh,
    setSessionActive,
  ]);

  useEffect(() => {
    if (!firstLoad) {
      updateLastStep(location.pathname);
    }
  }, [location.pathname, firstLoad, updateLastStep]);

  const handleContinue = () => {
    if (!fetchedData?.lastStep) return;
    navigate(fetchedData.lastStep);
    setSessionActive();
    setShowPopup(false);
  };

  const handleCreateFromScratch = async () => {
    dispatch(clearUserData());
    await emptyTable("/wp-json/custom/v1/empty-tables", {});
    navigate("/category");
    setSessionActive();
    setShowPopup(false);
  };

  return (
    <div className="relative">
      {showPopup && (
        <ContinuePopup
          onClose={() => setShowPopup(false)}
          alertType="websiteCreation"
          onContinue={handleContinue}
          onCreateFromScratch={handleCreateFromScratch}
        />
      )}
      <div className="absolute right-4 top-4 z-50">
        <CloseIcon />
      </div>
      <AppRoutes />
    </div>
  );
};

export default App;
