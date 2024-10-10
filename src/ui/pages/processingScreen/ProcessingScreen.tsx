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
  const [allPageDetails, setallPageDetails] = useState();

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
      title: "About Us",
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
    if (isProcessing) return;
    setIsProcessing(true);

    const templateData = await fetchTemplates();
    if (!templateData) {
      console.error("Template has no data");
      return;
    } else {
      setallPageDetails(templateData.data); // Store page details
      console.log("Template data", templateData.data.pages);
    }

    const { plugins, template_import_urls, pages } = templateData.data;

    dispatch(setPages(selectedPages));

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
          )?.url,
        },
      },
      {
        name: "Elementor Header and Footer",
        endpoint: "/wp-json/custom/v1/install-header-footer",
        body: {
          fileurl: template_import_urls.find(
            (url: any) => url.name === "Elementor Header Footer Data"
          )?.url,
        },
      },
      {
        name: "Post",
        endpoint: "/wp-json/custom/v1/install-posts",
        body: {
          fileurl: template_import_urls.find(
            (url: any) => url.name === "Posts Data"
          )?.url,
        },
      },
    ];

    const selectedPagesToInstall = selectedPages.filter(
      (page: any) => page.selected
    );

    const stepsCount = apiSteps.length + selectedPagesToInstall.length * 2 + 4; // Including additional steps
    setTotalSteps(stepsCount);

    // Execute API steps for plugins, theme, and forms
    for (let i = 0; i < apiSteps.length; i++) {
      setStatus(apiSteps[i].name);
      try {
        await postData(apiSteps[i].endpoint, apiSteps[i].body);
      } catch (error) {
        console.error(`Error on step: ${apiSteps[i].name}`, error);
        continue;
      }
      setProgress(((i + 1) / stepsCount) * 100);
    }

    // Install pages
    for (let i = 0; i < selectedPagesToInstall.length; i++) {
      const page = selectedPagesToInstall[i];
      setStatus(`${page.name} page`);

      let fileurl = "";
      if (pages) {
        // Get the corresponding xml_url for the page
        fileurl = pages.find((p: any) => p.title === page.name)?.xml_url || "";
        console.log(fileurl, "this is file url");
      }

      if (!fileurl) {
        console.error(`XML URL not found for page: ${page.name}`);
        continue;
      }

      try {
        await postData("/wp-json/custom/v1/install-pages", { fileurl });
      } catch (error) {
        console.error(`Error installing page: ${page.name}`, error);
        continue;
      }

      setProgress(((apiSteps.length + i + 1) / stepsCount) * 100);
    }
    setStatus("Importing Site Logo");
    try {
      await postData("/wp-json/custom/v1/import-sitelogo", { fileurl: logo });
    } catch (error) {
      console.error("Error importing site logo", error);
    }
    // Install additional components such as Elementor kits and settings
    try {
      await postData("/wp-json/custom/v1/install-elementor-kit", {
        fileurl: template_import_urls.find(
          (url: any) => url.name === "Templates Data"
        )?.url,
      });
    } catch (error) {
      console.error("Error while importing Elementor kit", error);
    }

    try {
      await postData("/wp-json/custom/v1/install-elementor-settings", {
        fileurl: template_import_urls.find(
          (url: any) => url.name === "Site Settings Data"
        )?.url,
      });
    } catch (error) {
      console.error("Error while importing Elementor settings", error);
    }

    // Importing menus and CSS
    setStatus("Importing Menus and CSS");
    try {
      await postData("/wp-json/custom/v1/import-menus-css", {
        fileurl: template_import_urls.find(
          (url: any) => url.name === "Menu Css Data"
        )?.url,
      });
    } catch (error) {
      console.error("Error importing menus and CSS", error);
    }

    // Import site logo

    // Update content for each selected page
    for (let i = 0; i < selectedPagesToInstall.length; i++) {
      const page = selectedPagesToInstall[i];
      setStatus(`Updating content for page: ${page.name}`);

      try {
        await postData("/wp-json/custom/v1/update-content", {
          page_name: page.name,
        });
      } catch (error) {
        console.error(`Error updating content for page: ${page.name}`, error);
        continue;
      }

      setProgress(
        ((apiSteps.length + selectedPagesToInstall.length + i + 1) /
          stepsCount) *
          100
      );
    }

    // Applying color, font, and logo changes
    setStatus("Applying color, font, and logo changes");
    try {
      await postData("/wp-json/custom/v1/update-style-changes", {});
    } catch (error) {
      console.error("Error applying style changes", error);
    }

    // Regenerating Global CSS
    setStatus("Regenerating Global CSS");
    try {
      await postData("/wp-json/custom/v1/regenerate-global-css", {});
    } catch (error) {
      console.error("Error regenerating global CSS", error);
    }

    // Emptying tables
    setStatus("Emptying tables");
    try {
      await postData("/wp-json/custom/v1/empty-tables", {});
    } catch (error) {
      console.error("Error emptying tables", error);
    }

    setProgress(100);
    setLoading(false);
    setIsProcessing(false);
  };

  // useEffect(() => {
  //   if (!isProcessing) {
  //     processAPIs(); // Execute the API process on initial render
  //   }
  // }, []);

  // useEffect(() => {
  //   if (progress === 100) {
  //     const timeout = setTimeout(() => {
  //       navigate("/success");
  //     }, 3000);
  //     return () => clearTimeout(timeout);
  //   }
  // }, [progress, navigate]);

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
            <p className="!text-base text-[#88898A] mt-2">
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
