import ReactDOM from "react-dom/client";
import "./index.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/welcome/Welcome.tsx";
import ConnectAccount from "./pages/connectAccount/ConnectAccount.tsx";
import Test from "./test/Test.tsx";
import Sidebar from "./global component/Sidebar.tsx";
import Category from "./pages/category/Category.tsx";
import Name from "./pages/name/Name.tsx";
import Description from "./pages/description/Description.tsx";
import Images from "./pages/image/Images.tsx";
import Contact from "./pages/contact/Contact.tsx";
import Design from "./pages/design/Design.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import ProcessingScreen from "./pages/design/ProcessingScreen.tsx";
import FinalPreview from "./pages/finalpreview/FinalPreview.tsx";
import CustomDesign from "./pages/customdesign/CustomDesign.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Router>
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
      </Routes>
    </Router>
  </Provider>
);
