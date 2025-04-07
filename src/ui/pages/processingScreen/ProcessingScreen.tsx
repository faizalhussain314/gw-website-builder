import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "../../Layouts/MainLayout";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUserData, setPages } from "../../../Slice/activeStepSlice";
import "../../../index.css";
import websitebg from "../../../assets/websiteloader-bg.svg";
import useDomainEndpoint from "../../../hooks/useDomainEndpoint";
import store, { RootState } from "../../../store/store";
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
import ImportCountError from "../../component/dialogs/ImportCountError";
import { setWpToken } from "../../../Slice/userSlice";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BACKEND_URL;

// Define a generic API response interface (you can extend this as needed)
interface ApiResponse<T = unknown> {
  status: string;
  data?: T;
  message?: string;
}

// Interface for the getTemplates response
interface TemplateResponse {
  status: string;
  data: TemplateData;
  message?: string;
}

const ProcessingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [importLimit, setImportLimit] = useState(false);

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
  const bussinessName = useSelector(
    (state: RootState) => state.userData.businessName
  );

  const logoWidth = useSelector((state: RootState) => state.userData.logoWidth);

  const fetchTemplates = useCallback(async (): Promise<TemplateData | null> => {
    try {
      let wp_token = store.getState().user.wp_token;

      if (!wp_token) {
        try {
          const url = getDomainFromEndpoint(
            "/wp-json/custom/v1/get-user-token"
          );
          const response = await axios.get(url);
          const result = response.data as { status: boolean; token?: string };

          if (result.status && result.token) {
            wp_token = result.token;
            dispatch(setWpToken(wp_token));
          } else {
            console.error("Failed to fetch token: Invalid response");
            throw new Error("Unable to fetch Bearer token.");
          }
        } catch (error) {
          console.error("Error fetching user token:", error);
          throw new Error("Failed to retrieve Bearer token.");
        }
      }

      const response = await fetch(
        `${API_URL}getTemplates?template_id=${template_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${wp_token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Template not found.") {
          console.warn("Template not found, attempting to fetch template ID.");

          const tempid = await fetchCustomContentData(["templateid"]);

          // Retry API Call with new template ID
          const retryResponse = await fetch(
            `${API_URL}getTemplates?template_id=${parseInt(tempid.templateid)}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${wp_token}`,
              },
            }
          );

          const retryData = (await retryResponse.json()) as TemplateResponse;

          if (retryResponse.ok) {
            return retryData.data;
          } else {
            throw new Error("Failed to fetch templates after retry.");
          }
        } else {
          throw new Error(data.message || "Failed to fetch templates.");
        }
      }

      return data.data;
    } catch (error) {
      console.error("Error fetching templates:", error);
      return null;
    }
  }, [dispatch, fetchCustomContentData, getDomainFromEndpoint, template_id]);

  const postData = useCallback(
    async <T = unknown,>(
      endpoint: string,
      data: object,
      method: "POST" | "DELETE" = "POST"
    ): Promise<ApiResponse<T> | null> => {
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
    },
    [getDomainFromEndpoint]
  );

  const processAPIs = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const checkSiteCountEndpoint = getDomainFromEndpoint(
      "/wp-json/custom/v1/check-site-count"
    );

    if (!checkSiteCountEndpoint) {
      console.error("Check site count endpoint is not available.");
      setIsProcessing(false);
      return;
    }

    try {
      const checkSiteCountResponse = await fetch(checkSiteCountEndpoint);
      const checkSiteCountData = await checkSiteCountResponse.json();

      if (!checkSiteCountResponse.ok || !checkSiteCountData?.status) {
        setImportLimit(true);
        setIsProcessing(false);
        return;
      }
    } catch (error) {
      console.error("Error checking site count:", error);
      setIsProcessing(false);
      return;
    }

    const templateData = await fetchTemplates();
    if (!templateData) {
      console.error("Template has no data");
      if (!templateData && !bussinessName) {
        navigate("/");
      }

      return;
    }

    const { plugins, pages, template_import_urls } = templateData;

    const reduxPages = pages.map((apiPage: ApiPage) =>
      mapApiPageToReduxPage(apiPage)
    );

    dispatch(setPages(reduxPages));

    const updateCountEndpoint = getDomainFromEndpoint(
      "/wp-json/custom/v1/update-count"
    );
    if (!updateCountEndpoint) {
      console.error("Update count endpoint is not available.");
      setIsProcessing(false);
      return;
    }

    const updateCountResponse = await postData(
      "/wp-json/custom/v1/update-count",
      {
        words: 0,
        template_id: template_id,
        page_title: "",
        sitecount: 1,
        is_type: "sitecount",
      }
    );
    if (!updateCountResponse || updateCountResponse.status !== "success") {
      console.error("Failed to update site count:", updateCountResponse);
      setIsProcessing(false);
    }

    if (updateCountResponse?.status !== "success") {
      console.error("Failed to update site count:", updateCountResponse);
      setIsProcessing(false);
    }

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
    // setTotalSteps(stepsCount);

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

    let logoToUse = logo;
    let logoType = "";

    if (logoToUse) {
      logoType = "url";
    } else {
      logoToUse = bussinessName;
      logoType = "string";
    }

    if (logoToUse) {
      setStatus("Importing Site Logo");
      await postData("/wp-json/custom/v1/import-sitelogo", {
        fileurl: logoToUse,
        type: logoType,
      });

      setStatus("adjusting logo width");
      await postData("wp-json/custom/v1/set-logo-width", { width: logoWidth });
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

    for (let i = 0; i < selectedPagesToInstall.length; i++) {
      const page = selectedPagesToInstall[i];
      if (page.slug === "blog" || page.slug === "contact-us") {
        continue;
      }
      setStatus(`Updating images for page: ${page.name}`);
      await postData("wp-json/elementor-image-update/v1/update-images/", {
        page_name: page.name,
      });
      // ... progress calculation
    }

    setStatus("Applying color, font, and logo changes");
    await postData("/wp-json/custom/v1/update-style-changes", {});

    setStatus("Regenerating Global CSS");
    await postData("/wp-json/custom/v1/regenerate-global-css", {});

    setStatus("importing animation");
    await postData("/wp-json/custom/v1/install-animation", {});

    setStatus("Emptying tables");
    await postData("/wp-json/custom/v1/empty-tables", {}, "DELETE");

    setProgress(100);
    dispatch(clearUserData());
    setIsProcessing(false);
  }, [
    bussinessName,
    dispatch,
    fetchTemplates,
    getDomainFromEndpoint,
    isProcessing,
    logo,
    logoWidth,
    navigate,
    postData,
    selectedPages,
    template_id,
  ]);

  useEffect(() => {
    if (!isProcessing) processAPIs();
  }, [isProcessing, processAPIs]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isProcessing) {
        e.preventDefault();
        e.returnValue =
          "We are importing all essential things. If you leave, the process will be abandoned. Would you like to proceed?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isProcessing]);

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
        {importLimit && <ImportCountError />}
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
            src="https://plugin.mywpsite.org/loader-gif-final.gif"
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
