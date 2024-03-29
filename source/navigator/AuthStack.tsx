import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/loginScreen/LoginScreen";
import Onboarding from "../screens/onboarding";
import StorageService, {
  ONBOARDING_DISABLED,
} from "../services/storage/StorageService";

const Stack = createNativeStackNavigator();

const AuthStack = (): JSX.Element | null => {
  const [initialRouteName, setInitialRouteName] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const trySetInitialRouteName = async () => {
      const isOnboardingDisabled = await StorageService.getData(
        ONBOARDING_DISABLED
      );
      const route = isOnboardingDisabled ? "Login" : "Onboarding";

      setInitialRouteName(route);
    };

    void trySetInitialRouteName();
  }, []);

  if (initialRouteName === undefined) {
    return null;
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
