import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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
import ContinuePopup from "./ui/component/ContinuePopup.tsx";
import useFetchContentData from "./hooks/useFetchContentData";
import useStoreContent from "./hooks/useStoreContent .ts";
import { useDispatch } from "react-redux";
import { clearUserData } from "./Slice/activeStepSlice.ts";
import CloseIcon from "./ui/global component/CloseIcon.tsx";
import useDomainEndpoint from "./hooks/useDomainEndpoint.ts";

const App = () => {
  const navigate = useNavigate();
  const fetchContentData = useFetchContentData();
  const [showPopup, setShowPopup] = useState(false);
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [hasRedirected, setHasRedirected] = useState(false); // To prevent repeated redirects
  const updateContent = useStoreContent();
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchContentData();
        setFetchedData(data);
        console.log("data from initial API:", data);

        if (data && !hasRedirected) {
          // Redirection logic based on the response values
          if (!data.category) {
            navigate("/category");
          } else if (!data.businessName) {
            navigate("/name");
          } else if (!data.description1 && !data.description2) {
            navigate("/description");
          } else if (data.description1 || data.description2) {
            if (!data.templatename) {
              navigate("/design");
            } else if (data.templateList) {
              navigate("/custom-design");
            } else if (data.color || data.font || data.logo) {
              navigate("/final-preview");
            }
          }
          setShowPopup(true);
          setHasRedirected(true); // Mark as redirected to prevent further redirects
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    getData();
  }, [fetchContentData, navigate, hasRedirected]);

  const { getDomainFromEndpoint } = useDomainEndpoint();

  const handleContinue = () => {
    if (!fetchedData) return;

    // if (fetchedData.category && !fetchedData.businessName) {
    //   navigate("/name");
    // } else if (fetchedData.description1 || fetchedData.description2) {
    //   navigate("/description");
    // } else if (fetchedData.templateid || fetchedData.templatename) {
    //   navigate("/custom-design");
    // } else if (
    //   fetchedData.category &&
    //   fetchedData.businessName &&
    //   fetchedData.description1 &&
    //   fetchedData.description2 &&
    //   !fetchedData.templatename
    // ) {
    //   navigate("/design");
    // } else if (fetchedData.content) {
    //   navigate("/final-preview");
    // } else {
    //   navigate("/category");
    // }
    setShowPopup(false);
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
    // await updateContent({
    //   businessName: "",
    //   description1: "",
    //   description2: "",
    //   images: [],
    //   templateid: 0,
    //   templatename: "",
    //   logo: "",
    //   category: "",
    //   content: [],
    //   color: { header: "", footer: "" },
    //   font: "",
    //   templateList: [],
    // });
    emptyTable("/wp-json/custom/v1/empty-tables", {});
    dispatch(clearUserData());
    navigate("/category");
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
