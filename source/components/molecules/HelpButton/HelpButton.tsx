import React from 'react';
import { TouchableHighlight, ScrollView, Image, Linking } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Icon from '../../atoms/Icon';
import Button from '../../atoms/Button';
import icons from '../../../helpers/Icons';
import Text from '../../atoms/Text';
import BackNavigation from '../BackNavigation/BackNavigation';
import { Modal, useModal } from '../Modal';

const ModalContainer = styled.View({
  flexGrow: 1,
});

const Container = styled.View`
  padding: 24px;
  flex: 1;
`;

const StyledScrollView = styled.ScrollView`
  padding-bottom: 24px;
  padding-top: 84px;
`;
const CloseModal = styled(BackNavigation)`
  padding: 26px;
  position: absolute;
`;

const Tagline = styled(Text)`
  font-size: 14px;
  font-weight: bold;
  line-height: 20px;
  text-transform: uppercase;
`;

const Heading = styled(Text)`
  margin-top: 15px;
  font-size: 30px;
  font-weight: bold;
  line-height: 40px;
`;

const HelpText = styled(Text)`
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
  line-height: 25px;
`;

const LinkButton = styled(Button)`
  margin-top: 20px;
`;

const HelpButton = (props) => {
  const { text, size, heading, tagline, url, icon } = props;
  const [isModalVisible, toggleModal] = useModal();

  const link = () => {
    Linking.openURL(url);
  };

  if ((!heading || heading.length === 0) && (!text || text?.length === 0) && url.length) {
    return (
      <>
        <TouchableHighlight onPress={link} underlayColor="transparent">
          <Icon name="help-outline" size={size} />
        </TouchableHighlight>
      </>
    );
  }

  return (
    <>
      <Modal visible={isModalVisible} hide={toggleModal}>
        <ModalContainer>
          <CloseModal showBackButton={false} onClose={toggleModal} />
          <Container>
            <StyledScrollView>
              <Tagline>{tagline}</Tagline>
              <Heading>{heading}</Heading>
              <HelpText>{text?.length ? text : 'Text not available'}</HelpText>
              {url.length > 0 ? (
                <LinkButton onClick={link} color="floral" block>
                  <Text>Läs mer</Text>
                  <Icon name="launch" />
                </LinkButton>
              ) : null}
            </StyledScrollView>
          </Container>
        </ModalContainer>
      </Modal>
      <TouchableHighlight onPress={toggleModal} underlayColor="transparent">
        <Icon name={icon} size={size} />
      </TouchableHighlight>
    </>
  );
};

HelpButton.propTypes = {
  text: PropTypes.string,
  size: PropTypes.number,
  heading: PropTypes.string,
  tagline: PropTypes.string,
  url: PropTypes.string,
  icon: PropTypes.string,
};

HelpButton.defaultProps = {
  text: '',
  tagline: 'hjälp',
  size: 24,
  heading: '',
  url: '',
  icon: 'help-outline',
};

export default HelpButton;
