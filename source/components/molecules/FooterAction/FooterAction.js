import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ActionContainer = styled.View(props => ({
  display: 'flex',
  justifyContent: 'space-around',
  bottom: 0,
  height: props.height,
  backgroundColor: props.background,
}));

const ButtonWrapper = styled.View`
  padding-left: 60%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const FooterAction = props => {
  const { children, height, background, ButtonList } = props;

  return (
    <ActionContainer height={height} background={background}>
      <ButtonWrapper>
        {ButtonList && <ButtonList />}
        {children}
      </ButtonWrapper>
    </ActionContainer>
  );
};

FooterAction.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  ButtonList: PropTypes.node,
  height: PropTypes.string,
  background: PropTypes.string,
};

FooterAction.defaultProps = {
  height: '192px',
  background: '#00213F',
};
export default FooterAction;
