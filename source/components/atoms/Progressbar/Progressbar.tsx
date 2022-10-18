import React from "react";

import { ProgressbarBox, ProgressbarBackground } from "./Progressbar.styled";

import type { Props } from "./Progressbar.types";

const Progressbar: React.FC<Props> = ({
  currentStep,
  colorSchema = "neutral",
  totalStepNumber,
  rounded = false,
}) => {
  const percentage = (100 * currentStep) / totalStepNumber;
  return (
    <ProgressbarBackground colorSchema={colorSchema} rounded={rounded}>
      <ProgressbarBox
        rounded={rounded}
        colorSchema={colorSchema}
        percentage={percentage}
      />
    </ProgressbarBackground>
  );
};

export default Progressbar;
