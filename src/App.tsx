import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Welcome from "./ui/pages/welcome/Welcome.tsx";
import ConnectAccount from "./ui/pages/connectAccount/ConnectAccount.tsx";
import Test from "./test/Test.tsx";
import Sidebar from "./ui/global component/Sidebar.tsx";
import Category from "./ui/pages/category/Category.tsx";
import Name from "./ui/pages/name/Name.tsx";
import Description from "./ui/pages/description/Description.tsx";
import Images from "./ui/pages/image/Images.tsx";
import Contact from "./ui/pages/contact/Contact.tsx";
import Design from "./ui/pages/design/Design.tsx";
import ProcessingScreen from "./ui/pages/processingScreen/ProcessingScreen.tsx";
import FinalPreview from "./ui/pages/finalpreview/FinalPreview.tsx";
import CustomDesign from "./ui/pages/customdesign/CustomDesign.tsx";
import Success from "./ui/pages/successPage/Success.tsx";
import ContinuePopup from "./ui/component/dialogs/ContinuePopup.tsx";
import useFetchContentData from "./hooks/useFetchContentData";
import useStoreContent from "./hooks/useStoreContent .ts";
import { useDispatch } from "react-redux";
import {
  clearUserData,
  setFormDetailsLoaded,
} from "./Slice/activeStepSlice.ts";
import CloseIcon from "./ui/global component/CloseIcon.tsx";
import useDomainEndpoint from "./hooks/useDomainEndpoint.ts";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fetchContentData = useFetchContentData();
  const [showPopup, setShowPopup] = useState(false);
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [firstLoad, setFirstLoad] = useState(false); // To handle first load scenario
  const updateContent = useStoreContent();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("path name ", location.pathname);
    if (location.pathname == "/" && firstLoad) {
      // Show the popup only on the /welcome route and after the first load
      setShowPopup(true);
      console.log("path name ", location.pathname);
    }
  }, [location.pathname, firstLoad]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchContentData();
        dispatch(setFormDetailsLoaded(true));
        setFetchedData(data);
        console.log("data from initial API:", data);
        setFirstLoad(false); // Mark as not the first load after fetching the data
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    getData();
  }, [fetchContentData]);

  const { getDomainFromEndpoint } = useDomainEndpoint();

  const handleContinue = () => {
    if (!fetchedData) return;

    // Handle navigation based on the fetched data
    if (!fetchedData.category) {
      navigate("/category");
    } else if (!fetchedData.businessName) {
      navigate("/name");
    } else if (!fetchedData.description1 && !fetchedData.description2) {
      navigate("/description");
    } else if (fetchedData.description1 || fetchedData.description2) {
      if (!fetchedData.templatename) {
        navigate("/design");
      } else if (fetchedData.templateList) {
        navigate("/custom-design");
      } else if (fetchedData.color || fetchedData.font || fetchedData.logo) {
        navigate("/final-preview");
      }
    }
    setShowPopup(false); // Hide the popup after user clicks Continue
  };

  const emptyTable = async (endpoint: string, data: object) => {
    const url = getDomainFromEndpoint(endpoint);
    if (!url) return null;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error(`Error posting data to ${url}:`, error);
      return null;
    }
  };

  const handleCreateFromScratch = async () => {
    // Empty user data and redirect to category page
    emptyTable("/wp-json/custom/v1/empty-tables", {});
    dispatch(clearUserData());
    navigate("/category");
    setShowPopup(false);
  };

  return (
    <div className="relative">
      {showPopup && location.pathname === "/welcome" && !firstLoad && (
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

      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/connect-account" element={<ConnectAccount />} />
        <Route path="/test" element={<Test />} />
        <Route path="/side" element={<Sidebar />} />
        <Route path="/" element={<Welcome />} />
        <Route path="/category" element={<Category />} />
        <Route path="/name" element={<Name />} />
        <Route path="/description" element={<Description />} />
        <Route path="/image" element={<Images />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/design" element={<Design />} />
        <Route path="/processing" element={<ProcessingScreen />} />
        <Route path="/final-preview" element={<FinalPreview />} />
        <Route path="/custom-design" element={<CustomDesign />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </div>
  );
};

export default App;
