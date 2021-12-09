import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export enum ModalScreen {
  "Features",
  "ServiceSelections",
  "Help",
  "Confirmation",
  "BookingForm",
  "RescheduleForm",
}

export type ModalScreenType = {
  component: React.FC<any>;
  title: string;
  previousScreen: ModalScreen | undefined;
  disableSwipe?: boolean;
  colorSchema?: string;
  useTextNavigationButtons?: boolean;
  disableCloseButton?: boolean;
  disableBackButton?: boolean;
};

export type ModalScreenNavigationParams = {
  screen: ModalScreen;
  params: Record<string, unknown>;
};

export type RouteNavigationParams = {
  route: string | undefined;
  params: Record<string, unknown>;
};

export type FeatureModalScreenProp = RouteProp<any, "FeatureModal">;
export type FeatureModalNavigationProp = StackNavigationProp<
  any,
  "FeatureModal"
>;
