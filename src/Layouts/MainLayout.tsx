import Header from "../global component/Header";
import Sidebar from "../global component/Sidebar";

function MainLayout({ children }) {
  return (
    <div className="h-screen flex">
      <div className="z-0">
        {" "}
        <aside className="z-10 ">
          <Sidebar />
        </aside>
      </div>
      <div className="w-full">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
