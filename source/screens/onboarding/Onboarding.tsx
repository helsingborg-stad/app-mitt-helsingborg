import React, { useRef, useState } from "react";
import { Dimensions, Platform, StatusBar, View, Animated } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import type { ScrollView } from "react-native";
import type { Props, Navigation } from "./Onboarding.types";

import Dot from "./Dot";
import Slide from "./Slide";
import { Button, Text } from "../../components/atoms";

import { ONBOARDING_DISABLED } from "../../services/StorageService";

import {
  OnboardingContainer,
  AnimatedScrollContainer,
  FooterContainer,
  AnimatedFooterBackground,
  FooterContent,
  FooterPagination,
  SliderContinueButtonContainer,
  SkipButtonContainer,
  ContinueButton,
  ContinueButtonText,
} from "./Onboarding.styled";

const SLIDE_BACKGROUND_ANSOKAN = require("../../assets/images/slides/onboarding_02_ansokan_in_3x.png");
const SLIDE_BACKGROUND_ARENDEN = require("../../assets/images/slides/onboarding_03_arenden_in_3x.png");
const SLIDE_BACKGROUND_KONTAKT = require("../../assets/images/slides/onboarding_04_kontakt_in_3x.png");

const { width } = Dimensions.get("window");

const slides = [
  {
    headingColor: "#003359",
    title: "Gör ansökan för ekonomiskt bistånd",
    content: "",
    colorSchema: "blue",
    color: "#E4EBF0",
    picture: SLIDE_BACKGROUND_ANSOKAN,
  },
  {
    headingColor: "#770000",
    title: "Följ status för ansökan",
    content: "",
    colorSchema: "red",
    color: "#F5E4E3",
    picture: SLIDE_BACKGROUND_ARENDEN,
  },
  {
    headingColor: "#4B0034",
    title: "Läs beslut och få kontaktuppgifter till handläggare",
    content: "",
    colorSchema: "purple",
    color: "#E8DAE4",
    picture: SLIDE_BACKGROUND_KONTAKT,
  },
];

const disableOnboarding = async () => {
  await AsyncStorage.setItem(ONBOARDING_DISABLED, JSON.stringify(true));
};

const navigationResetToLoginScreen = async (navigation: Navigation) => {
  await disableOnboarding();
  navigation.reset({
    index: 0,
    routes: [{ name: "Login" }],
  });
};

const Onboarding = ({ navigation }: Props): JSX.Element => {
  const animatedValue = new Animated.Value(0);

  const [scrollPos, setScrollPos] = useState(0);
  const scroll = useRef<ScrollView>(null);
  const lastScrollPos = width * (slides.length - 2);
  const currentIndex = Math.round(scrollPos / width);

  const backgroundColor = animatedValue.interpolate({
    inputRange: slides.map((_, i) => i * width),
    outputRange: slides.map((slide) => slide.color),
  });

  const animatedStyle = {
    backgroundColor,
  };

  const scrollToPosition = (position: number) => {
    if (scroll.current) {
      scroll.current.scrollTo({
        x: position,
        animated: true,
      });
    }
  };

  const handleButtonClick = () => {
    if (scrollPos <= lastScrollPos) {
      if (Platform.OS === "android") {
        // Fix for Android bug where onMomentumScrollEnd not called when setting scroll with scrollTo.
        setScrollPos(scrollPos + width);
      }

      scrollToPosition(width + scrollPos);
    } else {
      void navigationResetToLoginScreen(navigation);
    }
  };

  return (
    <OnboardingContainer>
      <StatusBar hidden />
      <AnimatedScrollContainer style={animatedStyle}>
        <SkipButtonContainer>
          {scrollPos <= lastScrollPos && (
            <Button
              z={0}
              size="small"
              colorSchema={slides[currentIndex].colorSchema}
              onClick={() => navigationResetToLoginScreen(navigation)}
              variant="link"
            >
              <Text>HOPPA ÖVER</Text>
            </Button>
          )}
        </SkipButtonContainer>
        <Animated.ScrollView
          ref={scroll}
          horizontal
          snapToInterval={width}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onMomentumScrollEnd={(event) => {
            setScrollPos(event.nativeEvent.contentOffset.x);
          }}
          onScroll={(event) => {
            animatedValue.setValue(event.nativeEvent.contentOffset.x);
          }}
        >
          {slides.map(({ headingColor, title, content, picture }) => (
            <Slide key={title} {...{ headingColor, title, content, picture }} />
          ))}
        </Animated.ScrollView>
      </AnimatedScrollContainer>
      <FooterContainer>
        <AnimatedFooterBackground style={animatedStyle} />
        <FooterContent>
          <View>
            <FooterPagination>
              {slides.map((slide, index) => (
                <Dot
                  key={slide.color}
                  currentIndex={Animated.divide(animatedValue, width)}
                  index={index}
                />
              ))}
            </FooterPagination>
          </View>
          <SliderContinueButtonContainer>
            {scrollPos <= lastScrollPos ? (
              <ContinueButton
                z={0}
                colorSchema={slides[currentIndex].colorSchema}
                onClick={handleButtonClick}
              >
                <ContinueButtonText
                  colorSchema={slides[currentIndex].colorSchema}
                >
                  Fortsätt
                </ContinueButtonText>
              </ContinueButton>
            ) : (
              <Button
                z={0}
                colorSchema={slides[currentIndex].colorSchema}
                onClick={handleButtonClick}
              >
                <Text>Logga in</Text>
              </Button>
            )}
          </SliderContinueButtonContainer>
        </FooterContent>
      </FooterContainer>
    </OnboardingContainer>
  );
};

export default Onboarding;
