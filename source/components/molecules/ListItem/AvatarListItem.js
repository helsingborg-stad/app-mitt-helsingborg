import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components/native';
import { Avatar } from 'react-native-elements';
import Text from '../../atoms/Text';
import Button from '../../atoms/Button/Button';
import Icon from '../../atoms/Icon';
import SubstepModal from '../SubstepModal';

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

const AvatarListItem = ({ value, onChange, imageSrc, formId, removeItem }) => {
  const [showForm, setShowForm] = useState(false);
  const familyFormId = formId || 'dc069a10-c68d-11ea-9984-cbb2e8b06538'; // hardcoded for now, using dev db

  const showFormModal = () => {
    setShowForm(true);
  };

  const title = `${value.firstName || 'Förnamn'} ${value.lastName || 'Efternamn'}`;
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
        {value && value.personalInfo && value.personalInfo.email ? (
          <Body small strong>
            Email: {value.personalInfo.email}
          </Body>
        ) : null}
        {value && value.personalInfo && value.personalInfo.telephone ? (
          <Body small strong>
            Telefon: {value.personalInfo.telephone}
          </Body>
        ) : null}
        {value && value.personalInfo && value.personalInfo.personalNumber ? (
          <Body small strong>
            Personnummer: {value.personalInfo.personalNumber}
          </Body>
        ) : null}
      </Content>
      <Button size="small" pill icon onClick={removeItem}>
        <Icon name="remove"></Icon>
      </Button>
    </Flex>
  );

  return (
    <>
      <HighlightedItem onClick={showFormModal} block z={0}>
        {renderContent()}
      </HighlightedItem>
      <SubstepModal
        visible={showForm}
        setVisible={setShowForm}
        value={value}
        formId={familyFormId}
        onChange={onChange}
      />
    </>
  );
};

AvatarListItem.propTypes = {
  /**
   * Values for the list item.
   */
  value: PropTypes.object,
  /**
   * onClick handler for list item.
   */
  onChange: PropTypes.func,
  /**
   * What happens when the removeItem button is clicked
   */
  removeItem: PropTypes.func,
  /**
   * Source of avatar image for list item.
   */
  imageSrc: PropTypes.number,
  /**
   * The id for the the form that specifies the information.
   */
  formId: PropTypes.string,
};

AvatarListItem.defaultProps = {
  value: {},
  onChange: null,
  imageSrc: null,
};

export default withTheme(AvatarListItem);
