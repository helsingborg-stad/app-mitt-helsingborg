import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Onboarding from "../screens/onboarding";
import LoginScreen from "../screens/LoginScreen";
import StorageService, {
  ONBOARDING_DISABLED,
} from "../services/StorageService";

const Stack = createStackNavigator();

const AuthStack = (): JSX.Element | null => {
  const [initialRouteName, setInitialRouteName] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const trySetInitialRouteName = async () => {
      const isDisabled = await StorageService.getData(ONBOARDING_DISABLED);
      const route = isDisabled ? "Login" : "Onboarding";

      setInitialRouteName(route);
    };

    void trySetInitialRouteName();
  }, []);

  if (initialRouteName === undefined) return null;

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
