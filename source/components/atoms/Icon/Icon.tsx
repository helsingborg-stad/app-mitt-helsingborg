import PropTypes from "prop-types";
import MIcon from "react-native-vector-icons/MaterialIcons";
import styled from "styled-components/native";

/*
 * To see available icons, go to:
 * https://mui.com/material-ui/material-icons/
 */
const Icon = styled(MIcon)`
  color: ${(props) => props.color};
  font-size: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  line-height: ${(props) => props.size}px;
  text-align: center;
`;

Icon.propTypes = {
  size: PropTypes.oneOf([16, 24, 32, 48]).isRequired,
  name: PropTypes.string.isRequired,
};

Icon.defaultProps = {
  size: 24,
  name: "3d-rotation",
  color: "#000000",
};

export default Icon;
