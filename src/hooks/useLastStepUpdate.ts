import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setlastStep } from "../Slice/activeStepSlice";
import useDomainEndpoint from "./useDomainEndpoint";

const useLastStepUpdate = () => {
  const dispatch = useDispatch();
  const { getDomainFromEndpoint } = useDomainEndpoint();

  const updateLastStep = useCallback(
    async (step: string) => {
      const url = getDomainFromEndpoint(
        "/wp-json/custom/v1/update-form-details"
      );
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lastStep: step }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update lastStep: ${response.statusText}`);
        }

        dispatch(setlastStep(step));
      } catch (error) {
        console.error("Error updating lastStep:", error);
      }
    },
    [dispatch, getDomainFromEndpoint]
  );

  return { updateLastStep };
};

export default useLastStepUpdate;
