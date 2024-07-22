import React from "react";

interface IStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: IStepIndicatorProps) => {
  const stepStyles = {
    display: "inline-block",
    width: "30px",
    height: "30px",
    lineHeight: "30px",
    borderRadius: "50%",
    textAlign: "center" as const,
    margin: "5px",
    color: "white",
    backgroundColor: "#aaa",
  };

  const activeStepStyles = {
    ...stepStyles,
    backgroundColor: "blue",
  };

  const steps = [];
  for (let step = 1; step <= totalSteps; step++) {
    steps.push(
      <div
        key={step}
        style={step === currentStep ? activeStepStyles : stepStyles}
      >
        {step}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        gap: "1rem",
      }}
    >
      {steps}
    </div>
  );
};

export default StepIndicator;
