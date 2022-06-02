import React from "react";

import { Text } from "../../atoms";

import { Container, StyledButton } from "./modalContent.styled";

interface ApplicationProdecureContentProps {
  onChangeContent: () => void;
  onOpenForm: () => void;
}
const ApplicationProdecureContent = ({
  onChangeContent,
  onOpenForm,
}: ApplicationProdecureContentProps): JSX.Element => (
  <>
    <Container border>
      <Text align="center" type="h5">
        Söker du själv eller ihop med någon?
      </Text>
    </Container>
    <Container border>
      <Text>
        Om du har en fru, man eller sambo ska ni söka bistånd tillsammans.
      </Text>
    </Container>
    <Container>
      <StyledButton
        value="Söker själv"
        fullWidth
        colorSchema="red"
        onClick={onOpenForm}
      />
      <StyledButton
        onClick={onChangeContent}
        value="Söker med man fru eller sambo"
        fullWidth
        colorSchema="red"
      />
    </Container>
  </>
);

export default ApplicationProdecureContent;
