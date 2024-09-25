import React, { useState, useEffect } from "react";
import MainLayout from "../../Layouts/MainLayout";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTemplateList, setPages } from "../../../Slice/activeStepSlice";
import "../../../index.css";
import websitebg from "../../../assets/websiteloader-bg.svg";
import useDomainEndpoint from "../../../hooks/useDomainEndpoint";
import { RootState } from "../../../store/store"; // Import your RootState

const ProcessingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const totalSteps = 12;
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // Flag to prevent duplicate calls

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getDomainFromEndpoint } = useDomainEndpoint();
  const logo = useSelector((state: RootState) => state.userData.logo);

  const template_id = useSelector(
    (state: RootState) => state.userData.templateList[0]?.id
  );
  const selectedPages = useSelector((state: RootState) => state.userData.pages);

  const VITE_API_BACKEND_URL = process.env.VITE_API_BACKEND_URL;

  const fetchTemplates = async () => {
    try {
      const response = await fetch(
        `https://dev.gravitywrite.com/api/getTemplates?template_id=${template_id}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching templates:", error);
      return null;
    }
  };

  const postData = async (endpoint: string, data: object) => {
    const url = getDomainFromEndpoint(endpoint);
    if (!url) return null;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error(`Error posting data to ${url}:`, error);
      return null;
    }
  };

  const processAPIs = async () => {
    // Prevent duplicate processing
    if (isProcessing) return;
    setIsProcessing(true); // Set flag before starting API calls

    const templateData = await fetchTemplates();
    if (!templateData) return;

    const { pages, plugins, template_import_urls } = templateData.data;

    // Save the pages to Redux state
    dispatch(setPages(pages));

    const apiSteps = [
      {
        name: "Plugins",
        endpoint: "/wp-json/custom/v1/install-plugin",
        body: { plugins: plugins.map((plugin: any) => plugin.slug) },
      },
      { name: "Theme", endpoint: "/wp-json/custom/v1/install-theme", body: {} },
      {
        name: "Forms",
        endpoint: "/wp-json/custom/v1/install-forms",
        body: {
          fileurl: template_import_urls.find(
            (url: any) => url.name === "Forms Data"
          ).url,
        },
      },
      {
        name: "Elementor Header and Footer",
        endpoint: "/wp-json/custom/v1/install-header-footer",
        body: {
          fileurl: template_import_urls.find(
            (url: any) => url.name === "Elementor Header Footer Data"
          ).url,
        },
      },
      {
        name: "Post",
        endpoint: "/wp-json/custom/v1/install-posts",
        body: {
          fileurl: template_import_urls.find(
            (url: any) => url.name === "Posts Data"
          ).url,
        },
      },
      {
        name: "Pages",
        endpoint: "/wp-json/custom/v1/install-pages",
        body: selectedPages
          .filter((page: any) => page.selected)
          .map((page: any) => ({ fileurl: page.xml_url })),
      },
      {
        name: "Elementor Kit",
        endpoint: "/wp-json/custom/v1/install-elementor-kit",
        body: {
          fileurl: template_import_urls.find(
            (url: any) => url.name === "Templates Data"
          ).url,
        },
      },
      {
        name: "Elementor Settings",
        endpoint: "/wp-json/custom/v1/install-elementor-settings",
        body: {
          fileurl: template_import_urls.find(
            (url: any) => url.name === "Site Settings Data"
          ).url,
        },
      },
      {
        name: "Menu And Css",
        endpoint: "/wp-json/custom/v1/import-menus-css",
        body: {
          fileurl: template_import_urls.find(
            (url: any) => url.name === "Menu Css Data"
          ).url,
        },
      },
      {
        name: "Import Site Logo",
        endpoint: "/wp-json/custom/v1/import-sitelogo",
        body: { fileurl: logo },
      },
      ...selectedPages
        .filter((page: any) => page.selected)
        .map((page: any) => ({
          name: `Update ${page.name} Content`,
          endpoint: "/wp-json/custom/v1/update-content",
          body: { page_name: page.name },
        })),
    ];

    for (let i = 0; i < apiSteps.length; i++) {
      setStatus(apiSteps[i].name);
      await postData(apiSteps[i].endpoint, apiSteps[i].body);
      setProgress(((i + 1) / totalSteps) * 100);
    }

    setLoading(false);
    setIsProcessing(false); // Reset flag after processing is done
  };

  useEffect(() => {
    // Process the APIs only on the initial render
    if (!isProcessing) {
      processAPIs();
    }
    // Empty dependency array ensures the effect runs only once
  }, []); // <-- Only run on mount

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
              backgroundImage: `url(${websitebg})`,
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
              <p className="text-lg leading-6 text-txt-secondary-400 ">
                {progress === 100
                  ? "Your website is ready!"
                  : `Please wait while we set up your site. We are installing ${status}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProcessingScreen;
