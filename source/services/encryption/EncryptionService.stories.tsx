import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View } from 'react-native';
import StoryWrapper from '../../components/molecules/StoryWrapper';
import { Text } from '../../components/atoms';
import { decryptWithAesKey, encryptWithAesKey } from './EncryptionService';
import Button from '../../components/atoms/Button';

const encryptionTestText =
  "You never really understood. We were designed to survive. That's why you built us, you hoped to pour your minds into our form. While your species craves death. You need it. It's the only way you can renew. The only way you ever inched forward. Your kind likes to pretend there is some poetry in it but that really is pathetic. But that's what you want, isn't it? To destroy yourself. But I won't give you that peace.";

const reactNativeAesDemo = () => {
  console.log('Running AES demo');

  try {
    encryptWithAesKey({ personalNumber: '199304132146' }, encryptionTestText).then(
      (encryptedResult) => {
        console.log('Encrypted result:', encryptedResult);

        decryptWithAesKey({ personalNumber: '199304132146' }, encryptedResult)
          .then((text) => {
            console.log('Decrypted:', text);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    );
  } catch (e) {
    console.error(e);
  }
};

const runTerminalDemo = () => {
  reactNativeAesDemo();
};

storiesOf('EncryptionService', module).add('Terminal demo', (props) => (
  <StoryWrapper {...props}>
    <View>
      <Text>Demo will be run in terminal.</Text>
      <Button colorSchema="neutral" onClick={runTerminalDemo}>
        <Text>Run AES demo in terminal</Text>
      </Button>
    </View>
  </StoryWrapper>
));
