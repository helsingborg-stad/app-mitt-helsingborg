import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Heading from '../atoms/Heading';
import Text from '../atoms/Text';
import shadow from '../../styles/shadow';

export default Header = ({ message, title, themeColor }) => {
    return (
        <HeaderContainer>
            {message &&
                <Text>{message}</Text>}
            {title &&
                <Title type="h2" color={themeColor}>{title}</Title>
            }
        </HeaderContainer>
    );
}

const HeaderContainer = styled.View`
    padding: 16px;
    margin-bottom: 8px;
    min-height: 160px;
    justify-content: flex-end;
    background-color: white;
    ${props => (shadow[1])}
`;

const Title = styled(Heading)`
    margin-top: 4px;
    color: ${props => (props.theme.heading[props.color][1])};
`;

Header.propTypes = {
    themeColor: PropTypes.string,
    message: PropTypes.string,
    title: PropTypes.string,
};

Header.defaultProps = {
    themeColor: 'purple',
}
