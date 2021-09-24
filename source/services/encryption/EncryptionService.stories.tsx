import React from "react";
import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";
import StoryWrapper from "../../components/molecules/StoryWrapper";
import { Text } from "../../components/atoms";
import {
  decryptFormAnswers,
  decryptWithAesKey,
  encryptFormAnswers,
  encryptWithAesKey,
  setupSymmetricKey,
} from "./EncryptionService";
import Button from "../../components/atoms/Button";
import StorageService from "../StorageService";
import { EncryptionException, getStoredSymmetricKey } from "./EncryptionHelper";
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

const testEncryptionException = async () => {
  try {
    await StorageService.clearData();
    await decryptWithAesKey({ personalNumber: "196912191118" }, "");
  } catch (error) {
    console.log("caught error:", error);
    console.log(
      "is EncryptionException?:",
      error instanceof EncryptionException
    );
    console.log("message:", error.message);
    console.log("serialized:", JSON.stringify(error));
  }
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
    answers: [
      {
        field: { id: "test", tags: ["a", "b"] },
        value: "this will be encrypted",
      },
    ],
    encryption: {
      type: EncryptionType.DECRYPTED,
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

  updatedForm = await setupSymmetricKey(mainApplicantYlva, updatedForm);
  await printSymmetricKeyResult(mainApplicantYlva, updatedForm);

  updatedForm = await encryptFormAnswers(mainApplicantYlva, updatedForm);
  const encryptedFormCopy = JSON.parse(JSON.stringify(updatedForm));

  const { answers: decryptedAnswers1 } = await decryptFormAnswers(
    mainApplicantYlva,
    updatedForm
  );

  const updatedFormCopy = JSON.parse(JSON.stringify(encryptedFormCopy));
  const { answers: decryptedAnswers2 } = await decryptFormAnswers(
    coApplicantStina,
    updatedFormCopy
  );

  console.log("encrypted", encryptedFormCopy.answers);
  console.log("encrypted type:", encryptedFormCopy.encryption.type);
  console.log("decrypted (applicant)", decryptedAnswers1);
  console.log("decrypted (co-applicant)", decryptedAnswers2);

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
      <Flex>
        <Button
          block
          variant="outlined"
          colorSchema="blue"
          onClick={testEncryptionException}
        >
          <Text>Run Exception test</Text>
        </Button>
      </Flex>
    </FlexContainer>
  </StoryWrapper>
));
