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

interface Page {
  name: string;
  status: string;
  slug: string;
  selected: boolean;
  xml_url?: string; // Add this to avoid errors when accessing xml_url
}

const ProcessingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0); // Dynamically calculated
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // Flag to prevent duplicate calls

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getDomainFromEndpoint } = useDomainEndpoint();
  const logo = useSelector((state: RootState) => state.userData.logo);

  const template_id = useSelector(
    (state: RootState) => state.userData.templateid
  );
  const selectedPages = useSelector((state: RootState) => state.userData.pages);

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

  // Development only: Fallback pages data
  const pagesapi = [
    {
      id: 11,
      title: "Home",
      template_id: 2,
      xml_url:
        "https://plugin.mywpsite.org/tourstemplate1/tours-template-home-page.xml",
    },
    {
      id: 12,
      title: "About",
      template_id: 2,
      xml_url:
        "https://plugin.mywpsite.org/tourstemplate1/tours-template-about-page.xml",
    },
    {
      id: 13,
      title: "Service",
      template_id: 2,
      xml_url:
        "https://plugin.mywpsite.org/tourstemplate1/tours-template-services-page.xml",
    },
    {
      id: 14,
      title: "Blog",
      template_id: 2,
      xml_url:
        "https://plugin.mywpsite.org/tourstemplate1/tours-template-blog-page.xml",
    },
    {
      id: 15,
      title: "Contact Us",
      template_id: 2,
      xml_url:
        "https://plugin.mywpsite.org/tourstemplate1/tours-template-contactus-page.xml",
    },
  ];

  const processAPIs = async () => {
    // Prevent duplicate processing
    if (isProcessing) return;
    setIsProcessing(true); // Set flag before starting API calls

    const templateData = await fetchTemplates();
    if (!templateData) return;

    const { plugins, template_import_urls } = templateData.data;

    // Save the pages to Redux state
    dispatch(setPages(selectedPages));

    // Create the list of all the API steps
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
      // Only call the "Import Site Logo" API if the logo is not empty
      ...(logo
        ? [
            {
              name: "Import Site Logo",
              endpoint: "/wp-json/custom/v1/import-sitelogo",
              body: { fileurl: logo },
            },
          ]
        : []),
    ];

    // Calculate total steps dynamically
    const selectedPagesToInstall = selectedPages.filter(
      (page: any) => page.selected
    );
    const stepsCount = apiSteps.length + selectedPagesToInstall.length * 2 + 1; // +1 for CSS regeneration
    setTotalSteps(stepsCount); // Set the total steps dynamically

    // Execute other steps first
    for (let i = 0; i < apiSteps.length; i++) {
      setStatus(apiSteps[i].name);
      try {
        await postData(apiSteps[i].endpoint, apiSteps[i].body);
      } catch (error) {
        // Log the error but continue to the next API
        console.error(`Error on step: ${apiSteps[i].name}`, error);
        continue;
      }
      setProgress(((i + 1) / stepsCount) * 100); // Update progress
    }

    // Install all selected pages
    for (let i = 0; i < selectedPagesToInstall.length; i++) {
      const page = selectedPagesToInstall[i];

      setStatus(`Installing page: ${page.name}`);

      // Find the XML URL, fallback to `pagesapi` if not found in `selectedPages`
      const fileurl =
        page[0]?.xml_url ||
        pagesapi.find((p) => p.title === page.name)?.xml_url ||
        "";

      if (!fileurl) {
        console.error(`XML URL not found for page: ${page.name}`);
        console.log("url file was not found");
        continue; // Skip this page if no valid XML URL
      }

      try {
        // Call the install-pages API for each page
        await postData("/wp-json/custom/v1/install-pages", { fileurl });
      } catch (error) {
        console.error(`Error installing page: ${page.name}`, error);
        continue; // Continue with the next page if one fails
      }

      setProgress(((apiSteps.length + i + 1) / stepsCount) * 100); // Update progress
    }

    // Update content for each page after all pages are installed
    for (let i = 0; i < selectedPagesToInstall.length; i++) {
      const page = selectedPagesToInstall[i];

      setStatus(`Updating content for page: ${page.name}`);

      try {
        // Call the update-content API
        await postData("/wp-json/custom/v1/update-content", {
          page_name: page.name, // Send the page name as page_title
        });
      } catch (error) {
        console.error(`Error updating content for page: ${page.name}`, error);
        continue; // Continue with the next page if one fails
      }

      setProgress(
        ((apiSteps.length + selectedPagesToInstall.length + i + 1) /
          stepsCount) *
          100
      ); // Update progress
    }

    // Call the regenerate-global-css API after all pages and content are done
    setStatus("Regenerating Global CSS");
    try {
      await postData("/wp-json/custom/v1/regenerate-global-css", {}); // Hit the API with an empty body
    } catch (error) {
      console.error("Error regenerating global CSS", error);
    }

    setProgress(100); // Set progress to 100% after all steps

    setLoading(false);
    setIsProcessing(false); // Reset flag after processing is done
  };

  useEffect(() => {
    if (!isProcessing) {
      processAPIs(); // Process the APIs only on the initial render
    }
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

        <div className="flex items-center gap-4 mt-10">
          <CircularProgressbar
            value={progress}
            text={`${Math.round(progress)}%`}
            styles={buildStyles({
              textColor: "#000",
              pathColor: "#2E42FF",
              trailColor: "#C9CEFF",
            })}
            className="w-[70px] h-[70px] text-base font-bold"
            strokeWidth={10}
          />

          <div className="max-w-[400px]">
            <h3 className="text-lg tracking-tight font-semibold">
              We are building your website...
            </h3>
            <p className="text-base text-[#88898A] mt-2">
              {progress === 100
                ? "Your website is ready!"
                : `Please wait while we set up your site. We are installing ${status}`}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProcessingScreen;
