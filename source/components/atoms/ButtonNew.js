import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import styled, { ThemeProvider, css } from 'styled-components/native';
import Text from './Text';

const ButtonNew = (props) => {
    const { value, onClick, style, color, block, rounded, pill, icon } = props;
    const children = React.Children.map(props.children, child => {
        // Override child components
        if (child.type === Text) {
            return React.createElement(ButtonText, {...child.props, buttonTheme: color});
        }
        return child;
    });

    return (
        <ButtonWrapper>
            <ButtonTouchable
                onPress={onClick}
                block={block}
            >
                <ButtonBase
                    buttonTheme={color}
                    rounded={rounded}
                    pill={pill}
                    style={style}
                    icon={icon}
                >
                    {children ? 
                        children
                    : value ?
                        <ButtonText>
                            {value}
                        </ButtonText>
                    : null}
                </ButtonBase>
            </ButtonTouchable>
        </ButtonWrapper>
    )
};

ButtonNew.defaultProps = {
    color: 'purple',
    rounded: true,
    pill: false,
    icon: false
};

const ButtonBase = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;

    padding: 16px
    max-width: 100%;
    height: 56px;

    min-width: ${props => (!props.icon ? '124px' : 'auto')};
    background-color: ${props => (props.theme.button[props.buttonTheme].background)};

    ${props => (props.rounded ? buttonRounded : null)}
    ${props => (props.pill ? buttonPill : null)}
`;

const ButtonText = styled(Text)`
    font-size: 18px;
    color: ${(props) => (props.theme.button[props.buttonTheme].text)};
`;

const buttonRounded = css`
    border-radius: 12.5px;
`;

const buttonPill = css`
    border-radius: 24.5px;
`;

const ButtonWrapper = styled.View`
    flex-direction: row;
`;

const ButtonTouchable = styled.TouchableOpacity`
    ${props => (props.block ? 'flex: 1;' : null)};
`;

export default ButtonNew;

// const styles = StyleSheet.create({
//     button: {
//         marginBottom: 15,
//         padding: 16,
//         backgroundColor: '#fff',
//         borderRadius: 17,
//         shadowOpacity: 0.3,
//         shadowRadius: 3,
//         shadowColor: '#000',
//         shadowOffset: { height: 2, width: 0 },
//     },
//     buttonAlignRight: {
//         alignSelf: 'flex-end',
//     },
//     buttonPrimary: {
//         backgroundColor: '#0095DB',
//     },
//     buttonDisabled: {
//         backgroundColor: '#E5E5EA',
//     },
//     buttonText: {
//         fontSize: 16,
//         color: '#005C86',
//         textAlign: 'left',
//         fontWeight: 'bold',
//     },
//     buttonPrimaryText: {
//         color: '#fff',
//     },
//     buttonTextDisabled: {
//         color: '#C7C7CC',
//     },
// });


// <ThemeProvider theme={inheritedTheme => {
//     let theme = inheritedTheme;

//     // Override child component theme vars
//     theme.text.default = theme.button[color].text;

//     return theme;
// }}></ThemeProvider>