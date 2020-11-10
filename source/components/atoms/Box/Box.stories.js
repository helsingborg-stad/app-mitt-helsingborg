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

boxStories.add('Margin', () => (
  <StoryWrapper>
    <Box m="50px 0 50px 0">
      <Text>Setting margin through the p prop</Text>
    </Box>

    <Box ml="50px">
      <Text>Setting margin through the ml (margin-left) prop</Text>
    </Box>

    <Box mr="50px">
      <Text>Setting margin through the mr (margin-right) prop</Text>
    </Box>

    <Box mt="50px">
      <Text>Setting margin through the mt (margin-top) prop</Text>
    </Box>

    <Box mb="50px">
      <Text>Setting margin through the mb (margin-bottom) prop</Text>
    </Box>

    <Box my="50px">
      <Text>Setting margin through the my (margin-top and margin-bottom) prop</Text>
    </Box>

    <Box mx="50px">
      <Text>Setting margin through the mx (margin-left and margin-right) prop</Text>
    </Box>
  </StoryWrapper>
));

boxStories.add('Height and Width', () => (
  <StoryWrapper>
    <Box height="100px" width="200px">
      <Text>This box is 100px in height and 200px in width </Text>
    </Box>

    <Box height="200px" width="100px">
      <Text>This box is 200px in height and 100px in width </Text>
    </Box>

    <Box height="200px" width="100%">
      <Text>This box is 200px in height and 100% of the screen in width</Text>
    </Box>
  </StoryWrapper>
));
