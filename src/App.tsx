import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "@hooks/redux"; // Change this import
import ContinuePopup from "./ui/component/dialogs/ContinuePopup";
import useFetchContentData from "./hooks/useFetchContentData";
import useSessionHandler from "./hooks/useSessionHandler";
import useLastStepUpdate from "./hooks/useLastStepUpdate";
import { clearUserData, setlastStep } from "./Slice/activeStepSlice";
import AppRoutes from "./routes/AppRoutes";
import CloseIcon from "./ui/global component/CloseIcon";
import {
  setUsername,
  setPlan,
  setWebsiteGenerationLimit,
  setEmail,
  setGravator,
  setGeneratedSite,
  setMaxGeneration,
  setVersion,
} from "./Slice/userSlice";
import useDomainEndpoint from "./hooks/useDomainEndpoint";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { fetchWpToken } from "./core/utils/fetchWpToken";
import { usePostHog } from "posthog-js/react";
import { UserDetails } from "./types/UserDetails";
import { fetchUsageDetails } from "./Slice/usageSlice";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch(); // Change this line
  const posthog = usePostHog();

  const { isSessionActive, setSessionActive } = useSessionHandler();
  const { updateLastStep } = useLastStepUpdate();

  const [showPopup, setShowPopup] = useState(false);
  const [fetchedData, setFetchedData] = useState<UserDetails | null>(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isRefresh, setIsRefresh] = useState(false);
  const [shouldFetchUsage, setShouldFetchUsage] = useState(true); // Add this state
  const username = useSelector((state: RootState) => state.user.username);

  const { fetchContent, emptyTable } = useFetchContentData();
  const { getDomainFromEndpoint } = useDomainEndpoint();

  const email = useSelector((state: RootState) => state.user.email);

  const fetchUserDetails = useCallback(async () => {
    try {
      const url = getDomainFromEndpoint(
        "/wp-json/custom/v1/get-gwuser-details"
      );
      const response = await axios.post(
        url,
        {
          fields: [
            "id",
            "name",
            "email",
            "gravator",
            "plan_detail",
            "website_used",
            "website_total",
            "version",
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = response.data;

      if (result) {
        dispatch(setUsername(result[0]?.name));
        dispatch(setPlan(result[0]?.plan_detail));
        dispatch(setWebsiteGenerationLimit(parseInt(result[0]?.website_total)));
        dispatch(setEmail(result[0]?.email));
        dispatch(setGravator(result[0]?.gravator));
        dispatch(setGeneratedSite(parseInt(result[0]?.website_used)));
        dispatch(setMaxGeneration(parseInt(result[0]?.website_total)));
        const version = result[0]?.version;
        if (version !== undefined) {
          dispatch(setVersion(version)); // Set actual version value
        } else {
          dispatch(setVersion(null)); // Set null if key is missing
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        // Handle 404 error specifically
        if (status === 404) {
          // dispatch(setVersion(null));
          setShouldFetchUsage(false); // Prevent usage details API from being called
          console.error("User details not found (404):", message);
          return;
        }

        console.error("unexpected error:", status, message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }, [getDomainFromEndpoint, dispatch]);

  useEffect(() => {
    if (performance.navigation.type === 1) {
      setIsRefresh(true);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserDetails();

        const data = await fetchContent();
        setFetchedData(data);

        const hasData =
          data?.category || data?.bussinessName || data?.description1;

        if (
          hasData &&
          username &&
          !isSessionActive &&
          !isRefresh &&
          location.pathname === "/"
        ) {
          setShowPopup(true);
        }

        if (data?.lastStep) {
          dispatch(setlastStep(data.lastStep));
          return;
        }

        setSessionActive();
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setFirstLoad(false);
      }
    };

    if (firstLoad) {
      fetchData();
    }
  }, [
    fetchContent,
    dispatch,
    firstLoad,
    isSessionActive,
    isRefresh,
    setSessionActive,
    fetchUserDetails,
    location.pathname,
    username,
  ]);

  useEffect(() => {
    if (!firstLoad) {
      updateLastStep(location.pathname);
    }
  }, [location.pathname, firstLoad, updateLastStep]);

  const handleContinue = () => {
    if (!fetchedData?.lastStep) {
      return;
    }
    navigate(fetchedData.lastStep);
    setSessionActive();
    setShowPopup(false);
  };

  const handleCreateFromScratch = async () => {
    dispatch(clearUserData());
    await emptyTable("/wp-json/custom/v1/empty-tables", {});
    navigate("/category");
    setSessionActive();
    setShowPopup(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        // Fetch token only if username exists
        await fetchWpToken(dispatch, getDomainFromEndpoint);
      } else {
        console.error("Username is empty, skipping token fetch.");
      }
    };

    fetchData();
  }, [username, dispatch, getDomainFromEndpoint]);

  useEffect(() => {
    if (email) {
      // Identify sends an event, so you want may want to limit how often you call it
      posthog?.identify(username, {
        email: email,
      });
      // posthog?.group("plan", user.company_id);
    }
  }, [posthog, email, username]);

  useEffect(() => {
    // Fetch usage details when app starts, but only if shouldFetchUsage is true
    if (shouldFetchUsage) {
      dispatch(fetchUsageDetails());
    }
  }, [dispatch, shouldFetchUsage]);

  return (
    <div className="relative">
      {/* {apiErrorPopup && <ApiIssue />} */}
      {showPopup && (
        <ContinuePopup
          onClose={() => setShowPopup(false)}
          alertType="websiteCreation"
          onContinue={handleContinue}
          onCreateFromScratch={handleCreateFromScratch}
        />
      )}
      <div className="absolute right-4 top-4 z-50">
        <CloseIcon />
      </div>
      <AppRoutes />
    </div>
  );
};

export default App;
