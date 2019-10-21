import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Heading from '../atoms/Heading';
import Text from '../atoms/Text';
import shadow from '../../styles/shadow';
import HeaderNav from './HeaderNav';

export default Header = ({ message, title, themeColor, navItems }) => {
    return (
        <HeaderContainer>
            <HeaderContent>
                {message &&
                    <Text>{message}</Text>}
                {title &&
                    <Title type="h2" color={themeColor}>{title}</Title>
                }
            </HeaderContent>
            {navItems &&
                <View>
                    <Separator />
                    <HeaderNav
                        themeColor={themeColor}
                        navItems={navItems}
                    />
                </View>
            }
        </HeaderContainer>
    );
}

const HeaderContainer = styled.View`
    padding: 16px;
    margin-bottom: 8px;
    justify-content: flex-end;
    background-color: white;
    ${props => (shadow[1])}
`;

const Title = styled(Heading)`
    margin-top: 4px;
    color: ${props => (props.theme.heading[props.color][1])};
`;

const HeaderContent = styled.View`
    justify-content: flex-end;
    height: 130px;
`;

const Separator = styled.View`
    margin: 16px 0 16px 0;
    width: 100%;
    height: 1px;
    background-color: ${props => (props.theme.background.lighter)};
`;

Header.propTypes = {
    themeColor: PropTypes.string,
    message: PropTypes.string,
    title: PropTypes.string,
    navItems: PropTypes.object
};

Header.defaultProps = {
    themeColor: 'purple',
}
