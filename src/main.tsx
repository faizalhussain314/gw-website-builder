import ReactDOM from "react-dom/client";
import "./index.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
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
import { Provider } from "react-redux";
import store from "./store/store.ts";
import ProcessingScreen from "./ui/pages/design/ProcessingScreen.tsx";
import FinalPreview from "./ui/pages/finalpreview/FinalPreview.tsx";
import CustomDesign from "./ui/pages/customdesign/CustomDesign.tsx";
// import Success from "./pages/successpage/Success.tsx";
// import Login from "./pages/login/Login.tsx";
// import Signup from "./pages/signup/Signup.tsx";

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

        {/* <Route path="/success" element={<Success />} /> */}
        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}
      </Routes>
    </Router>
  </Provider>
);
