import { storiesOf } from '@storybook/react-native';
import React from 'react';
import StoryWrapper from '../../molecules/StoryWrapper';
import Text from '../Text';
import Box from './Box';

const boxStories = storiesOf('Box', module);

boxStories.add('Padding', () => (
  <StoryWrapper>
    <Box p="50px 0 50px 0">
      <Text>Setting padding through the p prop</Text>
    </Box>

    <Box pl="50px">
      <Text>Setting padding through the pl (padding-left) prop</Text>
    </Box>

    <Box pr="50px">
      <Text>Setting padding through the pr (padding-right) prop</Text>
    </Box>

    <Box pt="50px">
      <Text>Setting padding through the pt (padding-top) prop</Text>
    </Box>

    <Box pb="50px">
      <Text>Setting padding through the pb (padding-bottom) prop</Text>
    </Box>

    <Box py="50px">
      <Text>Setting padding through the py (padding-top and padding-bottom) prop</Text>
    </Box>

    <Box px="50px">
      <Text>Setting padding through the px (padding-left and padding-right) prop</Text>
    </Box>
  </StoryWrapper>
));
