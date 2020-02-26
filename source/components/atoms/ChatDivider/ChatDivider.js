import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Text from '../Text';

const DividerLine = styled.View`
  height: 1px;
  width: 100%;
  flex: 1;
  background-color: ${props => props.theme.border.default};
  align-self: stretch;
  margin-vertical: 6px;
  flex-shrink: 0;
`;
const DividerWrapper = styled.View`
  align-self: stretch;
  margin-top: 48px;
  margin-bottom: 24px;
  margin-left: 16px;
  margin-right: 16px;
`;
const DividerTitle = styled(Text)`
  text-align: center;
  flex: 1;
  flex-shrink: 0;
  margin-bottom: 4px;
  margin-top: 4px;
  font-size: 14px;
  font-weight: 400;
`;
const DividerInfo = styled(Text)`
  text-align: center;
  flex: 1;
  flex-shrink: 0;
  font-size: 12px;
`;

const ChatDivider = props => {
  const { title, info } = props;

  return (
    <DividerWrapper>
      <DividerTitle>{title}</DividerTitle>
      <DividerLine />
      <DividerInfo>{info}</DividerInfo>
    </DividerWrapper>
  );
};

ChatDivider.propTypes = {
  title: PropTypes.string,
  info: PropTypes.string,
};

export default ChatDivider;
