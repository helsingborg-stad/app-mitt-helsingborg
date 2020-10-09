import React, { ReactNode } from "react";
import styled from "styled-components/native";
import { Text } from "../../atoms";

const FormFieldGroupContainer = styled.View`
  margin-top: 50px;
  background: transparent;
`;

const FormFieldGroupBody = styled.View`
  background: transparent;
`;

const FormFieldGroupName = styled(Text)`
  color: #000;
  padding-left: 14px;
  margin-bottom: 14px;
  font-weight: bold;
  font-size: 18px;
`;

interface FormFieldGroupProps {
  /** The main content of the form field group */
  children: ReactNode;

  /** The name to be rendered for the form field group */
  name?: string;
}

function FormFieldGroup({ name, children }: FormFieldGroupProps) {
  return (
    <FormFieldGroupContainer>
      {name && <FormFieldGroupName>{name}</FormFieldGroupName>}
      <FormFieldGroupBody>{children}</FormFieldGroupBody>
    </FormFieldGroupContainer>
  );
}

export default FormFieldGroup;
