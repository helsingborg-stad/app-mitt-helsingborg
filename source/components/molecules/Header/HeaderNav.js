import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Text from '../../atoms/Text';

const HeaderNav = ({ themeColor, navItems }) => (
  <Nav>
    {navItems.map(item => (
      <NavItem key={item.id}>
        <NavTitleWrapper>
          <NavTitle active={item.active}>{item.title}</NavTitle>
        </NavTitleWrapper>
        <ActiveItemBar color={themeColor} active={item.active} />
      </NavItem>
    ))}
  </Nav>
);

export default HeaderNav;

const Nav = styled.View`
  width: 100%;
  flex-direction: row;
`;

const NavItem = styled.View`
  flex: 1;
  height: 40px;
`;

const NavTitleWrapper = styled.View`
  flex: 1;
  justify-content: center;
`;

const NavTitle = styled(Text)`
  color: ${props => props.theme.background.gray};
  ${({ active }) =>
    active &&
    `
      color: black;
    `}
`;

const ActiveItemBar = styled.View`
  height: 2px;
  width: 25px;
  background-color: ${props =>
    props.active ? props.theme.heading[props.color][2] : 'transparent'};
`;

HeaderNav.propTypes = {
  themeColor: PropTypes.string,
  navItems: PropTypes.array,
};

HeaderNav.defaultProps = {
  themeColor: 'purple',
};
