import React from "react";
import MainLayout from "../../Layouts/MainLayout";
import useWindowSize from "react-use/lib/useWindowSize";
// import ConfettiExplosion from "react-confetti-explosion";
import { useState, useEffect } from "react";

function Success() {
  const { width, height } = useWindowSize();
  const [isConfettiActive, setConfettiActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setConfettiActive(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleVisitWebsite = () => {
    const currentUrl = window.location.href;

    const domain = currentUrl.split("/wp-admin")[0];

    window.open(`${domain}`, "_blank");
    console.log("domain", domain);
  };

  return (
    <MainLayout>
      <div className="bg-[#F9FAFB] bg-opacity-90 flex items-center justify-center h-[90vh] relative">
        {/* {isConfettiActive && (
          <ConfettiExplosion
            force={0.8}
            duration={3000}
            particleCount={300}
            width={1200}
            className="absolute translate-x-1/2 translate-y-1/2 top-0 left-1/2"
          ></ConfettiExplosion>
        )} */}
        <div className="bg-white rounded-[10px] shadow-lg text-center p-10 max-w-[560px] mx-auto z-50">
          <div className="flex justify-center items-center mb-5">
            <span className="text-3xl">🎉</span>
            <span className="mx-2 text-3xl">🎊</span>
            <span className="text-3xl">🥳</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Woohoo, your website is ready!
          </h2>
          <p className="text-gray-600 mb-6">
            You did it! Your brand new website is all set to shine online.
          </p>
          <button
            className="tertiary w-full text-white px-6 py-3 rounded-lg text-lg font-semibold transition"
            onClick={handleVisitWebsite}
          >
            Visit your Website
          </button>
          <div className="bg-gray-100 rounded-[10px] p-6 mt-7">
            <p className="text-center text-[#656767] mb-4">
              🚀🧑‍💻 I embarked on my website creation journey today and guess
              what? It's already 70% done! 🎉🇺🇸 Thanks to the incredible
              @GravityWrite Ai builder, my ideas transformed into a breathtaking
              website in just seconds! All it took was a chat about my vision,
              and voilà - magic happened. 🎉🛠️
            </p>
            <p className="text-center text-[#656767]">
              #AI #WebsiteBuilder #Wordpress #Innovation
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Success;
