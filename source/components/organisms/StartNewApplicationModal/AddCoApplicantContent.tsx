import React, { useState } from "react";
import { ActivityIndicator } from "react-native";

import { Input, Text, Button } from "../../atoms";

import { ValidationHelper } from "../../../helpers";

import { Container } from "./modalContent.styled";

interface AddCoApplicantContentProps {
  onOpenForm: () => void;
}

const AddCoApplicantContent = ({
  onOpenForm,
}: AddCoApplicantContentProps): JSX.Element => {
  const [personalNumber, setPersonalNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (value: string) => {
    const sanitizedValue = ValidationHelper.sanitizePin(value);
    setPersonalNumber(sanitizedValue);
  };

  const handleAddCoApplicant = async () => {
    setErrorMessage("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // setErrorMessage("Person kan ej söka ekonomiskt bistånd i Helsingborg");
      onOpenForm();
    }, 3000);
  };

  return (
    <>
      <Container border>
        <Text>Ange personnummer för din fru, man eller sambo</Text>
        <Text
          style={{ width: "100%", paddingTop: 8, paddingBottom: 4 }}
          align="left"
          strong
        >
          Personnummer
        </Text>
        <Input
          onChangeText={handleInputChange}
          onBlur={() => undefined}
          onMount={() => undefined}
          placeholder="ååååmmddxxxx"
          value={personalNumber}
          maxLength={12}
        />
      </Container>
      <Container>
        {isLoading && <ActivityIndicator size="large" />}

        {!isLoading && (
          <Button
            fullWidth
            value="Nästa"
            colorSchema="red"
            disabled={personalNumber.length !== 12}
            onClick={handleAddCoApplicant}
          />
        )}
        {!!errorMessage && <Text style={{ color: "red" }}>{errorMessage}</Text>}
      </Container>
    </>
  );
};

export default AddCoApplicantContent;
