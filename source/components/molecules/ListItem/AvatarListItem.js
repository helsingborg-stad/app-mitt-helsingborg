import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components/native';
import { Avatar } from 'react-native-elements';
import Text from '../../atoms/Text';
import Button from '../../atoms/Button/Button';

const HighlightedItem = styled(Button)`
  padding: 0px;
  margin-bottom: 8px;
  background-color: white;
  border-radius: 9.5px;
`;

const Flex = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Title = styled(Text)`
  color: ${props => props.theme.list.onLightBackground.listWithAvatar.text};
  font-weight: bold;
  margin-bottom: 4px;
`;

const Body = styled(Text)`
  color: ${props => props.theme.list.onLightBackground.listWithAvatar.bodyTextColor};
`;

const IconContainer = styled.View`
  width: 64px;
  background: ${props => props.background};
`;

const IconFlex = styled.View`
  align-items: center;
  justify-content: center;
  margin-left: 30px;
  margin-right: 20px;
`;

const Content = styled.View`
  flex: 1;
  padding: 16px 0px 16px 8px;
`;

const AvatarListItem = props => {
  const { title, text, onClick, imageSrc } = props;

  const familyFormId = 'dc069a10-c68d-11ea-9984-cbb2e8b06538'; // hardcoded for now, using dev db

  const nameAcronym = title
    .split(/\s/)
    // eslint-disable-next-line no-param-reassign
    .reduce((response, word) => (response += word.slice(0, 1)), '');

  const renderContent = () => (
    <Flex>
      {imageSrc && (
        <IconContainer highlighted={false} background="transparent">
          <IconFlex>
            <Avatar
              rounded
              size="medium"
              titleStyle={{ fontSize: 20, fontWeight: 'bold' }}
              title={nameAcronym}
            />
          </IconFlex>
        </IconContainer>
      )}

      <Content>
        {title && <Title>{title}</Title>}
        {text && (
          <Body small strong>
            {text}
          </Body>
        )}
      </Content>
    </Flex>
  );

  return (
    <HighlightedItem onClick={onClick} block z={0}>
      {renderContent()}
    </HighlightedItem>
  );
};

export default withTheme(AvatarListItem);

AvatarListItem.propTypes = {
  /**
   * Title for list item.
   */
  title: PropTypes.string.isRequired,
  /**
   * Body text for list item.
   */
  text: PropTypes.string,
  /**
   * onClick handler for list item.
   */
  onClick: PropTypes.func,
  /**
   * Source of avatar image for list item.
   */
  imageSrc: PropTypes.number,
};

AvatarListItem.defaultProps = {
  text: '',
  onClick: null,
  imageSrc: null,
};
