import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import type { RenderRules } from "react-native-markdown-display";

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
  /**
   * Setup for markdown formatter used to render user agreement text.
   */
  const userAgreementMarkdownRules: RenderRules = {
    text: (node) => (
      <Text style={{ fontSize: 16 }} key={node.key}>
        {node.content}
      </Text>
    ),
    bullet_list: (node, children, _parent, styles) => (
      <View key={node.key} style={[styles.list, styles.listUnordered]}>
        {children}
      </View>
    ),
  };

  return visible ? (
    <Modal visible={visible} hide={toggle}>
      <KeyboardAwareScrollView>
        <CloseModalButton
          onClose={toggle}
          primary={false}
          showBackButton={false}
          colorSchema="red"
          isSubstep={false}
        />
        <UserAgreementForm>
          <MarkdownConstructor
            rules={userAgreementMarkdownRules}
            rawText={userAgreementText}
          />
        </UserAgreementForm>
        <UserAgreementFooter>
          <Button z={0} block onClick={toggle} colorSchema="red">
            <Text>Återvänd till inloggning</Text>
          </Button>
        </UserAgreementFooter>
      </KeyboardAwareScrollView>
    </Modal>
  ) : null;
}

export default PrivacyModal;
