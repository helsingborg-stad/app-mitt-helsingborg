import React from 'react';
import { TouchableHighlight, ScrollView, Image, Linking } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Icon, Button } from '../../atoms';
import icons from '../../../helpers/Icons';
import Text from '../../atoms/Text';
import BackNavigation from '../BackNavigation/BackNavigation';
import { Modal, useModal } from '../Modal';

const ModalContainer = styled.View({
  backgroundColor: '#00213F',
  flexGrow: 1,
});

const Container = styled.View({
  padding: '20px',
  marginBottom: '20px',
  flex: 1,
});

const CloseModal = styled(BackNavigation)`
  padding: 26px;
  position: absolute;
`;

const BannerWrapper = styled.View`
  top: -85px;
  padding: 0;
  margin-bottom: 0;
  min-height: 190px;
  background: #1f3c56;
  position: relative;
`;

const BannerIcon = styled(Image)`
  width: 72px;
  position: absolute;
  bottom: -35px;
  left: 25px;
`;

const Tagline = styled(Text)`
  font-size: 14px;
  font-weight: bold;
  color: #fbf7f0;
  line-height: 20px;
  text-transform: uppercase;
`;

const Heading = styled(Text)`
  margin-top: 15px;
  font-size: 30px;
  font-weight: bold;
  line-height: 40px;
  color: #fbf7f0;
`;

const HelpText = styled(Text)`
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
  line-height: 25px;
  color: #fbf7f0;
`;

const LinkButton = styled(Button)`
  margin-top: 20px;
`;

const HelpButton = (props) => {
  const { text, size, heading, tagline, url } = props;
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
          <BannerWrapper>
            <BannerIcon resizeMode="contain" source={icons.ICON_HELP} />
          </BannerWrapper>
          <Container>
            <ScrollView
              contentContainerStyle={{
                marginBottom: 10,
                justifyContent: 'space-between',
              }}
            >
              <Tagline>{tagline}</Tagline>
              <Heading>{heading}</Heading>
              <HelpText>{text?.length ? text : 'Text not available'}</HelpText>
              {url.length > 0 ? (
                <LinkButton onClick={link} color="floral" block>
                  <Text>Läs mer</Text>
                  <Icon name="launch" />
                </LinkButton>
              ) : null}
            </ScrollView>
          </Container>
        </ModalContainer>
      </Modal>
      <TouchableHighlight onPress={toggleModal} underlayColor="transparent">
        <Icon name="help-outline" size={size} />
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
};

HelpButton.defaultProps = {
  text: '',
  tagline: 'hjälp',
  size: 24,
  heading: '',
  url: '',
};

export default HelpButton;
