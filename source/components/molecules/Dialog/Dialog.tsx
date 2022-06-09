import React from "react";

import { Modal } from "../Modal";
import Body from "./Body";
import Wrapper from "./Wrapper";

export interface Props {
  children?: any;
  visible: boolean;
}

/** Simple popup dialog asking the user if they really want to exit the form. Partially asks the background. */
const Dialog: React.FC<Props> = ({ visible, children }) => (
  <Modal
    visible={visible ?? true}
    hide={() => undefined}
    transparent
    presentationStyle="overFullScreen"
    animationType="fade"
    statusBarTranslucent
  >
    <Wrapper>
      <Body>{children}</Body>
    </Wrapper>
  </Modal>
);

export default Dialog;
