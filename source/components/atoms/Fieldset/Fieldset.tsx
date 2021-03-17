import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Text from '../Text/Text';
import Button from '../Button';
import { Help } from '../../../types/FormTypes';
import HelpButton from '../../molecules/HelpButton';

interface FieldsetContainerProps {
  colorSchema: string;
  empty?: boolean;
}

const FieldsetContainer = styled.View<FieldsetContainerProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  border-radius: 9.5px;
  overflow: hidden;
  margin-bottom: 24px;
  margin-top: 16px;
  padding: 16px;
  background: ${(props) =>
    props?.empty
      ? props.theme.fieldset[props.colorSchema].backgroundEmpty
      : props.theme.fieldset[props.colorSchema].background};
`;

const FieldsetHeader = styled.View`
  padding-left: 4px;
  position: relative;
  flex-direction: row;
`;

export const FieldsetButton = styled(Button)`
  margin-left: 26px;
`;

interface FieldsetHeaderSectionProps {
  justifyContent: string;
}

const FieldsetHeaderSection = styled.View<FieldsetHeaderSectionProps>`
  flex: 1;
  flex-direction: row;
  justify-content: ${(props) => props.justifyContent};
  align-items: center;
`;

const FieldsetBody = styled.View``;

interface FieldsetLegendProps {
  colorSchema: string;
}

const FieldsetLegend = styled(Text)<FieldsetLegendProps>`
  color: ${(props) => props.theme.fieldset[props.colorSchema].legend}
  font-size: 12px;
  padding-bottom: 12px;
  font-weight: bold;
  padding-top: 8px;
`;

interface FieldsetLegendBorderProps {
  colorSchema: string;
}

const FieldsetLegendBorder = styled.View<FieldsetLegendBorderProps>`
  border-bottom-color: ${(props) => props.theme.fieldset[props.colorSchema].legendBorder}
  border-bottom-width: 2px;
  align-self: flex-start;
`;

interface FieldsetProps {
  legend: string;
  colorSchema: string;
  empty?: boolean;
  help?: Help;
  renderHeaderActions?: () => void;
}

const Fieldset: React.FC<FieldsetProps> = ({
  children,
  legend,
  help,
  colorSchema,
  renderHeaderActions,
  empty,
}) => (
  <FieldsetContainer colorSchema={colorSchema} empty={empty}>
    <FieldsetHeader>
      <FieldsetHeaderSection justifyContent="flex-start">
        <FieldsetLegendBorder colorSchema={colorSchema}>
          <FieldsetLegend colorSchema={colorSchema}>{legend.toUpperCase()}</FieldsetLegend>
        </FieldsetLegendBorder>
      </FieldsetHeaderSection>
      <FieldsetHeaderSection justifyContent="flex-end">
        {help && Object.keys(help).length > 0 && <HelpButton {...help} />}
        {renderHeaderActions && renderHeaderActions()}
      </FieldsetHeaderSection>
    </FieldsetHeader>
    <FieldsetBody>{children}</FieldsetBody>
  </FieldsetContainer>
);

Fieldset.propTypes = {
  empty: PropTypes.bool,
  /**
   * Show a help button
   */
  help: PropTypes.shape({
    text: PropTypes.string,
    size: PropTypes.number,
    heading: PropTypes.string,
    tagline: PropTypes.string,
    url: PropTypes.string,
  }),
  renderHeaderActions: PropTypes.func,
  colorSchema: PropTypes.string,
  legend: PropTypes.string,
  children: PropTypes.node,
};

Fieldset.defaultProps = {
  colorSchema: 'blue',
};

export default Fieldset;
