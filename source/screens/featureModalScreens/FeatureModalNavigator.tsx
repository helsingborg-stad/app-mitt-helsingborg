import React, { useState, useMemo } from "react";

import BottomModal from "../../components/molecules/BottomModal";

// import { BookingFormScreen, BookingSummary } from "..";

import Features from "./Features";
import ServiceSelection from "./ServiceSelection";

import {
  ModalScreen,
  FeatureModalNavigationProp,
  FeatureModalScreenProp,
  ModalScreenType,
} from "./types";

const Modal: Record<string, ModalScreenType> = {
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
  // [ModalScreen.Confirmation]: {
  //   component: BookingSummary,
  //   title: "Möte bokat",
  //   propagateSwipe: true,
  //   colorSchema: "red",
  // },
  // [ModalScreen.BookingForm]: {
  //   component: BookingFormScreen,
  //   title: "Boka möte",
  //   propagateSwipe: true,
  //   colorSchema: "red",
  // },
};

interface Props {
  navigation: FeatureModalNavigationProp;
  route: FeatureModalScreenProp;
}
const FeatureModalNavigator = ({ navigation, route }: Props): JSX.Element => {
  const { startScreen = ModalScreen.Features } = route?.params || {};

  const [screenIndex, setScreenIndex] = useState<ModalScreen>(startScreen);
  const [modalScreenParams, setModalScreenParams] = useState({});
  const [isVisible, setIsVisible] = useState(true);
  const [nextRoute, setNextRoute] = useState<string>("");
  const [nextParams, setNextParams] = useState({});

  const navigate = (
    newRoute: string,
    newParams: Record<string, unknown> = {}
  ) => {
    setNextRoute(newRoute);
    setNextParams(newParams);
    setIsVisible(false);
  };

  const changeModalScreen = (
    screen: ModalScreen,
    params: Record<string, unknown> = {}
  ) => {
    setModalScreenParams(params);
    setScreenIndex(screen);
  };

  const onModalHide = () => {
    if (nextRoute) {
      navigation.navigate(nextRoute, nextParams);
    } else {
      navigation.goBack();
    }
  };

  const onClose = () => setIsVisible(false);

  const goBack =
    startScreen < screenIndex
      ? () => setScreenIndex((currentIndex) => currentIndex - 1)
      : undefined;

  const modalScreen = Modal[screenIndex];
  const navigatorTitle = modalScreen.title;
  const ModalContent = useMemo(
    () => modalScreen.component,
    [modalScreen.component]
  );

  return (
    <BottomModal
      visible={isVisible}
      onClose={onClose}
      onModalHide={onModalHide}
      modalTitle={navigatorTitle}
      onBack={goBack}
      propagateSwipe={modalScreen.propagateSwipe}
      colorSchema={modalScreen.colorSchema}
    >
      <ModalContent
        onNavigate={navigate}
        onChangeModalScreen={changeModalScreen}
        route={{ name: screenIndex, params: modalScreenParams }}
      />
    </BottomModal>
  );
};

export default FeatureModalNavigator;
