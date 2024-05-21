import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Header from "./global component/Header.tsx";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/welcome/Welcome.tsx";
import ConnectAccount from "./pages/connectAccount/ConnectAccount.tsx";
import Test from "./test/Test.tsx";
import Sidebar from "./global component/Sidebar.tsx";
import Category from "./pages/category/Category.tsx";
import Name from "./pages/name/Name.tsx";
import Description from "./pages/description/Description.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Header />
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
      </Routes>
    </Router>
  </React.StrictMode>
);
