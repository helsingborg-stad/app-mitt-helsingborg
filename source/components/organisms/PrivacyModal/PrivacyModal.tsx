import React from "react";
import { ScrollView } from "react-native";

import userAgreementText from "../../../assets/text/userAgreementText";

import { Button, Text } from "../../atoms";

import MarkdownConstructor from "../../../helpers/MarkdownConstructor";

import {
  CloseModalButton,
  Modal,
  UserAgreementFooter,
  UserAgreementForm,
} from "./PrivacyModal.styled";

import type { PrivacyModalProps } from "./PrivacyModal.types";

function PrivacyModal({
  visible,
  toggle,
}: PrivacyModalProps): JSX.Element | null {
  return visible ? (
    <Modal visible={visible} hide={toggle}>
      <ScrollView>
        <CloseModalButton
          onClose={toggle}
          primary={false}
          showBackButton={false}
          colorSchema="red"
          isSubstep={false}
        />
        <UserAgreementForm>
          <MarkdownConstructor rawText={userAgreementText} />
        </UserAgreementForm>

        <UserAgreementFooter>
          <Button z={0} block onClick={toggle} colorSchema="red">
            <Text>Återvänd till inloggning</Text>
          </Button>
        </UserAgreementFooter>
      </ScrollView>
    </Modal>
  ) : null;
}

export default PrivacyModal;
