import React from "react";

import HelpButton from "../../molecules/HelpButton";

import { getValidColorSchema } from "../../../theme/themeHelpers";

import {
  LabelText,
  LabelBorder,
  LabelContainer,
  LabelWrapper,
  HelpWrapper,
} from "./Label.styled";

import type { Props } from "./Label.types";

const Label: React.FC<Props> = ({
  size = "medium",
  colorSchema = "blue",
  underline = true,
  style,
  help,
  children,
}) => {
  const validColorSchema = getValidColorSchema(colorSchema);
  return (
    <LabelContainer>
      <LabelWrapper>
        <LabelBorder size={size} color={validColorSchema} underline={underline}>
          <LabelText size={size} color={validColorSchema} style={style}>
            {children}
          </LabelText>
        </LabelBorder>
      </LabelWrapper>
      {help && Object.keys(help).length > 0 && (
        <HelpWrapper>
          <HelpButton
            url={help.url}
            heading={help.heading}
            text={help.text}
            tagline={help.tagline}
            size={help.size}
          />
        </HelpWrapper>
      )}
    </LabelContainer>
  );
};

export default Label;
