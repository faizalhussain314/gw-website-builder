import React, { useState, useEffect } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useLocation } from "react-router-dom";

const steps = [
  {
    step: 1,
    label: "Type",
    description: `
    Select who this website is for`,
    link: "/type",
  },
  {
    step: 2,
    label: "Name",
    description: "What is the name?",
    link: "/name",
  },
  {
    step: 3,
    label: "Describe",
    description: "Some details please",
    link: "/description",
  },

  {
    step: 5,
    label: "Contact",
    description: "How can people get in touch",
    link: "/contact",
  },
  {
    step: 6,
    label: "Design",
    description: "Choose a structure for your website",
    link: "/design",
  },
];

const SideStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleReset = () => {
    setActiveStep(0);
  };

  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;

    const stepIndex = steps.findIndex((step) => step.link === path);
    if (stepIndex !== -1) {
      setActiveStep(stepIndex);
    }
    if (path == "/processing") {
      setActiveStep(7);
    } else if (path == "/success") {
      setActiveStep(7);
    }
  }, [location.pathname]);

  return (
    <div>
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        style={{ padding: "25px 20px" }}
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 5 ? (
                  <Typography variant="caption"> </Typography>
                ) : null
              }
            >
              <Typography className="!font-medium text-txt-black-600 tracking-[-0.32px] text-base">
                {step.label}
              </Typography>
              <Typography className="!text-sm !font-light text-[#88898A]">
                {step.description}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
};

export default SideStepper;
