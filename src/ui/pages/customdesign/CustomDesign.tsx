import React, { useState } from "react";
import CustomizeLayout from "@ui/Layouts/CustomizeLayout";
import { PlumberPageSkeleton, IframeOverlay, DialogManager } from "@components";
import { useCustomDesign } from "@hooks";
import { sendNonClickable } from "@utils";

function CustomDesign() {
  const [planExpired, setPlanExpired] = useState(false);
  const [issue, setIssue] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  const { parsedTemplateList, fetchInitialData } = useCustomDesign();
  const currentUrl = parsedTemplateList?.pages?.[0]?.iframe_url;

  const handleIframeLoad = () => {
    sendNonClickable();
    fetchInitialData();
  };

  return (
    <CustomizeLayout
      setLimitReached={setLimitReached}
      setPlanExpired={setPlanExpired}
      setIssue={setIssue}
    >
      <DialogManager
        limitReached={limitReached}
        planExpired={planExpired}
        issue={issue}
      />

      {currentUrl ? (
        <IframeOverlay
          currentUrl={currentUrl}
          limitReached={limitReached}
          onLoad={handleIframeLoad}
        />
      ) : (
        <PlumberPageSkeleton />
      )}
    </CustomizeLayout>
  );
}

export default CustomDesign;
