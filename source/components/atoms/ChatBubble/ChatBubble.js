import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import styled, { css, withTheme } from 'styled-components/native';
import shadow from '../../../styles/shadow';
import Button from '../Button/Button';
import Heading from '../Heading';
import Icon from '../Icon';
import Text from '../Text';

const BubbleHeading = styled(Heading)`
  color: ${props => props.theme.chatBubble[props.colorTheme].text};
`;

const BubbleText = styled(Text)`
  color: ${props => props.theme.chatBubble[props.colorTheme].text};
  font-size: 16px;
`;

const CSS = {};

CSS.left = css`
  align-self: flex-start;
  border-bottom-left-radius: 4px;
  margin-right: 96px;
`;
CSS.right = css`
  align-self: flex-end;
  border-bottom-right-radius: 4px;
  margin-left: 96px;
`;

const Bubble = styled.View`
  margin-top: 6px;
  margin-bottom: 6px;
  margin-left: 16px;
  margin-right: 16px;
  padding: 14px 18px 12px 18px;
  background-color: gray;
  border-radius: 17.5px;
  align-self: flex-start;
  background-color: ${props => props.theme.chatBubble[props.colorTheme].background};

  ${props => (props.alignment && CSS[props.alignment] ? CSS[props.alignment] : null)}
  ${props => shadow[props.z]}
`;

const IconButton = styled(Button)`
  padding: 0;
  padding-top: 0;
  padding-bottom: 0;
  min-height: auto;
`;

const ContentWrapper = styled.View`
  flex-direction: row;
  width: 100%;
`;

const Aside = styled.View`
  flex-basis: 42px;
  border-left-width: 1px;
  border-left-color: ${props => props.theme.border.default};
  align-items: flex-end;
  margin-left: 16px;
`;

const availableColorModifiers = ['automated', 'human', 'user'];

const ChatBubble = props => {
  const { content, modifiers, style, iconRight, onClickIconRight, theme, z, ...other } = props;

  let colorTheme = modifiers
    ? modifiers.find(modifier => availableColorModifiers.includes(modifier))
    : undefined;
  colorTheme = colorTheme || 'user'; // Default theme

  const alignment = colorTheme === 'user' ? 'right' : 'left';

  /** Override child components */
  const children = React.Children.map(other.children, (child, index) => {
    /** Heading */
    if (child.type === Heading) {
      return React.createElement(BubbleHeading, { ...child.props, colorTheme });
    }

    /** Text */
    if (child.type === Text) {
      return React.createElement(BubbleText, { ...child.props, colorTheme });
    }

    return child;
  });

  return (
    <Bubble alignment={alignment} colorTheme={colorTheme} style={style} z={z}>
      <ContentWrapper>
        <View>
          {children ||
            (content ? <BubbleText colorTheme={colorTheme}>{content}</BubbleText> : null)}
        </View>
        {iconRight && onClickIconRight ? (
          <Aside>
            <IconButton onClick={onClickIconRight} z={0}>
              <Icon color={theme.chatBubble[colorTheme].asideIcon} name={iconRight} />
            </IconButton>
          </Aside>
        ) : null}
      </ContentWrapper>
    </Bubble>
  );
};

ChatBubble.propTypes = {
  modifiers: PropTypes.arrayOf(PropTypes.oneOf(availableColorModifiers)),
  content: PropTypes.string,
  onClickIconRight: PropTypes.func,
  iconRight: PropTypes.string,
  style: PropTypes.shape({}),
  theme: PropTypes.object,
  z: PropTypes.oneOf(Number(Object.keys(shadow))),
};

ChatBubble.defaultProps = {
  modifiers: ['user'],
  iconRight: 'help-outline',
  z: 1,
};

export default withTheme(ChatBubble);
