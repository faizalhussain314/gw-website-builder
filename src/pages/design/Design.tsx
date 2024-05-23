import MainLayout from "../../Layouts/MainLayout";

function Design() {
  return (
    <MainLayout>
      <div className="h-full w-full relative">
        <div className="w-full h-full flex flex-col items-center bg-app-light-background overflow-y-auto">
          <div className="mx-auto flex flex-col overflow-x-hidden w-full">
            <div className="space-y-5 px-5 md:px-10 lg:px-14 xl:px-15 pt-12">
              <h1 className="text-3xl font-semibold">
                Choose the structure for your website
              </h1>
              <p className="text-base font-normal leading-6 text-app-text text-txt-secondary-500">
                Select your preferred structure for your website from the
                options below.
              </p>
            </div>
            <form className="sticky -top-1.5 z-10 pt-4 pb-4 bg-zip-app-light-bg px-5 md:px-10 lg:px-14 xl:px-15">
              <div>
                <div className="flex relative items-center">
                  <div className="h-12 flex items-center mr-0">
                    <div className="absolute left-3 flex items-center">
                      <button className="w-auto h-auto p-0 flex items-center justify-center cursor-pointer bg-transparent border-0 focus:outline-none">
                        button
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Design;
