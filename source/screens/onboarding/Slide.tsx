import React from "react";
import { View, Image } from "react-native";

import ILLUSTRATION from "../../assets/images/illustrations";

import {
  Heading,
  SliderContainer,
  CoatOfArms,
  HorizontalRule,
  SliderImageContainer,
  TitleContainer,
  Content,
  Title,
} from "./Slide.styled";

import type { SlideProps } from "./Slide.types";

const Slide = ({
  headingColor,
  title,
  content,
  picture,
}: SlideProps): JSX.Element => (
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
          width: "100%",
          height: "100%",
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
