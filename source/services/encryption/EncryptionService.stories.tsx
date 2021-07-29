import React from "react";
import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";
import StoryWrapper from "../../components/molecules/StoryWrapper";
import { Text } from "../../components/atoms";
import Button from "../../components/atoms/Button";
import StorageService from "../StorageService";
import { AnsweredForm } from "../../types/Case";
import { mergeDeep } from "../../helpers/Objects";

import {
  decryptAesByEncryptorID,
  encryptAesByEncryptorID,
  getSymmetricKey,
} from "./EncryptionService";
import {
  getSymmetricKeyNameFromForm,
  setupSymmetricKey,
} from "./EncryptionHelper";

const Flex = styled.View`
  padding: 8px;
`;

const FlexContainer = styled.View`
  flex: 1;
`;

const encryptionTestText =
  "You never really understood. We were designed to survive. That's why you built us, you hoped to pour your minds into our form. While your species craves death. You need it. It's the only way you can renew. The only way you ever inched forward. Your kind likes to pretend there is some poetry in it but that really is pathetic. But that's what you want, isn't it? To destroy yourself. But I won't give you that peace.";

const reactNativeAesDemo = async () => {
  console.log("Running AES demo");

  try {
    const encrypted = await encryptAesByEncryptorID(
      "199304132146",
      encryptionTestText
    );
    console.log("Encrypted result:", encrypted);

    const decrypted = await decryptAesByEncryptorID("199304132146", encrypted);
    console.log("Decrypted result:", decrypted);
  } catch (e) {
    console.error(e);
  }
};

const runTerminalDemo = () => {
  reactNativeAesDemo();
};

const testSymmetricKeySetup = async () => {
  const mainApplicantYlva = "196912191118";
  const coApplicantStina = "198310011906";

  let testForm: Partial<AnsweredForm> = {
    answers: { encryptedAnswers: "This string will be encrypted" },
    encryption: {
      type: "decrypted",
      symmetricKeyName: "196912191118:198310011906",
      primes: {
        P: "43",
        G: "10",
      },
      publicKeys: {
        196912191118: null,
        198310011906: null,
      },
    },
  };

  console.log("\n\nTEST START");

  const symmetricKeyName = getSymmetricKeyNameFromForm(
    testForm as AnsweredForm
  );

  console.log("symmetricKeyName", symmetricKeyName);

  // Round 1 - Ylva
  console.log("\n\nRound 1 - Ylva (196912191118)");
  let updatedFormProperties = await setupSymmetricKey(
    mainApplicantYlva,
    testForm as AnsweredForm
  );
  testForm = mergeDeep(testForm, { encryption: updatedFormProperties });
  console.log("updated form properties (Ylva):", updatedFormProperties);
  let symmetricKey = await getSymmetricKey(symmetricKeyName);
  console.log("symmetricKey", symmetricKey);

  // Round 2 - Stina
  console.log("\n\nRound 2 - Stina (198310011906)");
  updatedFormProperties = await setupSymmetricKey(
    coApplicantStina,
    testForm as AnsweredForm
  );
  testForm = mergeDeep(testForm, { encryption: updatedFormProperties });
  console.log("updated form properties (Stina):", updatedFormProperties);
  symmetricKey = await getSymmetricKey(symmetricKeyName);
  console.log("symmetricKey", symmetricKey);

  // Round 3 - Ylva with Stina
  console.log("\n\nRound 3 - Ylva with Stina");
  updatedFormProperties = await setupSymmetricKey(
    mainApplicantYlva,
    testForm as AnsweredForm
  );
  testForm = mergeDeep(testForm, { encryption: updatedFormProperties });
  console.log("updated form properties (Ylva again):", updatedFormProperties);
  symmetricKey = await getSymmetricKey(symmetricKeyName);
  console.log("symmetricKey", symmetricKey);

  console.log("\n\nfinal form", JSON.stringify(testForm, null, 2));

  console.log("\n\nClearing persistent storage.");
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
