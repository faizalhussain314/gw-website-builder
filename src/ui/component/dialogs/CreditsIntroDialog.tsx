import React from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import GravityWriteLogo from "../../../assets/gravity-write-logo.svg";
import { AnimatePresence, motion } from "framer-motion";

interface CreditsIntroPopupProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubscriptionClick?: () => void;
  isLoading?: boolean; // Add loading prop
  oldUsage?: {
    wordsUsed: number;
    wordsLimit: number;
    imagesUsed: number;
    imagesLimit: number;
  };
  newUsage?: {
    creditsUsed: number;
    creditsLimit: number;
  };
}

const Mode = import.meta.env.VITE_MODE;

const CreditsIntroPopup: React.FC<CreditsIntroPopupProps> = ({
  isOpen = false,
  onClose = () => {},
  onSubscriptionClick = () => {},
  isLoading = false, // Add loading prop with default
  oldUsage = {
    wordsUsed: 0,
    wordsLimit: 500,
    imagesUsed: 0,
    imagesLimit: 100,
  },
  newUsage = {
    creditsUsed: 1259.51,
    creditsLimit: 410.5,
  },
}) => {
  // Skeleton loader component
  const SkeletonLoader = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );

  const openSubcription = () => {
    if (Mode === "staging") {
      // Opens the staging URL in a new tab
      window.open(
        "https://gravitywrite-frontend.pages.dev/credit-based?target=subscription",
        "_blank"
      );
    } else {
      // Opens the production URL in a new tab
      window.open(
        "https://app.gravitywrite.com/credit-based?target=subscription",
        "_blank"
      );
    }
  };

  // Updated ProgressBar with skeleton loading
  const ProgressBar = ({
    name,
    usage,
    limit,
    subTitle,
    isLoading,
  }: {
    name: string;
    usage: number;
    limit: number;
    subTitle: string;
    isLoading?: boolean;
  }) => (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        {isLoading ? (
          <>
            <SkeletonLoader className="h-4 w-20" />
            <SkeletonLoader className="h-4 w-16" />
          </>
        ) : (
          <>
            <span className="text-sm font-medium text-gray-700">{name}</span>
            <span className="text-sm text-gray-500">
              {usage} / {limit}
            </span>
          </>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        {isLoading ? (
          <SkeletonLoader className="h-2 w-full rounded-full" />
        ) : (
          <div
            className="bg-palatinate-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((usage / limit) * 100, 100)}%` }}
          ></div>
        )}
      </div>
      <div className="text-xs text-gray-400 mt-1">
        {isLoading ? <SkeletonLoader className="h-3 w-12" /> : subTitle}
      </div>
    </div>
  );

  const Badge = ({
    children,
    variant,
  }: {
    children: React.ReactNode;
    variant: "red" | "green";
  }) => (
    <div
      className={`
      px-3 py-1 rounded-full text-xs font-medium mx-auto w-fit animate-pulse
      ${
        variant === "red"
          ? "bg-red-100 text-red-600"
          : "bg-green-100 text-green-600"
      }
    `}
    >
      {children}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative p-8 md:p-12  max-h-[90vh] bg-white w-full rounded-3xl max-w-[560px] text-center mx-auto text-gray-900 overflow-y-auto"
          >
            <button
              className="absolute top-8 right-6 cursor-pointer"
              onClick={onClose}
            >
              <XMarkIcon className="size-6" />
            </button>

            <img
              src={"https://plugin.mywpsite.org/gravity-write-logo.svg"}
              alt="GravityWrite"
              className="h-6 mx-auto mb-6"
            />

            <h2 className="text-2xl font-bold mb-3 text-gray-900">
              We're moving to credits
            </h2>

            <p className="text-gray-600 mb-8">
              We're moving to a credit system instead of tracking word or image
              counts. This will give you more usage in terms of words and images
              than you had before.
            </p>

            <Badge variant="red">Old</Badge>

            <div className="flex flex-col w-full gap-4 mb-6 mt-4">
              <ProgressBar
                name="Words used"
                usage={oldUsage.wordsUsed}
                limit={oldUsage.wordsLimit}
                subTitle="Words"
                isLoading={isLoading}
              />
              <ProgressBar
                name="Images used"
                usage={oldUsage.imagesUsed}
                limit={oldUsage.imagesLimit}
                subTitle="Images"
                isLoading={isLoading}
              />
            </div>

            <Badge variant="green">New</Badge>

            <div className="flex flex-col w-full gap-6 mb-8 mt-4">
              <ProgressBar
                name="Credits used"
                usage={newUsage.creditsUsed}
                limit={newUsage.creditsLimit}
                subTitle="Credits"
                isLoading={isLoading}
              />
              <p className="text-gray-600 -mt-2">
                Going forward both images and words will use credits.
              </p>
            </div>

            <div className="grid grid-cols-2 items-center justify-between gap-5">
              <button
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                onClick={openSubcription}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "See in subscription page"}
              </button>
              <button
                className="w-full px-4 py-2 bg-palatinate-blue-600 text-white rounded-lg hover:bg-palatinate-blue-700 transition-colors"
                onClick={onClose}
              >
                Okay, got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreditsIntroPopup;
