import React, { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  setDescriptionOne,
  setDescriptionTwo,
} from "../../../Slice/activeStepSlice";
import { fetchDescriptionStream } from "@api/laraval-api/description.api";
import {
  checkWordCount,
  getDescriptions,
  updateDescriptions,
  updateWordCount,
} from "@api/wordpress-api";
import { handleEnterKey } from "@utils";
import { useDebounce } from "use-debounce";
import { SomethingWrong, PlanExpired, UpgradePopup } from "@dialog";

// Import components
import {
  DescriptionHeader,
  DescriptionInput,
  NavigationButton,
} from "@components";

// Import utils
import { getInputClass, validateDescriptions } from "@utils";

function Description() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const businessName = useSelector(
    (state: RootState) => state.userData.businessName
  );
  const category = useSelector((state: RootState) => state.userData.category);

  const [description1, setDescription1] = useState<string>("");
  const [description2, setDescription2] = useState<string>("");
  const [planExpired, setPlanExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader1, setLoader1] = useState<boolean>(false);
  const [loader2, setLoader2] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [issue, setIssue] = useState(false);

  const templateList = useSelector(
    (state: RootState) => state.userData.templateList
  );
  const [wordLimitError, setwordLimitError] = useState(false);
  const [description1Error, setDescription1Error] = useState<boolean>(false);
  const [description2Error, setDescription2Error] = useState<boolean>(false);

  // const [debouncedDescription1] = useDebounce(description1, 500);
  const [debouncedDescription2] = useDebounce(description2, 500);
  const reduxDescription1 = useSelector(
    (state: RootState) => state.userData.description1
  );
  const reduxDescription2 = useSelector(
    (state: RootState) => state.userData.description2
  );

  const [visibleWordCount, setVisibleWordCount] = useState<1 | 2 | null>(null);

  const handleChangeDescription1 = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLTextAreaElement;
    const newValue = target.value.trimStart();
    setDescription1(newValue);
    dispatch(setDescriptionOne(newValue));
  };

  const handleChangeDescription2 = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLTextAreaElement;
    const newValue = target.value.trimStart();
    setDescription2(newValue);
    dispatch(setDescriptionTwo(newValue));
  };

  const setReduxValue = async () => {
    const validation = validateDescriptions(description1, description2);

    if (validation.errorMessage) {
      setDescription1Error(validation.desc1Error);
      setDescription2Error(validation.desc2Error);
      setError(validation.errorMessage);
      return;
    }

    setDescription1Error(false);
    setDescription2Error(false);
    setError(null);
    setLoading(true);

    await updateDescriptions("description1", description1);
    await updateDescriptions("description2", description2);

    dispatch(setDescriptionOne(description1));
    dispatch(setDescriptionTwo(description2));
    setLoading(false);
    navigate("/contact");
  };

  // Remove these useEffects
  useEffect(() => {
    // Only fetch the initial descriptions once on mount.
    if (!reduxDescription1 && !reduxDescription2) {
      const fetchInitialDescriptions = async () => {
        const result = await getDescriptions();
        if (result) {
          if (result.description1) {
            setDescription1(result.description1);
            dispatch(setDescriptionOne(result.description1));
          }
          if (result.description2) {
            setDescription2(result.description2);
            dispatch(setDescriptionTwo(result.description2));
          }
        }
      };
      fetchInitialDescriptions();
    }
  }, []);

  useEffect(() => {
    if (!loader2 && debouncedDescription2) {
      updateDescriptions("description2", debouncedDescription2);
      dispatch(setDescriptionTwo(debouncedDescription2));
    }
  }, [debouncedDescription2, dispatch, loader2]);

  const handleAIWrite = async (type: 1 | 2) => {
    if (type === 1) {
      setLoader1(true);
      setLoader2(false);
      setDescription1("");
    } else {
      setLoader2(true);
      setLoader1(false);
      setDescription2("");
    }
    setError(null);

    if (type === 2 && !description1) {
      setError("Description  is required ");
      setDescription1Error(true);
      setLoader1(false);
      setLoader2(false);
      return;
    } else if (type === 2 && description1.length <= 25) {
      setError("Description must have atleast 25 characters");
      setDescription1Error(true);
      setDescription2Error(false);
      setLoader1(false);
      setLoader2(false);
      return;
    }

    try {
      const response = await checkWordCount();
      if (!response) {
        setwordLimitError(true);
        return;
      } else if (
        response === "pending" ||
        response === "canceled" ||
        response === "overdue" ||
        response === "expired"
      ) {
        setPlanExpired(true);
        return;
      }
    } catch (error) {
      console.error("Error checking word count:", error);
      setIssue(true);
      return;
    }

    setVisibleWordCount(type);

    try {
      const reader = await fetchDescriptionStream(
        dispatch,
        businessName,
        category,
        type,
        description1 || "", // Ensure a default empty string is passed
        description2 || "",
        type === 1 ? description1 : description2
        // Pass previous content correctly
      );

      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = "";
      let completeDescription = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop()!;

        for (const line of lines) {
          if (line.trim()) {
            try {
              if (line === "data: [DONE]") {
                const wordCount = completeDescription.split(/\s+/).length;
                await updateWordCount(wordCount, templateList.id);

                setLoader1(false);
                setLoader2(false);

                // Inside `handleAIWrite` function
                setVisibleWordCount(type);

                setTimeout(() => {
                  if (visibleWordCount === type) {
                    setVisibleWordCount(null);
                  }
                }, 7000);

                return;
              }

              const json = JSON.parse(line.replace(/^data: /, ""));
              const deltaContent = json.choices[0]?.delta?.content || "";

              if (type === 1) {
                setDescription1((prev) => {
                  const newDescription = prev + deltaContent;
                  completeDescription = newDescription;
                  dispatch(setDescriptionOne(newDescription));

                  setDescription1(newDescription);
                  return newDescription;
                });
              } else {
                setDescription2((prev) => {
                  const newDescription = prev + deltaContent;
                  completeDescription = newDescription;
                  dispatch(setDescriptionTwo(newDescription));
                  setTimeout(() => {
                    if (visibleWordCount === type) {
                      setVisibleWordCount(null);
                    }
                  }, 1000);
                  setDescription2(newDescription);
                  return newDescription;
                });
              }
            } catch (err) {
              console.error("Error parsing JSON:", err);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching streaming data:", error);

      setLoader1(false);
      setLoader2(false);
    }
  };

  useEffect(() => {
    // If Redux already has the descriptions, use them.
    if (reduxDescription1 || reduxDescription2) {
      if (reduxDescription1) setDescription1(reduxDescription1);
      if (reduxDescription2) setDescription2(reduxDescription2);
    } else {
      // Otherwise, fetch from the API.
      const fetchInitialDescriptions = async () => {
        const result = await getDescriptions();
        if (result) {
          if (result.description1) {
            setDescription1(result.description1);
            dispatch(setDescriptionOne(result.description1));
          }
          if (result.description2) {
            setDescription2(result.description2);
            dispatch(setDescriptionTwo(result.description2));
          }
        }
      };

      fetchInitialDescriptions();
    }
  }, [reduxDescription1, reduxDescription2, dispatch]);

  return (
    <Fragment>
      {wordLimitError && (
        <UpgradePopup
          alertType={"wordLimit"}
          onClose={() => {
            setwordLimitError(false);
            setLoader1(false);
            setLoader2(false);
          }}
        />
      )}
      {planExpired && (
        <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-xl bg-opacity-50 z-50">
          <PlanExpired />
        </div>
      )}
      <div className="bg-[#F9FCFF] h-full flex flex-col justify-between overflow-hidden ">
        <div className="h-full px-10 pt-10 overflow-x-hidden overflow-y-auto">
          {issue && <SomethingWrong />}

          <DescriptionHeader businessName={businessName} />

          <form
            className="mt-8 "
            onSubmit={(e) => e.preventDefault()}
            onKeyDown={(event) =>
              handleEnterKey({
                event,
                callback: setReduxValue,
              })
            }
          >
            <DescriptionInput
              number="1"
              label="What do you offer / sell?"
              placeholder="We offer healthy and convenient meal options for busy individuals"
              value={description1}
              onChange={handleChangeDescription1}
              onAIWrite={() => handleAIWrite(1)}
              onEnterKey={setReduxValue}
              className={getInputClass(
                "des1",
                description1Error,
                description2Error
              )}
              isLoading={loader1}
              isDisabled={loader1 || loader2}
              hasError={description1Error}
              errorMessage={description1Error ? error : undefined}
            />

            <DescriptionInput
              number="2"
              label="What actions do visitors need to take to get started?"
              placeholder="Visit our shop, explore our menu, and place your order in-store or online."
              value={description2}
              onChange={handleChangeDescription2}
              onAIWrite={() => handleAIWrite(2)}
              onEnterKey={setReduxValue}
              className={getInputClass(
                "des2",
                description1Error,
                description2Error
              )}
              isLoading={loader2}
              isDisabled={loader1 || loader2}
              hasError={description2Error}
              errorMessage={description2Error ? error : undefined}
            />
          </form>
        </div>

        <NavigationButton
          onContinue={setReduxValue}
          isLoading={loading}
          isDisabled={loader1 || loader2 || loading}
        />
      </div>
    </Fragment>
  );
}

export default Description;
