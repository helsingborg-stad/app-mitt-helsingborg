import React from 'react';
import styled from 'styled-components/native';
import Text from '../Text/Text';
import Icon from '../Icon';

interface FieldsetContainerProps {
  colorSchema: string;
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
  background: ${props => props.theme.colors.complementary[props.colorSchema][3]};
`;

const FieldsetHeader = styled.View`
  padding-left: 4px;
  position: relative;
  flex-direction: row;
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
  color: ${props => props.theme.colors.primary[props.colorSchema][0]}
  font-size: 12px;
  padding-bottom: 12px;
  font-weight: bold;
  padding-top: 8px;
`;

interface FieldsetLegendBorderProps {
  colorSchema: string;
}

const FieldsetLegendBorder = styled.View<FieldsetLegendBorderProps>`
  border-bottom-color: ${props => props.theme.colors.complementary[props.colorSchema][1]}
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
}: FieldsetProps) {
  const showIcon = onIconPress && iconName;
  return (
    <FieldsetContainer colorSchema={colorSchema}>
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
