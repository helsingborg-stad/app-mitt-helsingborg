import React from "react";
import PropTypes from "prop-types";
import { ThemeProvider } from "styled-components/native";
import { render } from "@testing-library/react-native";
import "@testing-library/jest-native/extend-expect";

import theme from "./source/theme/theme";

const RenderWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

const customRender = (ui) => render(ui, { wrapper: RenderWrapper });

// override render method
// eslint-disable-next-line import/prefer-default-export
export { customRender as render };

RenderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
