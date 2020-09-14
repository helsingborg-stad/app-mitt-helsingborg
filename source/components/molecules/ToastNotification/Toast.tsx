import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import styled from "styled-components/native";
import { TouchableHighlight } from "react-native-gesture-handler";

import Icon from "../../atoms/Icon/Icon";
import styles from "./styles";

const BaseContainer = styled.View`
  position: absolute;
  z-index: 1000;
  top: ${(props) => (props.top ? `${props.top}px` : "40px")};
  left: 15%;
  right: 15%;
  bottom: 0;
  height: 60px;
  padding: 2px;
  width: 70%;
  background-color: white;
  flex-direction: row;
  border-radius: 6px;
  shadow-offset: 0 0;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
`;
const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
`;
const CloseButtonContainer = styled.TouchableHighlight`
  padding-horizontal: 14px;
  align-items: center;
  justify-content: center;
`;
const PrimaryText = styled(Text)`
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 3px;
`;
const SecondaryText = styled(Text)`
  font-size: 10px;
  color: #333333;
  margin-bottom: 3px;
`;
// text1: {
//   fontSize: 12,
//   fontWeight: "bold",
//   marginBottom: 3,
// },
// text2: {
//   fontSize: 10,
//   color: colors.text.darker,
// },

interface Props {
  color: string;
  icon: string;
  text1: string;
  text2: string;
  index: number;
  onClose: () => void;
}

const BaseToast: React.FC<Props> = ({
  color,
  icon,
  text1,
  text2,
  index,
  onClose,
}) => (
  <BaseContainer top={40 + 70 * index}>
    {icon ? (
      <CloseButtonContainer>
        <Icon name={icon} />
      </CloseButtonContainer>
    ) : null}
    <ContentContainer>
      {text1 !== undefined && (
        <View>
          <PrimaryText numberOfLines={1}>{text1}</PrimaryText>
        </View>
      )}
      {text2 !== undefined && (
        <View>
          <SecondaryText numberOfLines={2}>{text2}</SecondaryText>
        </View>
      )}
    </ContentContainer>
    <CloseButtonContainer>
      <TouchableHighlight activeOpacity={1} onPress={onClose}>
        <Icon name="close" />
      </TouchableHighlight>
    </CloseButtonContainer>
  </BaseContainer>
);

export default BaseToast;
