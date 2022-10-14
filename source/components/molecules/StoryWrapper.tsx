import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components/native";

import { Text } from "../atoms";
import ScreenWrapper from "./ScreenWrapper";

const StoryHeading = styled(Text).attrs({ type: "h2" })`
  margin-bottom: 16px;
  margin-top: 16px;
`;

const EnhancedSafeAreaView = styled.SafeAreaView`
  flex: 1;
  margin-bottom: 18px;
`;

const StoryWrapper = (props) => {
  const { style, kind, name, children } = props;

  return (
    <EnhancedSafeAreaView>
      <ScreenWrapper style={style}>
        {kind ? <StoryHeading>{`${kind} / ${name}`}</StoryHeading> : null}
        {children}
      </ScreenWrapper>
    </EnhancedSafeAreaView>
  );
};

StoryWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  kind: PropTypes.string,
  name: PropTypes.string,
  style: PropTypes.array,
};

export default StoryWrapper;
