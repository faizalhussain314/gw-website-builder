import React from "react";
import { GwLoader, PlumberPageSkeleton } from "@components";
import {
  WordLimit,
  ImagLimitWarning,
  SomethingWrong,
  ApiErrorPopup,
  PlanExpired,
} from "@dialog";

interface LoadingOverlaysProps {
  showGwLoader: boolean;
  isLoading: boolean;
  isContentGenerating: boolean;
  showImageWarning: boolean;
  onCloseImageWarning: () => void;
  apiIssue: boolean;
  wordCountAlert: boolean;
  planExpired: boolean;
  issue: boolean;
}

const LoadingOverlays: React.FC<LoadingOverlaysProps> = ({
  showGwLoader,
  isLoading,
  isContentGenerating,
  showImageWarning,
  onCloseImageWarning,
  apiIssue,
  wordCountAlert,
  planExpired,
  issue,
}) => {
  return (
    <>
      {/* GwLoader */}
      {showGwLoader && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
          <GwLoader />
        </div>
      )}

      {/* Image Warning */}
      {showImageWarning && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <ImagLimitWarning onClose={onCloseImageWarning} />
        </div>
      )}

      {/* API Issue */}
      {apiIssue && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
          <ApiErrorPopup alertType="contentError" />
        </div>
      )}

      {/* Skeleton Loader */}
      {isLoading && !isContentGenerating && <PlumberPageSkeleton />}

      {/* Word Count Alert */}
      {wordCountAlert && <WordLimit />}

      {/* Plan Expired */}
      {planExpired && <PlanExpired />}

      {/* Something Wrong */}
      {issue && <SomethingWrong />}
    </>
  );
};

export default LoadingOverlays;
