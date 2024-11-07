import React, { useState, useEffect } from "react";
import MainLayout from "../../Layouts/MainLayout";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPages } from "../../../Slice/activeStepSlice";
import "../../../index.css";
import websitebg from "../../../assets/websiteloader-bg.svg";
import useDomainEndpoint from "../../../hooks/useDomainEndpoint";
import { RootState } from "../../../store/store";
import {
  ApiPage,
  Plugin,
  ReduxPage,
  ApiStep,
  TemplateData,
  TemplateImportUrl,
  mapApiPageToReduxPage,
} from "../../../types/processingpage.type";
import useFetchCustomContentData from "../../../hooks/useFetchCustomContentData";

const API_URL = import.meta.env.VITE_API_BACKEND_URL;

const ProcessingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getDomainFromEndpoint } = useDomainEndpoint();
  const fetchCustomContentData = useFetchCustomContentData();
  const logo = useSelector((state: RootState) => state.userData.logo);
  const template_id = useSelector(
    (state: RootState) => state.userData.templateid
  );

  const selectedPages = useSelector(
    (state: RootState) => state.userData.pages as ReduxPage[]
  );

  // Fetch template details
  const fetchTemplates = async (): Promise<TemplateData | null> => {
    try {
      const response = await fetch(
        `${API_URL}getTemplates?template_id=${template_id}`
      );
      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Template not found.") {
          console.warn("Template not found, attempting to fetch templateid.");

          const tempid = await fetchCustomContentData(["templateid"]);
          console.log("another", parseInt(tempid.templateid));

          const retryResponse = await fetch(
            `${API_URL}getTemplates?template_id=${parseInt(tempid.templateid)}`
          );
          const retryData = await retryResponse.json();
          console.log("2nd response", retryData);

          if (retryResponse.ok) {
            return retryData.data;
          } else {
            throw new Error("Failed to fetch templates after retry.");
          }
        } else {
          throw new Error(data.message || "Failed to fetch templates");
        }
      }

      return data.data;
    } catch (error) {
      console.error("Error fetching templates:", error);
      return null;
    }
  };

  const postData = async (
    endpoint: string,
    data: object,
    method: "POST" | "DELETE" = "POST"
  ): Promise<any> => {
    const url = getDomainFromEndpoint(endpoint);
    if (!url) return null;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`Error posting data to ${url}`);
      return await response.json();
    } catch (error) {
      console.error(`Error in API call (${method}) to ${url}:`, error);
      return null;
    }
  };

  const processAPIs = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const templateData = await fetchTemplates();
    if (!templateData) {
      console.error("Template has no data");
      return;
    }

    const { plugins, pages, template_import_urls, site_logo } = templateData;

    const reduxPages = pages.map((apiPage: ApiPage) =>
      mapApiPageToReduxPage(apiPage)
    );

    dispatch(setPages(reduxPages));

    const apiSteps: ApiStep[] = [
      {
        name: "Plugins",
        endpoint: "/wp-json/custom/v1/install-plugin",
        body: { plugins: plugins.map((plugin: Plugin) => plugin.slug) },
      },
      { name: "Theme", endpoint: "/wp-json/custom/v1/install-theme", body: {} },
      {
        name: "Forms",
        endpoint: "/wp-json/custom/v1/install-forms",
        body: {
          fileurl: template_import_urls.find(
            (url: TemplateImportUrl) => url.name === "Forms Data"
          )?.url,
        },
      },
      {
        name: "Elementor Header and Footer",
        endpoint: "/wp-json/custom/v1/install-header-footer",
        body: {
          fileurl: template_import_urls.find(
            (url: TemplateImportUrl) =>
              url.name === "Elementor Header Footer Data"
          )?.url,
        },
      },
    ];

    const isBlogSelected = selectedPages.some(
      (page: ReduxPage) => page.slug === "blog" && page.selected
    );

    if (isBlogSelected) {
      apiSteps.push({
        name: "Post",
        endpoint: "/wp-json/custom/v1/install-posts",
        body: {
          fileurl: template_import_urls.find(
            (url: TemplateImportUrl) => url.name === "Posts Data"
          )?.url,
        },
      });
    }

    const selectedPagesToInstall = selectedPages.filter(
      (page: ReduxPage) => page.selected
    );

    const stepsCount = apiSteps.length + selectedPagesToInstall.length * 2 + 4;
    setTotalSteps(stepsCount);

    for (let i = 0; i < apiSteps.length; i++) {
      setStatus(apiSteps[i].name);
      await postData(apiSteps[i].endpoint, apiSteps[i].body);
      setProgress(((i + 1) / stepsCount) * 100);
    }

    for (let i = 0; i < selectedPagesToInstall.length; i++) {
      const page = selectedPagesToInstall[i];
      setStatus(`${page.name} page`);

      const fileurl =
        pages.find((p: ApiPage) => p.title === page.name)?.xml_url || "";
      if (!fileurl) {
        console.error(`XML URL not found for page: ${page.name}`);
        continue;
      }

      await postData("/wp-json/custom/v1/install-pages", { fileurl });
      setProgress(((apiSteps.length + i + 1) / stepsCount) * 100);
    }

    const logoToUse = logo || site_logo;
    console.log("this is site logo", logoToUse);

    if (logoToUse) {
      setStatus("Importing Site Logo");
      await postData("/wp-json/custom/v1/import-sitelogo", {
        fileurl: logoToUse,
      });
    }

    await postData("/wp-json/custom/v1/install-elementor-kit", {
      fileurl: template_import_urls.find(
        (url: TemplateImportUrl) => url.name === "Templates Data"
      )?.url,
    });
    await postData("/wp-json/custom/v1/install-elementor-settings", {
      fileurl: template_import_urls.find(
        (url: TemplateImportUrl) => url.name === "Site Settings Data"
      )?.url,
    });

    setStatus("Importing Menus and CSS");
    await postData("/wp-json/custom/v1/import-menus-css", {
      fileurl: template_import_urls.find(
        (url: TemplateImportUrl) => url.name === "Menu Css Data"
      )?.url,
    });

    for (let i = 0; i < selectedPagesToInstall.length; i++) {
      const page = selectedPagesToInstall[i];
      // if (page.slug === "blog" || page.slug === "contact-us") {
      //   continue;
      // }
      setStatus(`Updating content for page: ${page.name}`);
      await postData("/wp-json/custom/v1/update-content", {
        page_name: page.name,
      });
      setProgress(
        ((apiSteps.length + selectedPagesToInstall.length + i + 1) /
          stepsCount) *
          100
      );
    }

    setStatus("Changing the contact details");
    await postData("/wp-json/custom/v1/replace-user-content", {});

    setStatus("Applying color, font, and logo changes");
    await postData("/wp-json/custom/v1/update-style-changes", {});

    setStatus("Regenerating Global CSS");
    await postData("/wp-json/custom/v1/regenerate-global-css", {});

    setStatus("Emptying tables");
    await postData("/wp-json/custom/v1/empty-tables", {}, "DELETE");

    setProgress(100);
    setIsProcessing(false);
  };

  useEffect(() => {
    if (!isProcessing) processAPIs();
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
