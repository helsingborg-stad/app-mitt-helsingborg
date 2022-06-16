import React, { useEffect, useReducer, useContext, useCallback } from "react";
import { Alert, Linking } from "react-native";
import env from "react-native-config";
import USER_AUTH_STATE from "../types/UserAuthTypes";
import AppContext from "./AppContext";
import AppCompabilityContext from "./AppCompabilityContext";
import * as authService from "../services/AuthService";
import getApiStatus from "../services/ApiStatusService";

import AuthReducer, {
  initialAuthReducerState,
  AuthReducerState,
} from "./reducers/AuthReducer";
import {
  startAuth,
  cancelOrder,
  loginFailure,
  loginSuccess,
  refreshSession,
  checkOrderStatus,
  removeProfile,
  addProfile,
  mockedAuth,
  startSign,
  setStatus,
  setError,
  setAuthenticateOnExternalDevice,
  setApiStatusMessage,
} from "./actions/AuthActions";

import { DispatchError } from "./actions/AuthActions.types";

interface UseAuthProviderState extends AuthReducerState {
  isLoading: boolean;
  isIdle: boolean;
  isResolved: boolean;
  isRejected: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
  handleRefreshSession: () => void;
  handleAddProfile: () => void;
  handleAuth: (
    personalNumber: string,
    authenticateOnExternalDevice: boolean
  ) => void;
  handleCancelOrder: () => void;
  handleSetStatus: (stsatus: string) => void;
  isAccessTokenValid: () => Promise<boolean>;
  handleSign: (
    personalNumber: string,
    userVisibleData: string,
    authenticateOnExternalDevice: boolean
  ) => Promise<void>;
  handleSetError: (error: DispatchError) => void;
}

const initialAuthProviderState: UseAuthProviderState = {
  ...initialAuthReducerState,
  isLoading: false,
  isIdle: false,
  isResolved: false,
  isRejected: false,
  handleLogin: () => true,
  handleLogout: () => undefined,
  handleRefreshSession: () => undefined,
  handleAddProfile: () => undefined,
  handleAuth: () => undefined,
  handleCancelOrder: () => undefined,
  handleSetStatus: () => undefined,
  isAccessTokenValid: () => Promise.resolve(false),
  handleSign: () => Promise.resolve(),
  handleSetError: () => undefined,
};

const AuthContext = React.createContext(initialAuthProviderState);

function useAuthProviderState(
  initialState: AuthReducerState
): UseAuthProviderState {
  const [authReducerState, dispatch] = useReducer(AuthReducer, initialState);

  const { handleSetMode, isDevMode } = useContext(AppContext);
  const { getIsCompatible } = useContext(AppCompabilityContext);

  useEffect(() => {
    const handleCheckOrderStatus = async () => {
      if (
        authReducerState.status === "pending" &&
        authReducerState.orderRef &&
        authReducerState.autoStartToken
      ) {
        dispatch(
          await checkOrderStatus(
            authReducerState.autoStartToken,
            authReducerState.orderRef,
            authReducerState.userAuthState === USER_AUTH_STATE.SIGNED_IN
          )
        );
      }
    };
    void handleCheckOrderStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    authReducerState.status,
    authReducerState.orderRef,
    authReducerState.autoStartToken,
  ]);

  async function handleAuth(
    personalNumber: string,
    authenticateOnExternalDevice: boolean
  ) {
    if (personalNumber && env.TEST_PERSONAL_NUMBER === personalNumber) {
      handleSetMode("development");
    }

    if (env.USE_BANKID === "false") {
      dispatch(await mockedAuth());
      return;
    }

    dispatch(setAuthenticateOnExternalDevice(authenticateOnExternalDevice));
    dispatch(setStatus("pending"));
    dispatch(await startAuth(personalNumber, authenticateOnExternalDevice));
  }

  async function handleSign(
    personalNumber: string,
    userVisibleData: string,
    authenticateOnExternalDevice: boolean
  ) {
    if (env.USE_BANKID === "false") {
      dispatch(setStatus("signResolved"));
      return;
    }

    dispatch(setStatus("pending"));
    dispatch(
      await startSign(
        personalNumber,
        userVisibleData,
        authenticateOnExternalDevice
      )
    );
  }

  async function handleCancelOrder() {
    dispatch(await cancelOrder(authReducerState.orderRef));
  }

  function handleLogin() {
    dispatch(loginSuccess());
  }

  async function handleLogout() {
    dispatch(removeProfile());
    dispatch(await loginFailure());
  }

  async function handleRefreshSession() {
    if (authReducerState.userAuthState === USER_AUTH_STATE.SIGNED_IN) {
      dispatch(await refreshSession());
    }
  }

  async function handleAddProfile() {
    dispatch(await addProfile());
  }

  function handleSetApiStatusMessage(message: string) {
    dispatch(setApiStatusMessage(message));
  }

  function handleSetStatus(status: string) {
    dispatch(setStatus(status));
  }

  function handleSetError(error: DispatchError) {
    dispatch(setError(error));
  }

  function showUpdateRequiredAlert(updateUrl: string) {
    Alert.alert(
      "Mitt Helsingborg måste uppdateras",
      "Versionen du använder av Mitt Helsingborg är för gammal",
      [
        {
          text: "Hämta uppdatering",
          onPress: () => Linking.openURL(updateUrl),
        },
      ]
    );
  }

  const isAccessTokenValid = useCallback(async () => {
    const decodedToken = await authService.getAccessTokenFromStorage();

    // Configure app in dev mode if personalnumber is defined as test account
    if (
      decodedToken?.personalNumber &&
      env.TEST_PERSONAL_NUMBER === decodedToken.personalNumber
    ) {
      handleSetMode("development");
    }

    // TODO: Remove this condition when exp value is set on the jwt token in the api.
    if (env.USE_BANKID === "true" && decodedToken) {
      return true;
    }

    if (decodedToken) {
      // Checks if a token is present in the application and that the expire time of the token is valid
      const expiresAt = decodedToken.exp * 1000;
      return new Date().getTime() < expiresAt;
    }
    return false;
  }, [handleSetMode]);

  useEffect(() => {
    const trySignIn = async () => {
      try {
        let apiStatusMessage = "";

        if (!isDevMode) {
          apiStatusMessage = await getApiStatus();
        }

        const { isCompatible, updateUrl } = await getIsCompatible();

        handleSetApiStatusMessage(apiStatusMessage);
        const isValidJWTToken = await isAccessTokenValid();

        const canLogin = isValidJWTToken && !apiStatusMessage && isCompatible;

        if (canLogin) {
          await handleAddProfile();
          handleLogin();
        } else {
          void handleLogout();
        }

        if (!isCompatible) {
          showUpdateRequiredAlert(updateUrl);
          handleSetApiStatusMessage(
            "Du har en för gammal version av appen. För att kunna ta del av Mitt Helsingborg och dess funktioner måste appen uppdateras. Besök din butik för appar för att göra detta."
          );
        }
      } catch (error) {
        void handleLogout();
      }
    };

    void trySignIn();
  }, [isAccessTokenValid, isDevMode, getIsCompatible]);

  useEffect(() => {
    const tryFetchUser = async () => {
      try {
        if (
          authReducerState.userAuthState === USER_AUTH_STATE.SIGNED_IN &&
          authReducerState.user === null
        ) {
          await handleAddProfile();
        }
      } catch (error) {
        void handleLogout();
      }
    };

    void tryFetchUser();
  }, [authReducerState.userAuthState, authReducerState.user]);

  return {
    handleLogin,
    handleLogout,
    handleRefreshSession,
    handleAddProfile,
    handleAuth,
    handleCancelOrder,
    handleSetStatus,
    isAccessTokenValid,
    handleSign,
    handleSetError,
    isLoading: authReducerState.status === "pending",
    isIdle: authReducerState.status === "idle",
    isResolved:
      authReducerState.status === "authResolved" ||
      authReducerState.status === "signResolved",
    isRejected: authReducerState.status === "rejected",
    ...authReducerState,
  };
}

const AuthProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
  const value = useAuthProviderState(initialAuthReducerState);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
export default AuthContext;
