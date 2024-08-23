import React from "react";
import MainLayout from "../../Layouts/MainLayout";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
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
      <div className="items-center justify-center bg-[#F9FAFB] bg-opacity-90 flex h-[90vh] relative">
        <div className="bg-white rounded-lg shadow-lg text-center p-8 max-w-lg mx-auto">
          <div className="flex justify-center items-center mb-6">
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
          <div className="bg-gray-100 rounded-lg p-4 mt-6">
            <p className="text-left text-gray-700 mb-2">
              🚀🧑‍💻 I embarked on my website creation journey today and guess
              what? It's already 70% done! 🎉🇺🇸 Thanks to the incredible
              @GravityWrite Ai builder, my ideas transformed into a breathtaking
              website in just seconds! All it took was a chat about my vision,
              and voilà - magic happened. 🎉🛠️
            </p>
            <p className="text-left text-gray-500">
              #AI #WebsiteBuilder #Wordpress #Innovation
            </p>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {isConfettiActive && (
            <div className="confetti-container">
              <Confetti width={width} height={height} gravity={0.1} />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Success;
