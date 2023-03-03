/* eslint-disable import/no-unused-modules */
import { useEffect, useRef, useState } from "react";
import type { AppStateStatus } from "react-native";
import { AppState as RNAppState } from "react-native";

export interface AppState {
  isInForeground: boolean;
}

function isAppStateInForeground(appState: AppStateStatus): boolean {
  return appState !== "background";
}

export default function useAppState(): AppState {
  const appState = useRef(RNAppState.currentState);
  const [isInForeground, setIsInForeground] = useState(
    isAppStateInForeground(appState.current)
  );

  useEffect(() => {
    const subscription = RNAppState.addEventListener(
      "change",
      (nextAppState) => {
        appState.current = nextAppState;
        setIsInForeground(isAppStateInForeground(appState.current));
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    isInForeground,
  };
}
