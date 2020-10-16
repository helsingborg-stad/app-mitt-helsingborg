import React from "react";
import styled from "styled-components/native";
import Text from "../Text/Text";
import Icon from "../Icon";

const FieldsetContainer = styled.View`
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
  background: #faeeec;
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
  align-items: ${(props) => props.alignItems};
`;

const FieldsetBody = styled.View``;

const FieldsetIcon = styled(Icon)`
  margin-top: -5px;
`;

const FieldsetLegend = styled(Text)`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.8);
  padding-bottom: 12px;
  font-weight: bold;
`;

const FieldsetLegendBorder = styled.View`
  border-bottom-color: rgba(0,0,0,0.2);
  border-bottom-width: 2px
  align-self: flex-start;
`;

interface FieldsetProps {
  children: React.ReactNode;
  legend: string;
  onIconPress?: () => void;
  iconName?: string;
  iconSize?: number;
}

export default function Fieldset({
  children,
  legend,
  onIconPress,
  iconName,
  iconSize,
}: FieldsetProps) {
  const showIcon = onIconPress && iconName;
  return (
    <FieldsetContainer>
      <FieldsetHeader>
        <FieldsetHeaderSection alignItems="flex-start">
          <FieldsetLegendBorder>
            <FieldsetLegend>{legend.toUpperCase()}</FieldsetLegend>
          </FieldsetLegendBorder>
        </FieldsetHeaderSection>

        <FieldsetHeaderSection alignItems="flex-end">
          {showIcon && (
            <FieldsetIcon
              onPress={onIconPress}
              name={iconName}
              size={iconSize}
            />
          )}
        </FieldsetHeaderSection>
      </FieldsetHeader>
      <FieldsetBody>{children}</FieldsetBody>
    </FieldsetContainer>
  );
}
