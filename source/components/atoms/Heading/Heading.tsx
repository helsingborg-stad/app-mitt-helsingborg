/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Text from "../Text/Text";

interface Props {
  marginBottom?: number;
}
const Heading = styled(Text)<Props>`
  margin-bottom: ${({ marginBottom }) => marginBottom || "0"}px;
`;

interface HInterface {
  children: React.ReactNode | React.ReactNode[];
}
export const H1 = ({ children, ...other }: HInterface): JSX.Element => (
  <Heading {...other} type="h1">
    {children}
  </Heading>
);
export const H2 = ({ children, ...other }: HInterface): JSX.Element => (
  <Heading {...other} type="h2">
    {children}
  </Heading>
);
export const H3 = ({ children, ...other }: HInterface): JSX.Element => (
  <Heading {...other} type="h3">
    {children}
  </Heading>
);

H1.propTypes = {
  children: PropTypes.node.isRequired,
};
H2.propTypes = {
  children: PropTypes.node.isRequired,
};
H3.propTypes = {
  children: PropTypes.node.isRequired,
};

Heading.propTypes = {
  type: PropTypes.oneOf(["h1", "h2", "h3", "h4"]),
  marginBottom: PropTypes.number,
  align: PropTypes.oneOf(["left", "center", "right"]),
};

Heading.defaultProps = {
  type: "h2",
  marginBottom: 0,
  align: "left",
};

export default Heading;
