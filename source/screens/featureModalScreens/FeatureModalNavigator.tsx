import React, { useState, useMemo } from "react";

import BottomModal from "../../components/molecules/BottomModal";

import Features from "./Features";
import ServiceSelection from "./ServiceSelection";

import {
  ModalScreen,
  FeatureModalNavigationProp,
  FeatureModalScreenProp,
} from "./types";

const Modal = {
  [ModalScreen.Features]: {
    component: Features,
    title: "Vad vill du göra?",
  },
  [ModalScreen.ServiceSelections]: {
    component: ServiceSelection,
    title: "Vem vill du träffa?",
  },
  [ModalScreen.Help]: {
    component: Features,
    title: "Vad vill du ha hjälp med?",
  },
};

interface Props {
  navigation: FeatureModalNavigationProp;
  route: FeatureModalScreenProp;
}
const FeatureModalNavigator = ({ navigation, route }: Props): JSX.Element => {
  const { startScreen = ModalScreen.Features } = route?.params || {};

  const [screenIndex, setScreenIndex] = useState<ModalScreen>(startScreen);
  const [isVisible, setIsVisible] = useState(true);
  const [nextRoute, setNextRoute] = useState<string>("");

  const navigate = (newRoute: string) => {
    setNextRoute(newRoute);
    setIsVisible(false);
  };

  const changeModalScreen = (screen: ModalScreen) => {
    setScreenIndex(screen);
  };

  const onModalHide = () => {
    if (nextRoute) {
      navigation.navigate(nextRoute);
    } else {
      navigation.goBack();
    }
  };

  const onClose = () => setIsVisible(false);

  const goBack =
    startScreen < screenIndex
      ? () => setScreenIndex((currentIndex) => currentIndex - 1)
      : undefined;

  const navigatorTitle = Modal[screenIndex].title;
  const ModalContent = useMemo(
    () => Modal[screenIndex].component,
    [screenIndex]
  );

  return (
    <BottomModal
      visible={isVisible}
      onClose={onClose}
      onModalHide={onModalHide}
      modalTitle={navigatorTitle}
      onBack={goBack}
    >
      <ModalContent
        onNavigate={navigate}
        onChangeModalScreen={changeModalScreen}
      />
    </BottomModal>
  );
};

export default FeatureModalNavigator;
