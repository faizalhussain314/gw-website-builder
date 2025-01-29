import React from "react";
import { Routes, Route } from "react-router-dom";

import Welcome from "../ui/pages/welcome/Welcome";
import ConnectAccount from "../ui/pages/connectAccount/ConnectAccount";
import Category from "../ui/pages/category/Category";
import Name from "../ui/pages/name/Name";
import Description from "../ui/pages/description/Description";
import Images from "../ui/pages/image/Images";
import Contact from "../ui/pages/contact/Contact";
import Design from "../ui/pages/design/Design";
import ProcessingScreen from "../ui/pages/processingScreen/ProcessingScreen";
import FinalPreview from "../ui/pages/finalpreview/FinalPreview";
import CustomDesign from "../ui/pages/customdesign/CustomDesign";
import Success from "../ui/pages/successPage/Success";
import Test from "../test/Test";

const AppRoutes = () => (
  <Routes>
    <Route path="/welcome" element={<Welcome />} />
    <Route path="/connect-account" element={<ConnectAccount />} />
    <Route path="/test" element={<Test />} />
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
);

export default AppRoutes;
