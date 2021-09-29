import React from "react";
import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";
import StoryWrapper from "../../components/molecules/StoryWrapper";
import { Text } from "../../components/atoms";
import {
  decryptWithAesKey,
  encryptWithAesKey,
  setupSymmetricKey,
} from "./EncryptionService";
import Button from "../../components/atoms/Button";
import StorageService from "../StorageService";
import { getStoredSymmetricKey } from "./EncryptionHelper";
import { AnsweredForm } from "../../types/Case";
import { EncryptionType } from "../../types/Encryption";

const Flex = styled.View`
  padding: 8px;
`;

const FlexContainer = styled.View`
  flex: 1;
`;

const encryptionTestText =
  "You never really understood. We were designed to survive. That's why you built us, you hoped to pour your minds into our form. While your species craves death. You need it. It's the only way you can renew. The only way you ever inched forward. Your kind likes to pretend there is some poetry in it but that really is pathetic. But that's what you want, isn't it? To destroy yourself. But I won't give you that peace.";

const reactNativeAesDemo = () => {
  console.log("Running AES demo");

  encryptWithAesKey({ personalNumber: "199304132146" }, encryptionTestText)
    .then((encryptedResult) => {
      console.log("Encrypted result:", encryptedResult);
      return decryptWithAesKey(
        { personalNumber: "199304132146" },
        encryptedResult
      ).then((text) => {
        console.log("Decrypted:", text);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const runTerminalDemo = () => {
  reactNativeAesDemo();
};

const printPublicKeyResult = (user, form) => {
  console.log(
    `Updated user ${user.personalNumber} public key: ${
      form.encryption.publicKeys[user.personalNumber]
    }`
  );
};

const printSymmetricKeyResult = async (user, form) => {
  const key = await getStoredSymmetricKey(form);
  console.log(`User ${user.personalNumber} symmetric key ${key}`);
};

const testSymmetricKeySetup = async () => {
  const mainApplicantYlva = {
    personalNumber: "196912191118",
  };
  const coApplicantStina = {
    personalNumber: "198310011906",
  };
  const testForm: Partial<AnsweredForm> = {
    answers: { encryptedAnswers: "This string will be encrypted" },
    encryption: {
      type: EncryptionType.Decrypted,
      symmetricKeyName: "196912191118:198310011906",
      primes: {
        P: 43,
        G: 10,
      },
      publicKeys: {
        196912191118: undefined,
        198310011906: undefined,
      },
    },
  };

  console.log("\n\nTEST START");

  let updatedForm = await setupSymmetricKey(
    mainApplicantYlva,
    testForm as AnsweredForm
  );
  printPublicKeyResult(mainApplicantYlva, updatedForm);

  updatedForm = await setupSymmetricKey(coApplicantStina, updatedForm);
  printPublicKeyResult(coApplicantStina, updatedForm);
  await printSymmetricKeyResult(coApplicantStina, updatedForm);

  await setupSymmetricKey(mainApplicantYlva, updatedForm);
  await printSymmetricKeyResult(mainApplicantYlva, updatedForm);

  console.log("Cleaning up...");
  console.log("Removing any stored symmetric keys.");
  await StorageService.clearData();
  console.log("\nTEST END");
};

storiesOf("EncryptionService", module).add("Terminal demo", (props) => (
  <StoryWrapper {...props}>
    <FlexContainer>
      <Flex>
        <Text>Demo will be run in terminal.</Text>
        <Button
          block
          variant="outlined"
          colorSchema="blue"
          onClick={runTerminalDemo}
        >
          <Text>Run AES demo in terminal</Text>
        </Button>
      </Flex>
      <Flex>
        <Button
          block
          variant="outlined"
          colorSchema="blue"
          onClick={testSymmetricKeySetup}
        >
          <Text>Run symmetric key demo</Text>
        </Button>
      </Flex>
    </FlexContainer>
  </StoryWrapper>
));
