import React, { useState, useMemo } from "react";

import BottomModal from "../../components/molecules/BottomModal";

import { BookingFormScreen, BookingSummary } from "..";

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
import RescheduleFormScreen from "../bookingScreens/RescheduleFormScreen";

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
  [ModalScreen.Confirmation]: {
    component: BookingSummary,
    title: "Möte bokat",
    propagateSwipe: true,
    colorSchema: "red",
    previousScreen: undefined,
    useTextNavigationButtons: true,
  },
  [ModalScreen.BookingForm]: {
    component: BookingFormScreen,
    title: "Boka möte",
    propagateSwipe: true,
    colorSchema: "red",
    previousScreen: ModalScreen.ServiceSelections,
    disableCloseButton: true,
    useTextNavigationButtons: true,
  },
  [ModalScreen.RescheduleForm]: {
    component: RescheduleFormScreen,
    title: "Boka om",
    propagateSwipe: true,
    colorSchema: "red",
    previousScreen: ModalScreen.ServiceSelections,
    disableCloseButton: true,
    useTextNavigationButtons: true,
  },
};

interface Props {
  navigation: FeatureModalNavigationProp;
  route: FeatureModalScreenProp;
}

const FeatureModalNavigator = ({ navigation, route }: Props): JSX.Element => {
  const { startScreen = ModalScreen.Features, startParams = {} } =
    route?.params || {};

  const [modalScreen, setModalScreen] = useState<ModalScreenNavigationParams>({
    screen: startScreen,
    params: startParams,
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
      onClose={modalScreenObject.disableCloseButton ? undefined : onClose}
      onModalHide={onModalHide}
      modalTitle={navigatorTitle}
      onBack={goBack}
      propagateSwipe={modalScreenObject.propagateSwipe}
      colorSchema={modalScreenObject.colorSchema}
      backButtonText={
        modalScreenObject.useTextNavigationButtons ? "AVBRYT" : undefined
      }
      closeButtonText={
        modalScreenObject.useTextNavigationButtons ? "KLAR" : undefined
      }
    >
      <ModalContent
        onNavigate={navigate}
        onChangeModalScreen={changeModalScreen}
        closeModal={onClose}
        route={{ name: modalScreen.screen, params: modalScreen.params }}
      />
    </BottomModal>
  );
};

export default FeatureModalNavigator;
