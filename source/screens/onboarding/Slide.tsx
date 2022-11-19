import React from "react";
import styled from "styled-components/native";
import { Platform, Dimensions, View, Image } from "react-native";

import ILLUSTRATION from "../../assets/images/illustrations";

const Heading = styled.Text`
  font-size: 18px;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: 0.025px;
  color: ${(props) => props?.headingColor || "#003359"};
  padding-top: 24px;
`;

const SliderContainer = styled.View`
  padding-top: 20px;
  padding-left: 58px;
  padding-right: 58px;
  width: ${Dimensions.get("window").width}px;
`;

const CoatOfArms = styled.Image`
  height: 53px;
  width: 34px;
`;

const HorizontalRule = styled.View`
  padding-top: 16px;
  width: 32px;
  border-bottom-width: 2px;
  border-bottom-color: rgba(0, 0, 0, 0.48);
`;

const SliderImageContainer = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: flex-end;
`;

const TitleContainer = styled.View`
  height: 100px;
  flex-direction: row;
  flex: 1;
  padding-top: 8px;
`;

const Title = styled.Text`
  font-size: 26px;
  line-height: 40px;
  font-weight: ${Platform.OS === "android" ? "bold" : "900"};
  color: #000000;
  text-align: left;
`;

const Content = styled.Text`
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
  padding-top: 16px;
`;

interface SliderPropsInterface {
  title: string;
  content: string;
  picture?: number;
  headingColor?: string;
}

const Slide = ({
  headingColor,
  title,
  content,
  picture,
}: SliderPropsInterface) => (
  <SliderContainer>
    <View>
      <CoatOfArms source={ILLUSTRATION.STADSVAPEN} />
      <Heading headingColor={headingColor}>Mitt Helsingborg</Heading>
      <HorizontalRule />
    </View>
    <SliderImageContainer>
      <Image
        source={picture}
        style={{
          flex: 1,
          width: null,
          height: null,
          resizeMode: "contain",
        }}
        resizeMode="cover"
      />
    </SliderImageContainer>
    <TitleContainer>
      <Title>{title}</Title>
    </TitleContainer>
    <Content>{content}</Content>
  </SliderContainer>
);

export default Slide;
