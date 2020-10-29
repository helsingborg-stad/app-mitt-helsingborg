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
  padding-top: 20px;
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
  alignItems: string;
}

const FieldsetHeaderSection = styled.View<FieldsetHeaderSectionProps>`
  flex: 1;
  flex-direction: column;
  align-items: ${props => props.alignItems};
`;

const FieldsetBody = styled.View``;

const FieldsetIcon = styled(Icon)`
  margin-top: -5px;
`;


interface FieldsetLegendProps {
  colorSchema: string;
}

const FieldsetLegend = styled(Text)<FieldsetLegendProps>`
  color: ${props=> props.theme.colors.primary[props.colorSchema][0]}
  font-size: 12px;
  padding-bottom: 12px;
  font-weight: bold;
`;

interface FieldsetLegendBorderProps {
  colorSchema: string;
}

const FieldsetLegendBorder = styled.View<FieldsetLegendBorderProps>`
  border-bottom-color: ${props=> props.theme.colors.complementary[props.colorSchema][1]}
  border-bottom-width: 2px
  align-self: flex-start;
`;

interface FieldsetProps {
  children: React.ReactNode;
  legend: string;
  onIconPress?: () => void;
  iconName?: string;
  iconSize?: number;
  colorSchema: string,
}

function Fieldset({
  children,
  legend,
  onIconPress,
  iconName,
  iconSize,
  colorSchema
}: FieldsetProps) {
  const showIcon = onIconPress && iconName;
  return (
    <FieldsetContainer colorSchema={colorSchema}>
      <FieldsetHeader>
        <FieldsetHeaderSection alignItems="flex-start">
          <FieldsetLegendBorder colorSchema={colorSchema}>
            <FieldsetLegend colorSchema={colorSchema}>{legend.toUpperCase()}</FieldsetLegend>
          </FieldsetLegendBorder>
        </FieldsetHeaderSection>

        <FieldsetHeaderSection alignItems="flex-end">
          {showIcon && <FieldsetIcon onPress={onIconPress} name={iconName} size={iconSize} />}
        </FieldsetHeaderSection>
      </FieldsetHeader>
      <FieldsetBody>{children}</FieldsetBody>
    </FieldsetContainer>
  );
}

Fieldset.defaultProps = {
  colorSchema: 'blue',
  iconName: undefined,
}

export default Fieldset;
