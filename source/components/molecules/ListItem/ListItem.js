import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components/native';
import Text from '../../atoms/Text';
import Icon from '../../atoms/Icon';
import Button from '../../atoms/Button/Button';

const DefaultItem = styled.TouchableHighlight`
  border-bottom-width: 1px;
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

const ListItem = props => {
  const {
    highlighted,
    iconName,
    title,
    text,
    color,
    onClick,
    imageSrc,
    theme: { icon },
  } = props;

  const background =
    (highlighted && color && Object.prototype.hasOwnProperty.call(icon, color) && icon[color][1]) ||
    (highlighted && !color && icon.lightest) ||
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
  onClick: PropTypes.func,
  theme: PropTypes.object,
  imageSrc: PropTypes.number,
  lightest: PropTypes.string,
};

ListItem.defaultProps = {
  highlighted: false,
};
