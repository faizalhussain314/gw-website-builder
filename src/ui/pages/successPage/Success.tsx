import React, { useEffect, useRef } from "react";
import MainLayout from "../../Layouts/MainLayout"; // Assuming MainLayout doesn't interfere

function Success() {
  const handleVisitWebsite = () => {
    const currentUrl = window.location.href;
    let domain = currentUrl.split("/wp-admin")[0];
    if (!domain || domain === currentUrl) {
      try {
        const urlObject = new URL(currentUrl);
        domain = `${urlObject.protocol}//${urlObject.host}`;
      } catch (e) {
        console.error(
          "[SUCCESS COMPONENT] Could not parse domain from URL for 'Visit Website' button:",
          e
        );
        domain = "#"; // Fallback
      }
    }
    window.open(domain, "_blank");
  };

  // Store the URL of this page when it mounts.
  const successPageUrlRef = useRef<string>(window.location.href);

  useEffect(() => {
    const targetUrl = successPageUrlRef.current;

    // 1. Add an initial history entry for the current page.
    // This is the state we want to force the browser to stay on.
    // The state object { isSuccessPageLock: true } helps identify our history entries in logs.
    window.history.pushState(
      { isSuccessPageLock: true, pageUrl: targetUrl },
      "",
      targetUrl
    );

    const handlePopState = () => {
      window.history.pushState(
        { isSuccessPageLock: true, pageUrl: targetUrl },
        "",
        targetUrl
      );
    };

    window.addEventListener("popstate", handlePopState);

    // Cleanup function when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopState);

      // If you want to be very clean and the current state is one you pushed:
      // if (window.history.state && window.history.state.isSuccessPageLock && window.history.state.pageUrl === targetUrl) {
      //   console.log("[SUCCESS COMPONENT] Optional: Attempting to go back once to remove the lock state from history as component unmounts.");
      //   window.history.back(); // This can be tricky and might have unintended side effects depending on how/why the component unmounts.
      // }
    };
  }, []); // Empty dependency array: effect runs once on mount, cleanup on unmount.

  return (
    <MainLayout>
      <div className="bg-[#F9FAFB] bg-opacity-90 flex items-center justify-center h-[90vh] relative">
        <div className="bg-white rounded-[10px] shadow-lg text-center p-10 max-w-[560px] mx-auto z-10">
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
