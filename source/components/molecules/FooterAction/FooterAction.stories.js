import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'source/components/atoms';
import StoryWrapper from '../StoryWrapper';
import FooterAction from './FooterAction';

const styles = StyleSheet.create({
  buttonWrapper: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 18,
  },
});
const ButtonList = () => (
  <View style={styles.buttonWrapper}>
    <Button color="green">
      <Text>Fortsätt</Text>
    </Button>
    <Button color="blue" z={0}>
      <Text>Fortsätt senare</Text>
    </Button>
  </View>
);
const Save = () => (
  <View style={styles.buttonWrapper}>
    <Button color="green">
      <Text>Spara utgift</Text>
    </Button>
  </View>
);

const Start = () => (
  <View style={styles.buttonWrapper}>
    <Button color="blue">
      <Text>Ja, jag är redo</Text>
    </Button>
    <Button color="orange" z={0}>
      <Text>Nej, jag väntar</Text>
    </Button>
  </View>
);

storiesOf('Footer', module)
  .add('Forward/ Cancel', props => (
    <StoryWrapper {...props}>
      <FooterAction ButtonList={ButtonList} />
    </StoryWrapper>
  ))
  .add('Save', props => (
    <StoryWrapper {...props}>
      <FooterAction ButtonList={Save} />
    </StoryWrapper>
  ))
  .add('Start', props => (
    <StoryWrapper {...props}>
      <FooterAction ButtonList={Start} background="#FFAA9B" />
    </StoryWrapper>
  ));
