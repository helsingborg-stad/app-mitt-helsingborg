/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Text from "../Text/Text";

interface Props {
  align?: "left" | "center" | "right";
  marginBottom?: number;
  type?: "h1" | "h2" | "h3" | "h4" | "h5";
}

const Heading = styled(Text)<Props>`
  font-style: normal;
  color: ${(props) => props.theme.colors.neutrals[0]};
  text-align: ${(props) => props.align || "left"};
  margin-bottom: ${(props) => props.marginBottom || "5"}px;
`;

export const H1: React.FC<Props> = ({ children, ...other }) => (
  <Heading {...other} type="h1">
    {children}
  </Heading>
);
export const H2: React.FC<Props> = ({ children, ...other }) => (
  <Heading {...other} type="h2">
    {children}
  </Heading>
);
export const H3: React.FC<Props> = ({ children, ...other }) => (
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
