import React from "react";
import UpgradeWords from "@components/dialogs/UpgradeWords";
import PlanExpired from "@components/dialogs/PlanExpired";
import SomethingWrong from "@components/dialogs/SomethingWrong";

interface DialogManagerProps {
  limitReached: boolean;
  planExpired: boolean;
  issue: boolean;
}

const DialogManager: React.FC<DialogManagerProps> = ({
  limitReached,
  planExpired,
  issue,
}) => {
  return (
    <>
      {limitReached && <UpgradeWords />}
      {planExpired && <PlanExpired />}
      {issue && <SomethingWrong />}
    </>
  );
};

export default DialogManager;
