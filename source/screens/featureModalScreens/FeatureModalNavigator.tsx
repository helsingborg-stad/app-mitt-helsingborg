import React, { useState, useMemo } from "react";

import BottomModal from "../../components/molecules/BottomModal";

import Features from "./Features";
import ServiceSelection from "./ServiceSelection";

import {
  ModalScreen,
  FeatureModalNavigationProp,
  FeatureModalScreenProp,
  ModalScreenType,
  ModalScreenNavigationParams,
  RouteNavigationParams,
} from "./types";

const Modal: Record<string, ModalScreenType> = {
  [ModalScreen.Features]: {
    component: Features,
    title: "Vad vill du göra?",
    previousScreen: undefined,
  },
  [ModalScreen.ServiceSelections]: {
    component: ServiceSelection,
    title: "Vem vill du träffa?",
    previousScreen: ModalScreen.Features,
  },
  [ModalScreen.Help]: {
    component: Features,
    title: "Vad vill du ha hjälp med?",
    previousScreen: ModalScreen.Features,
  },
};

interface Props {
  navigation: FeatureModalNavigationProp;
  route: FeatureModalScreenProp;
}

const FeatureModalNavigator = ({ navigation, route }: Props): JSX.Element => {
  const { startScreen = ModalScreen.Features } = route?.params || {};

  const [modalScreen, setModalScreen] = useState<ModalScreenNavigationParams>({
    screen: startScreen,
    params: {},
  });
  const [nextRoute, setNextRoute] = useState<RouteNavigationParams>({
    route: undefined,
    params: {},
  });
  const [isVisible, setIsVisible] = useState(true);

  const modalScreenObject = Modal[modalScreen.screen];
  const navigatorTitle = modalScreenObject.title;
  const ModalContent = useMemo(
    () => modalScreenObject.component,
    [modalScreenObject.component]
  );

  const navigate = (
    newRoute: string,
    newParams: Record<string, unknown> = {}
  ) => {
    setNextRoute({ route: newRoute, params: newParams });
    setIsVisible(false);
  };

  const changeModalScreen = (
    screen: ModalScreen | undefined,
    params: Record<string, unknown> = {}
  ) => {
    if (screen) {
      setModalScreen({ screen, params });
    }
  };

  const onModalHide = () => {
    if (nextRoute?.route) {
      navigation.navigate(nextRoute.route, nextRoute.params);
    } else {
      navigation.goBack();
    }
  };

  const onClose = () => setIsVisible(false);

  const goBack = modalScreenObject.previousScreen
    ? () => changeModalScreen(modalScreenObject.previousScreen)
    : undefined;

  return (
    <BottomModal
      visible={isVisible}
      onClose={onClose}
      onModalHide={onModalHide}
      modalTitle={navigatorTitle}
      onBack={goBack}
      propagateSwipe={modalScreenObject.propagateSwipe}
      colorSchema={modalScreenObject.colorSchema}
    >
      <ModalContent
        onNavigate={navigate}
        onChangeModalScreen={changeModalScreen}
        route={{ name: modalScreen.screen, params: modalScreen.params }}
      />
    </BottomModal>
  );
};

export default FeatureModalNavigator;
