import styled from "styled-components/native";

import BackNavigation from "../../components/molecules/BackNavigation";
import { Modal as ModalBase } from "../../components/molecules/Modal";

const UnifiedPadding = [24, 48];

const UserAgreementForm = styled.View`
  padding: ${UnifiedPadding[0]}px ${UnifiedPadding[1]}px ${UnifiedPadding[0]}px
    ${UnifiedPadding[1]}px;
`;

const UserAgreementFooter = styled.View`
  padding: ${UnifiedPadding[0]}px ${UnifiedPadding[1]}px ${UnifiedPadding[0]}px
    ${UnifiedPadding[1]}px;
`;

const Modal = styled(ModalBase)`
  background-color: ${(props) => props.theme.colors.neutrals[6]};
`;

const CloseModalButton = styled(BackNavigation)`
  padding: 24px;
`;

export { CloseModalButton, Modal, UserAgreementFooter, UserAgreementForm };
