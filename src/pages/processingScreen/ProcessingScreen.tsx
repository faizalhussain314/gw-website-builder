import MainLayout from "../../Layouts/MainLayout";
import LoaderBg from "../../assets/loaderbg.svg";
import Loadingimg from "../../assets/Loaderimage.svg";

function ProcessingScreen() {
  return (
    <MainLayout>
      <div className="flex items-center justify-center h-[90vh]">
        <div
          className={` bg-center bg-no-repeat  h-96 w-full`}
          style={{ backgroundImage: `url(${LoaderBg})` }}
        >
          <div className="flex  items-center justify-center h-full ">
            <img src={Loadingimg} className="spining-animation w-24" />
          </div>
          <div className="flex justify-center items-center flex-col mt-4">
            <h3 className="text-xl leading-7">
              We are building your website...
            </h3>

            <p className="text-lg leading-6 items-center text-txt-secondary-400">
              Your website is ready!
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ProcessingScreen;
