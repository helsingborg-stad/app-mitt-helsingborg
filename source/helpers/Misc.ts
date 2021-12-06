import { Dimensions } from "react-native";

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getScreenHeightProportion(proportion: number): number {
  return Math.floor((Dimensions.get("window").height * proportion) / 100);
}
