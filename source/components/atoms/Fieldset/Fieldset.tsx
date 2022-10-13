import React from "react";

import HelpButton from "../../molecules/HelpButton";

import {
  FieldsetContainer,
  FieldsetHeader,
  FieldsetHeaderSection,
  FieldsetBody,
  FieldsetLegend,
  FieldsetLegendBorder,
} from "./Fieldset.styled";

import type { Props } from "./Fieldset.types";

const Fieldset: React.FC<Props> = ({
  children,
  legend,
  help,
  colorSchema = "blue",
  renderHeaderActions,
  empty = false,
}) => (
  <FieldsetContainer colorSchema={colorSchema} empty={empty}>
    <FieldsetHeader>
      <FieldsetHeaderSection justifyContent="flex-start">
        <FieldsetLegendBorder colorSchema={colorSchema}>
          <FieldsetLegend colorSchema={colorSchema}>
            {legend.toUpperCase()}
          </FieldsetLegend>
        </FieldsetLegendBorder>
      </FieldsetHeaderSection>
      <FieldsetHeaderSection justifyContent="flex-end">
        {help && Object.keys(help).length > 0 && (
          <HelpButton
            text={help.text}
            heading={help.heading}
            tagline={help.tagline}
            url={help.url}
          />
        )}
        {renderHeaderActions && renderHeaderActions()}
      </FieldsetHeaderSection>
    </FieldsetHeader>
    <FieldsetBody>{children}</FieldsetBody>
  </FieldsetContainer>
);

export default Fieldset;
