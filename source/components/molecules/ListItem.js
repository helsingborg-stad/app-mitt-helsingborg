import React from 'react';
import { View, SectionList, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Text from '../atoms/Text';
import Icon from '../atoms/Icon';
import Button from '../atoms/Button';

const ListItem = props => {
    const { highlighted, iconName, title, text, id, color } = props;

    const renderContent = () => {
        return (
            <Flex>
                {iconName &&
                    <IconContainer highlighted={highlighted} color={color}>
                        <IconFlex>
                            <ItemIcon name={iconName} color={color} />
                        </IconFlex>
                    </IconContainer>
                }
                <Content>
                    {title &&
                        <Title small>{title}</Title>
                    }
                    {text &&
                        <Text>{text}</Text>
                    }
                </Content>
                <Chevron name="chevron-right" />
            </Flex>
        );
    }

    if (highlighted) {
        return (
            <HighlightedItem block>
                {renderContent()}
            </HighlightedItem >
        );
    }

    return (
        <DefaultItem
            underlayColor="transparent"
            onPress={() => console.log(id)}
            >
            {renderContent()}
        </DefaultItem>
    );
}

export default ListItem;

ListItem.propTypes = {
    color: PropTypes.oneOf(['blue', 'purple', 'red', 'green']),
    highlighted: PropTypes.bool,
    iconName: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
    id: PropTypes.string,
};

ListItem.defaultProps = {
    highlighted: false,
};

const DefaultItem = styled.TouchableHighlight`
    borderBottomWidth: 1;
    borderColor: ${props => (props.theme.background.lighter)};
`;

const HighlightedItem = styled(Button)`
    padding: 0px;
    margin-bottom: 12px;
    background-color: white;
`;

const Flex = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Title = styled(Text)`
  color: ${props => (props.theme.background.darkest)};
  margin-bottom: 4px;
`;

const IconContainer = styled.View`
    width: 64px;
    background: ${props =>
         props.highlighted && props.color && props.theme.icon.hasOwnProperty(props.color) && props.theme.icon[props.color][1] ||
         props.highlighted && !props.color && props.theme.icon.lightest ||
         'transparent' 
         };
    border-top-left-radius: 12.5px;
    border-bottom-left-radius: 12.5px;
`;

const IconFlex = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
`;

const ItemIcon = styled(Icon)`
    color: rgba(0,0,0,0.55);
`;

const Content = styled.View`
    flex: 1;
    padding: 16px 0px 16px 8px;
`;

const Chevron = styled(Icon)`
color: #A3A3A3;
margin - right: 16px;
`;
