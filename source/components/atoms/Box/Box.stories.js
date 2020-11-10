import { storiesOf } from '@storybook/react-native';
import React from 'react';
import StoryWrapper from '../../molecules/StoryWrapper';
import Text from '../Text';
import Box from './Box';

const boxStories = storiesOf('Box', module);

boxStories.add('Padding', () => (
  <StoryWrapper>
    <Box bg="#ccc" p="50px 0 50px 0">
      <Text>Setting padding through the p prop</Text>
    </Box>

    <Box bg="#ececec" pl="50px">
      <Text>Setting padding through the pl (padding-left) prop</Text>
    </Box>

    <Box bg="#ccc" pr="50px">
      <Text>Setting padding through the pr (padding-right) prop</Text>
    </Box>

    <Box bg="#ececec" pt="50px">
      <Text>Setting padding through the pt (padding-top) prop</Text>
    </Box>

    <Box bg="#ccc" pb="50px">
      <Text>Setting padding through the pb (padding-bottom) prop</Text>
    </Box>

    <Box bg="#ececec" py="50px">
      <Text>Setting padding through the py (padding-top and padding-bottom) prop</Text>
    </Box>

    <Box bg="#ccc" px="50px">
      <Text>Setting padding through the px (padding-left and padding-right) prop</Text>
    </Box>
  </StoryWrapper>
));

boxStories.add('Margin', () => (
  <StoryWrapper>
    <Box bg="#ccc" m="50px 0 50px 0">
      <Text>Setting margin through the p prop</Text>
    </Box>

    <Box bg="#ccc" ml="50px">
      <Text>Setting margin through the ml (margin-left) prop</Text>
    </Box>

    <Box bg="#ccc" mr="50px">
      <Text>Setting margin through the mr (margin-right) prop</Text>
    </Box>

    <Box bg="#ccc" mt="50px">
      <Text>Setting margin through the mt (margin-top) prop</Text>
    </Box>

    <Box bg="#ccc" mb="50px">
      <Text>Setting margin through the mb (margin-bottom) prop</Text>
    </Box>

    <Box bg="#ccc" my="50px">
      <Text>Setting margin through the my (margin-top and margin-bottom) prop</Text>
    </Box>

    <Box bg="#ccc" mx="50px">
      <Text>Setting margin through the mx (margin-left and margin-right) prop</Text>
    </Box>
  </StoryWrapper>
));

boxStories.add('Height and Width', () => (
  <StoryWrapper>
    <Box bg="aliceblue" height="100px" width="200px">
      <Text>This box is 100px in height and 200px in width </Text>
    </Box>

    <Box bg="grey" height="200px" width="100px">
      <Text>This box is 200px in height and 100px in width </Text>
    </Box>

    <Box bg="aliceblue" height="250px" width="100%">
      <Text>This box is 250px in height and 100% of the parent container in width</Text>
    </Box>
  </StoryWrapper>
));

boxStories.add('Background', () => (
  <StoryWrapper>
    <Box bg="#ececec" height="100px" width="100%">
      <Text>This box has a background color of #ececec passed thorugh the bg prop</Text>
    </Box>

    <Box colorSchema="blue" height="100px" width="100%">
      <Text>
        This box has a blue background color that is retreived from the theme context by using the
        colorSchema prop. You can also use purple, red and green.
      </Text>
    </Box>
  </StoryWrapper>
));
