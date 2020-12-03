import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import styled from 'styled-components/native';
import StoryWrapper from '../../molecules/StoryWrapper';
import YoutubePopup from './YoutubePopup';
import { Button, Text } from '../../atoms';

const Wrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  height: 300px;
  align-items: center;
`;

const YoutubeStory = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <YoutubePopup
        visible={visible}
        youtubeVideoId="o0u4M6vppCI"
        closePopup={() => setVisible(false)}
      />
      <Wrapper>
        <Button onClick={() => setVisible(true)}>
          <Text>Visa popup</Text>
        </Button>
      </Wrapper>
    </>
  );
};

storiesOf('Youtube Popup', module).add('Default', () => (
  <StoryWrapper>
    <YoutubeStory />
  </StoryWrapper>
));
