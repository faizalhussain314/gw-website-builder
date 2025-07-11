import React, { ReactNode, useState, useEffect, Fragment } from "react";
import Sidebar from "../global component/Sidebar";
import FeatureBanner from "../component/FeatureBanner";
import CreditOverlay from "../component/CreditOverlay";
import CreditsIntroPopup from "../component/dialogs/CreditsIntroDialog";
import { useAppSelector, useAppDispatch } from "@hooks/redux";
import {
  selectUsageData,
  selectUsageLoading,
  selectUsageError,
  fetchUsageDetails,
} from "../../Slice/usageSlice";

interface MainLayoutProps {
  children: ReactNode;
}

const SHOW_NEW_FEATURE: boolean = true;
const showBanner: boolean = true;
const customLocation: string = "/home";
const accountCreatedDate: number = new Date("2023-01-01").getTime();
const specificDate: number = new Date("2024-01-01").getTime();
const livedDate: number = new Date("2023-05-01").getTime();

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [showFeatureBanner, setShowFeatureBanner] = useState<boolean>(false);
  const [showCreditsPopup, setShowCreditsPopup] = useState<boolean>(false);

  // Redux selectors
  const usageData = useAppSelector(selectUsageData);
  const usageLoading = useAppSelector(selectUsageLoading);
  const usageError = useAppSelector(selectUsageError);
  const dispatch = useAppDispatch();

  // Get version from Redux
  const userVersion = useAppSelector((state) => state.user.version);

  // Check if version is valid (2.0)
  const isValidVersion = userVersion === "2.0";
  const shouldShowCreditOverlay = !isValidVersion; // Show overlay if version is not 2.0 or missing

  // Handle the click to close the banner
  const handleClick = (): void => {
    setShowFeatureBanner(false);
  };

  // Handle opening the credits popup
  const handleOpenCreditsPopup = (): void => {
    setShowCreditsPopup(true);
  };

  // Handle closing the credits popup
  const handleCloseCreditsPopup = (): void => {
    setShowCreditsPopup(false);
  };

  // Handle subscription page navigation
  const handleSubscriptionClick = (): void => {
    console.log("Navigate to subscription");
    setShowCreditsPopup(false);
  };

  // Placeholder for handlers.openDialog
  const handlers = {
    openDialog: (dialog: string): void => {
      console.log(`Opening dialog: ${dialog}`);
      if (dialog === "credits-intro") {
        handleOpenCreditsPopup();
      }
    },
  };

  // Fetch usage data on component mount
  useEffect(() => {
    if (!usageData && !usageLoading) {
      dispatch(fetchUsageDetails());
    }
  }, [dispatch, usageData, usageLoading]);

  // Conditional check for displaying the feature banner
  useEffect(() => {
    if (
      SHOW_NEW_FEATURE &&
      showBanner &&
      accountCreatedDate < specificDate &&
      livedDate > accountCreatedDate
    ) {
      setShowFeatureBanner(true);
    } else {
      setShowFeatureBanner(false);
    }
  }, []);

  // Optional: Handle usage error
  useEffect(() => {
    if (usageError) {
      console.error("Failed to fetch usage data:", usageError);
    }
  }, [usageError]);

  // Debug log for version checking (remove in production)
  useEffect(() => {
    console.log(
      "User version:",
      userVersion,
      "Should show overlay:",
      shouldShowCreditOverlay
    );
  }, [userVersion, shouldShowCreditOverlay]);

  return (
    <Fragment>
      <div className="flex justify-center items-center max-w-3/4 mx-auto"></div>

      <div className="flex">
        <div className="w-[23%]">
          <Sidebar />
        </div>
        {/* Main Container */}
        <div className="flex flex-col flex-1 max-w-full max-h-screen">
          {showFeatureBanner && (
            <div>
              <FeatureBanner
                feature="Introducing the New Credit System"
                message="More Flexibility , More Possibilities"
                ctaText="Explore Now"
                onClose={handleClick}
                onClick={() => handlers.openDialog("credits-intro")}
              />
            </div>
          )}

          {/* Conditionally show CreditOverlay based on version */}
          {shouldShowCreditOverlay && <CreditOverlay />}

          <main className="flex flex-col flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Credits Intro Popup - Pass loading state */}
      <CreditsIntroPopup
        isOpen={showCreditsPopup}
        onClose={handleCloseCreditsPopup}
        onSubscriptionClick={handleSubscriptionClick}
        isLoading={usageLoading}
        oldUsage={{
          wordsUsed: usageData?.words_used || 0,
          wordsLimit: usageData?.words_total || 500,
          imagesUsed: usageData?.images_used || 0,
          imagesLimit: usageData?.images_total || 100,
        }}
        newUsage={{
          creditsUsed: usageData?.credit_usage || 0,
          creditsLimit: usageData?.credit_limit || 0,
        }}
      />
    </Fragment>
  );
};

export default MainLayout;
