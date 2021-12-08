import React from "react";
import { Button } from "../../components/atoms";

import { ButtonPanel, ButtonContainer, ButtonText } from "./styled";

interface ForButtonPanelProps {
  deleteButtonText: string;
  deleteDisabled?: boolean;
  submitButtonText: string;
  submitDisabled?: boolean;
  submitForm: () => void;
  deleteForm: () => void;
}

const FormButtonPanel = (props: ForButtonPanelProps): JSX.Element => {
  const {
    deleteButtonText,
    deleteDisabled = false,
    submitButtonText,
    submitDisabled = false,
    submitForm,
    deleteForm,
  } = props;

  const showDeleteButton = !!deleteButtonText && deleteForm !== undefined;
  const showSubmitButton = !!submitButtonText && submitForm !== undefined;

  const showInFullWidth = showSubmitButton !== showDeleteButton;

  return (
    <ButtonPanel>
      <ButtonContainer>
        {showDeleteButton && (
          <Button
            size="large"
            disabled={deleteDisabled}
            colorSchema="neutral"
            onClick={deleteForm}
            style={{ ...(!showInFullWidth && { width: 175 }) }}
            fullWidth={showInFullWidth}
          >
            <ButtonText color="white">{deleteButtonText}</ButtonText>
          </Button>
        )}

        {showSubmitButton && (
          <Button
            size="large"
            disabled={submitDisabled}
            colorSchema="red"
            onClick={submitForm}
            style={{ ...(!showInFullWidth && { width: 175 }) }}
            fullWidth={showInFullWidth}
          >
            <ButtonText color="white">{submitButtonText}</ButtonText>
          </Button>
        )}
      </ButtonContainer>
    </ButtonPanel>
  );
};

export default FormButtonPanel;
