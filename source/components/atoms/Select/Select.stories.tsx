import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import { View } from 'react-native';
import StoryWrapper from '../../molecules/StoryWrapper';
import Button from '../Button';
import Text from '../Text';
import Select from './Select';

const SelectStory = () => {
  const [value, setValue] = useState('');
  return (
    <>
      <Select
        onValueChange={(developer) => {
          setValue(developer);
        }}
        placeholder="Select a developer"
        items={[
          { label: 'Nikolas', value: 'nikolas' },
          { label: 'Ehsan', value: 'ehsan' },
          { label: 'Jonatan', value: 'jonatan' },
          { label: 'Dan', value: 'dan' },
          { label: 'Teddy', value: 'teddy' },
        ]}
        value={value}
      />
    </>
  );
};
const SelectStoryDisabled = () => {
  const [value, setValue] = useState('');
  const [editable, setEditable] = useState(false);
  return (
    <>
      <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-around' }}>
        <Button onClick={() => setEditable((e) => !e)}>
          <Text>Toggle Editable</Text>
        </Button>
        <Text>Can edit country input below: {JSON.stringify(editable)}</Text>
      </View>
      <Select
        onValueChange={(developer) => {
          setValue(developer);
        }}
        editable={editable}
        placeholder="Select the best nordic country"
        items={[
          { label: 'Sverige', value: 'swe' },
          { label: 'Danmark', value: 'den' },
          { label: 'Finland', value: 'fin' },
          { label: 'Norway', value: 'nor' },
        ]}
        value={value}
      />
    </>
  );
};

storiesOf('Select', module).add('default', () => (
  <StoryWrapper>
    <SelectStory />
    <SelectStoryDisabled />
  </StoryWrapper>
));
