import React from 'react';
import styled from 'styled-components/native';
import Button from '../../../atoms/Button';
import Text from '../../../atoms/Text';
import Card from '../../../molecules/Card';

const TouchBlocker = styled.TouchableWithoutFeedback`
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0px;
`;

const BackgroundBlur = styled.View`
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0px;
  background-color: rgba(0, 0, 0, 0.25);
`;

const PopupContainer = styled.View`
  position: absolute;
  z-index: 1000;
  top: 33%;
  left: 10%;
  right: 10%;
  bottom: 0;
  padding: 0px;
  max-height: 50%;
  width: 80%;
  background-color: white;
  flex-direction: column;
  border-radius: 6px;
  shadow-offset: 0 0;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
`;
const ContentContainer = styled.View`
  padding: 10px;
  padding-bottom: 20px;
  flex-direction: column;
  justify-content: space-between;
  flex: 10;
`;
const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  padding: 20px;
  margin-bottom: 10px;
`;

const CloseDialog = (closeForm: () => void) => (closePopup: () => void) => (
  // Eats all touch events in the background, so that you can't click or scroll in the form while the popup is shown.
  <TouchBlocker
    onPress={e => {
      e.preventDefault();
      e.stopPropagation();
    }}
  >
    <BackgroundBlur>
      <PopupContainer>
        <ContentContainer>
          <Card colorSchema="neutral">
            <Card.Body>
              <Card.Title>Vill du avbryta ansökan?</Card.Title>
              <Card.Text>
                Ansökan sparas i 3 dagar. Efter det raderas den och du får starta en ny.
              </Card.Text>
            </Card.Body>
          </Card>
          <ButtonRow>
            <Button colorSchema="red" onClick={closePopup}>
              <Text>Nej</Text>
            </Button>
            <Button
              small
              onClick={() => {
                closeForm();
                closePopup();
              }}
            >
              <Text>Ja</Text>
            </Button>
          </ButtonRow>
        </ContentContainer>
      </PopupContainer>
    </BackgroundBlur>
  </TouchBlocker>
);

export default CloseDialog;
