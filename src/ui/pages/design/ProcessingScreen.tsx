import React, { useState, useEffect } from "react";
import MainLayout from "../../Layouts/MainLayout";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import "../../../index.css";

// Helper function to get the full URL
const getDomainFromEndpoint = (endpoint: string) => {
  const currentUrl = window.location.href;
  const wpAdminIndex = currentUrl.indexOf("/wp-admin");

  if (wpAdminIndex !== -1) {
    const baseUrl = currentUrl.substring(0, wpAdminIndex);
    return `${baseUrl}${endpoint}`;
  } else {
    console.error("Could not find wp-admin in the current URL.");
    return null;
  }
};

// Helper function to make POST requests
const postData = async (endpoint, data) => {
  const url = getDomainFromEndpoint(endpoint);

  if (!url) {
    return null;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error making API call:", error);
    return null;
  }
};

function ProcessingScreen() {
  const [progress, setProgress] = useState(0);
  const totalSteps = 9; // Adjusted for the removed API step
  const [loading, setLoading] = useState(true); // State to manage the loader visibility
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const apiSteps = [
    {
      endpoint: "/wp-json/custom/v1/install-plugin",
      body: {
        plugins: [
          "elementor",
          "elementskit-lite",
          "jeg-elementor-kit",
          "metform",
          "header-footer-elementor",
          "anywhere-elementor",
        ],
      },
    },
    { endpoint: "/wp-json/custom/v1/install-theme", body: {} },
    {
      endpoint: "/wp-json/custom/v1/install-posts",
      body: {
        fileurl:
          "https://plugin.mywpsite.org/creativeagency/creativeagency-posts-data.xml",
      },
    },
    {
      endpoint: "/wp-json/custom/v1/install-pages",
      body: {
        fileurl:
          "https://plugin.mywpsite.org/creativeagency/creativeagency-pages-data.xml",
      },
    },
    {
      endpoint: "/wp-json/custom/v1/install-forms",
      body: {
        fileurl:
          "https://plugin.mywpsite.org/creativeagency/creativeagency-forms.xml",
      },
    },
    {
      endpoint: "/wp-json/custom/v1/install-elementor-kit",
      body: {
        fileurl:
          "https://plugin.mywpsite.org/creativeagency/creativeagency-templates.xml",
      },
    },
    {
      endpoint: "/wp-json/custom/v1/install-elementor-settings",
      body: {
        fileurl:
          "https://plugin.mywpsite.org/creativeagency/site-settings.json",
      },
    },
    {
      endpoint: "/wp-json/custom/v1/install-header-footer",
      body: {
        fileurl:
          "https://plugin.mywpsite.org/creativeagency/creativeagency-head-foot.xml",
      },
    },
    {
      endpoint: "/wp-json/custom/v1/import-menus-css",
      body: {
        fileurl:
          "https://plugin.mywpsite.org/creativeagency/creativeagency-menu-css.json",
      },
    },
  ];

  useEffect(() => {
    const processAPIs = async () => {
      for (let i = 0; i < apiSteps.length; i++) {
        try {
          const result = await postData(apiSteps[i].endpoint, apiSteps[i].body);

          if (result && result.success) {
            console.log(`API call to ${apiSteps[i].endpoint} was successful.`);
          } else {
            console.warn(
              `API call to ${apiSteps[i].endpoint} failed, but continuing.`
            );
          }
        } catch (error) {
          console.error(
            `Error processing API call to ${apiSteps[i].endpoint}, but continuing.`,
            error
          );
        } finally {
          setProgress(((i + 1) / totalSteps) * 100);
        }
      }

      setLoading(false);
    };

    processAPIs();
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        navigate("/success");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [progress, navigate]);

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-[90vh]">
        <div className="relative flex flex-col justify-center ">
          <div
            className="w-[340px] h-[340px] flex items-center justify-center"
            style={{
              backgroundImage: `url("https://plugin.mywpsite.org/templates-data/staging/dist/websiteloader-bg.svg")`,

              backgroundSize: "contain",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <img
              src="https://tours.mywpsite.org/wp-content/uploads/2024/08/loader-gif-final.gif"
              alt="Processing"
              className="w-[40%] max-w-full"
            />
          </div>

          <div className="flex items-center justify-center gap-4 mt-10">
            <div className="relative inline-flex h-20">
              <CircularProgressbar
                value={progress}
                text={`${Math.round(progress)}%`}
                styles={buildStyles({
                  textColor: "#000",
                  pathColor: "#2E42FF",
                  trailColor: "#C9CEFF",
                })}
                strokeWidth={10}
              />
            </div>
            <div>
              <h3 className="text-xl leading-7 mt-4">
                We are building your website...
              </h3>
              <p className="text-lg leading-6 text-txt-secondary-400">
                {progress === 100
                  ? "Your website is ready!"
                  : "Please wait while we set up your site."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ProcessingScreen;
