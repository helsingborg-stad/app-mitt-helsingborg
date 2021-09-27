import React from "react";
import PropTypes from "prop-types";
import { ThemeProvider } from "styled-components/native";
import { render } from "@testing-library/react-native";
import "@testing-library/jest-native/extend-expect";

import { AuthProvider } from "./source/store/AuthContext";
import { AppProvider } from "./source/store/AppContext";

import ScreenWrapper from "./source/components/molecules/ScreenWrapper";

import theme from "./source/styles/theme";

const RenderWrapper = ({ children }) => (
  <AppProvider>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <ScreenWrapper>{children}</ScreenWrapper>
      </ThemeProvider>
    </AuthProvider>
  </AppProvider>
);

const customRender = (ui) => render(ui, { wrapper: RenderWrapper });

// override render method
// eslint-disable-next-line import/prefer-default-export
export { customRender as render };

RenderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
