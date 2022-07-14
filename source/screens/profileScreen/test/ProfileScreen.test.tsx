import React from "react";

import { fireEvent } from "@testing-library/react-native";

import ProfileScreen from "../ProfileScreen";

import AppContext from "../../../store/AppContext";
import AuthContext, {
  initialAuthProviderState,
} from "../../../store/AuthContext";

import { render } from "../../../../test-utils";

import type { User } from "../../../types/UserTypes";

const firstName = "Kenth";
const lastName = "Kenthsson";
const personalNumber = "199009241234";
const city = "Kenth Town";
const postalCode = "12345";
const street = "Kenths väg 1337";

const developerToolsButtonText = "Utvecklarfunktioner";
const signOutButtonText = "Logga ut";

const defaultUser = {
  address: {
    city,
    postalCode,
    street,
  },
  civilStatus: "",
  firstName,
  lastName,
  email: "kenth@email.com",
  mobilePhone: "0708123456",
  personalNumber,
};

interface RenderComponentProps {
  devMode?: boolean;
  testUser?: User;
  signoutCallback?: () => void;
  navigateCallback?: () => void;
}
const renderComponent = (props: RenderComponentProps = {}) => {
  const {
    devMode = true,
    testUser = defaultUser,
    signoutCallback = jest.fn(),
    navigateCallback = jest.fn(),
  } = props;
  return render(
    <AppContext.Provider
      value={{
        isDevMode: devMode,
        handleSetMode: jest.fn(),
        mode: "",
      }}
    >
      <AuthContext.Provider
        value={{
          ...initialAuthProviderState,
          handleLogout: signoutCallback,
          user: testUser,
        }}
      >
        <ProfileScreen
          navigation={{
            navigate: navigateCallback,
          }}
        />
      </AuthContext.Provider>
    </AppContext.Provider>
  );
};

it("renders without crashing", () => {
  const component = () => renderComponent();

  expect(component).not.toThrow();
});

it("renders all personal info fields", () => {
  const infoFields = [
    {
      fieldLabel: "NAMN",
      fieldValue: `${firstName} ${lastName}`,
    },
    {
      fieldLabel: "PERSONNUMMER",
      fieldValue: personalNumber,
    },
    {
      fieldLabel: "GATUADRESS",
      fieldValue: street,
    },
    {
      fieldLabel: "POSTNUMMER",
      fieldValue: postalCode,
    },
    {
      fieldLabel: "ORT",
      fieldValue: city,
    },
  ];

  const { queryByText } = renderComponent();

  infoFields.forEach(({ fieldLabel, fieldValue }) => {
    expect(queryByText(fieldLabel)).not.toBeNull();
    expect(queryByText(fieldValue)).not.toBeNull();
  });
});

it("renders the developer tools button in dev mode", () => {
  const { queryByText } = renderComponent({ devMode: true });

  expect(queryByText(developerToolsButtonText)).not.toBeNull();
});

it("hides the developer tools button when not in dev mode", () => {
  const { queryByText } = renderComponent({ devMode: false });

  expect(queryByText(developerToolsButtonText)).toBeNull();
});

it("calls the handleLogout callback when signing out", () => {
  const signOutMock = jest.fn();

  const { getByText } = renderComponent({ signoutCallback: signOutMock });

  const signOutButton = getByText(signOutButtonText);
  fireEvent.press(signOutButton);

  expect(signOutMock).toHaveBeenCalledTimes(1);
});

it("calls the navigate callback when navigating to developer tools menu", () => {
  const navigateMock = jest.fn();

  const { getByText } = renderComponent({ navigateCallback: navigateMock });

  const developerToolsButton = getByText(developerToolsButtonText);
  fireEvent.press(developerToolsButton);

  expect(navigateMock).toHaveBeenCalledTimes(1);
  expect(navigateMock).toHaveBeenCalledWith("DevFeatures");
});
