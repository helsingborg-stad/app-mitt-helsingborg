import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Heading from '../../atoms/Heading';
import Text from '../../atoms/Text';
import Icon from '../../atoms/Icon';
import shadow from '../../../styles/shadow';
import HeaderNav from './HeaderNav';
import Button from '../../atoms/Button/Button';

const BackButton = styled(Button)`
  padding: 0;
  margin-left: -10px;
  min-height: auto;
  background-color: #fff;
`;

const HeaderContainer = styled.View`
  padding: 16px;
  justify-content: flex-end;
  background-color: white;
  ${() => shadow[1]}
`;

const HeaderHeading = styled(Heading)`
  margin-top: 4px;
  color: ${props => props.theme.heading[props.color][1]};
`;

const HeaderContent = styled.View`
  justify-content: flex-end;
  height: 130px;
`;

const Separator = styled.View`
  margin: 16px 0 16px 0;
  width: 100%;
  height: 1px;
  background-color: ${props => props.theme.background.lighter};
`;

const Header = ({ message, title, themeColor, navItems, backButton }) => (
  <HeaderContainer>
    <HeaderContent>
      {backButton && (
        <BackButton z={0} onClick={backButton.onClick}>
          <Icon name="arrow-back" />
          <Text>{backButton.text}</Text>
        </BackButton>
      )}
      {message && <Text>{message}</Text>}
      {title && <HeaderHeading color={themeColor}>{title}</HeaderHeading>}
    </HeaderContent>
    {navItems && (
      <View>
        <Separator />
        <HeaderNav themeColor={themeColor} navItems={navItems} />
      </View>
    )}
  </HeaderContainer>
);

export default Header;

Header.propTypes = {
  themeColor: PropTypes.string,
  message: PropTypes.string,
  title: PropTypes.string,
  navItems: PropTypes.array,
  backButton: PropTypes.shape({
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
};

Header.defaultProps = {
  themeColor: 'purple',
  backButton: undefined,
};
