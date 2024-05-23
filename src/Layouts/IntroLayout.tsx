import Header from "../global component/Header";
import Sidebar from "../global component/Sidebar";

function IntroLayout({ children }) {
  return (
    <div className="h-screen">
      <Header active={true} />

      <main className="h-[90vh]">{children}</main>
    </div>
  );
}

export default IntroLayout;
