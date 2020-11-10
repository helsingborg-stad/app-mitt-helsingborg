import React from 'react';
import styled from 'styled-components/native';
import Text from '../Text/Text';
import Icon from '../Icon';
import Button from '../Button';

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
  padding-bottom: 20px;
  padding-top: 16px;
  padding-left: 16px;
  padding-right: 16px;
  background: ${props =>
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
  justify-content: ${props => props.justifyContent};
  align-items: center;
`;

const FieldsetBody = styled.View``;

interface FieldsetLegendProps {
  colorSchema: string;
}

const FieldsetLegend = styled(Text)<FieldsetLegendProps>`
  color: ${props => props.theme.fieldset[props.colorSchema].legend}
  font-size: 12px;
  padding-bottom: 12px;
  font-weight: bold;
  padding-top: 8px;
`;

interface FieldsetLegendBorderProps {
  colorSchema: string;
}

const FieldsetLegendBorder = styled.View<FieldsetLegendBorderProps>`
  border-bottom-color: ${props => props.theme.fieldset[props.colorSchema].legendBorder}
  border-bottom-width: 2px;
  align-self: flex-start;
`;

interface FieldsetProps {
  children: React.ReactNode;
  legend: string;
  onIconPress?: () => void;
  iconName?: string;
  iconSize?: number;
  colorSchema: string;
  empty?: boolean;
  renderHeaderActions?: () => void;
}

function Fieldset({
  children,
  legend,
  onIconPress,
  iconName,
  iconSize,
  colorSchema,
  renderHeaderActions,
  empty,
}: FieldsetProps) {
  const showIcon = onIconPress && iconName;
  return (
    <FieldsetContainer colorSchema={colorSchema} empty={empty}>
      <FieldsetHeader>
        <FieldsetHeaderSection justifyContent="flex-start">
          <FieldsetLegendBorder colorSchema={colorSchema}>
            <FieldsetLegend colorSchema={colorSchema}>{legend.toUpperCase()}</FieldsetLegend>
          </FieldsetLegendBorder>
        </FieldsetHeaderSection>

        <FieldsetHeaderSection justifyContent="flex-end">
          {showIcon && <Icon onPress={onIconPress} name={iconName} size={iconSize} />}
          {renderHeaderActions && renderHeaderActions()}
        </FieldsetHeaderSection>
      </FieldsetHeader>
      <FieldsetBody>{children}</FieldsetBody>
    </FieldsetContainer>
  );
}

Fieldset.defaultProps = {
  colorSchema: 'blue',
  iconName: undefined,
  renderHeaderActions: undefined,
  iconSize: 22,
};

export default Fieldset;
