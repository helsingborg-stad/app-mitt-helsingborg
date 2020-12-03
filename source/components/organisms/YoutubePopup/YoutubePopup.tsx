import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Modal } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import Button from '../../atoms/Button';
import Text from '../../atoms/Text';

const BackgroundBlur = styled.View`
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0px;
  background-color: rgba(0, 0, 0, 0.35);
`;

const PopupContainer = styled.View`
  position: absolute;
  z-index: 1000;
  top: 33%;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0px;
  max-height: 50%;
  width: 100%;
  background-color: black;
`;
const ContentContainer = styled.View`
  padding: 0px;
  padding-bottom: 0px;
  flex-direction: column;
  justify-content: space-between;
  flex: 10;
`;

const ButtonContainer = styled.View`
  justify-content: center;
  flex-direction: row;
`;

interface Props {
  visible: boolean;
  closePopup: () => void;
  youtubeVideoId: string;
}
const YoutubePopup: React.FC<Props> = ({ visible, closePopup, youtubeVideoId }) => (
  <Modal visible={visible} transparent presentationStyle="overFullScreen" animationType="fade">
    <BackgroundBlur>
      <PopupContainer>
        <ContentContainer>
          <YoutubePlayer height={300} play={false} videoId={youtubeVideoId} />
          <ButtonContainer>
            <Button colorSchema="red" onClick={closePopup}>
              <Text>Stäng</Text>
            </Button>
          </ButtonContainer>
        </ContentContainer>
      </PopupContainer>
    </BackgroundBlur>
  </Modal>
);

YoutubePopup.propTypes = {
  /** whether to show the dialog or not */
  visible: PropTypes.bool,
  closePopup: PropTypes.func,
  /** for a youtube link to a video, like https://www.youtube.com/watch?v=dQw4w9WgXcQ, the id is the string aftter ?v=  */
  youtubeVideoId: PropTypes.string,
};

export default YoutubePopup;
