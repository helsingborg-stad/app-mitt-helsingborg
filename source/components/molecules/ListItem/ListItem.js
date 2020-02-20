/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components/native';
import { Image } from 'react-native';
import Text from '../../atoms/Text';
import Icon from '../../atoms/Icon';
import Button from '../../atoms/Button/Button';

const ListItem = props => {
  const { highlighted, iconName, title, text, color, onClick, imageSrc } = props;
  const background =
    (props.highlighted &&
      props.color &&
      props.theme.icon.hasOwnProperty(props.color) &&
      props.theme.icon[props.color][1]) ||
    (props.highlighted && !props.color && props.theme.icon.lightest) ||
    'transparent';

  const renderContent = () => (
    <Flex>
      {iconName && !imageSrc && (
        <IconContainer highlighted={highlighted} background={background}>
          <IconFlex>
            <ItemIcon name={iconName} color={color} />
          </IconFlex>
        </IconContainer>
      )}

      {imageSrc && (
        <IconContainer highlighted={highlighted} background={background}>
          <IconFlex>
            <ImageIcon source={imageSrc} resizeMode="contain" />
          </IconFlex>
        </IconContainer>
      )}

      <Content>
        {title && <Title small>{title}</Title>}
        {text && <Text>{text}</Text>}
      </Content>
      <Chevron name="chevron-right" />
    </Flex>
  );

  if (highlighted) {
    return (
      <HighlightedItem onClick={onClick} block>
        {renderContent()}
      </HighlightedItem>
    );
  }

  return (
    <DefaultItem underlayColor="transparent" onPress={onClick}>
      {renderContent()}
    </DefaultItem>
  );
};

export default withTheme(ListItem);

ListItem.propTypes = {
  color: PropTypes.oneOf(['blue', 'purple', 'red', 'green']),
  highlighted: PropTypes.bool,
  iconName: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  onCLick: PropTypes.func,
};

ListItem.defaultProps = {
  highlighted: false,
};

const DefaultItem = styled.TouchableHighlight`
  border-bottom-width: 1;
  border-color: ${props => props.theme.background.lighter};
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
  color: ${props => props.theme.background.darkest};
  margin-bottom: 4px;
`;

const IconContainer = styled.View`
  width: 64px;
  background: ${props => props.background};
  border-top-left-radius: 12.5px;
  border-bottom-left-radius: 12.5px;
`;

const IconFlex = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ItemIcon = styled(Icon)`
  color: rgba(0, 0, 0, 0.55);
`;

const Content = styled.View`
  flex: 1;
  padding: 16px 0px 16px 8px;
`;

const Chevron = styled(Icon)`
  color: #a3a3a3;
  margin-right: 16px;
`;

const ImageIcon = styled.Image`
  width: 32px;
  height: 32px;
`;
