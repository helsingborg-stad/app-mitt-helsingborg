import React, { useCallback, useState } from "react";
import { Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styled from "styled-components/native";
import { Question } from "../../types/FormTypes";
import { ValidationObject } from "../../types/Validation";
import { consolidateTimeSlots } from "../../helpers/BookingHelper";
import { TimeSlot, TimeSlotDataType } from "../../types/BookingTypes";
import icons from "../../helpers/Icons";
import { CharacterCard, TimeSlotPicker } from "../../components/molecules";
import { Button } from "../../components/atoms";
import FormField from "../FormField/FormField";
import { validateInput } from "../../helpers/ValidationHelper";

const Scroller = styled(KeyboardAwareScrollView)`
  flex: 1;
`;

const ListWrapper = styled.View`
  margin: 24px 15px;
`;

const CharacterCardWrapper = styled.View`
  margin-bottom: 15px;
`;

const SubmitButton = styled(Button)`
  margin-left: 15px;
`;

interface BookingFormProps {
  questions: Question[];
  availableTimes: TimeSlotDataType;
  isContactsMode: boolean;
  onSubmit: (
    timeSlot: TimeSlot | undefined,
    formAnswers: { label: string; answer: string }[]
  ) => void;
}

type ValidationError = {
  isValid: boolean;
  message: string;
};

const BookingForm = ({
  questions,
  availableTimes,
  isContactsMode,
  onSubmit,
}: BookingFormProps): JSX.Element => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, ValidationError>
  >({});
  const [timeSlot, setTimeSlot] = useState<TimeSlot | undefined>();
  const [currentEmail, setCurrentEmail] = useState<string>("");

  const contactQuestions: Question[] = [
    {
      label: "Kommentar",
      type: "text",
      id: "comment",
      description: "Kommentar",
      placeholder: "Kommentar till kontaktpersonen",
      validation: { isRequired: false, rules: [] },
    },
  ];

  const emails = Object.keys(availableTimes);

  const validateAnswer = (
    questionId: string,
    validation: ValidationObject | undefined
  ) => {
    if (validation) {
      const [isValid, message] = validateInput(
        answers[questionId] as string,
        validation.rules
      );
      setValidationErrors({
        ...validationErrors,
        [questionId]: { isValid, message },
      });
    }
  };

  const updateAnswers = useCallback(
    (answer: Record<string, string>) => {
      console.log(answer);
      setAnswers({ ...answers, ...answer });
    },
    [answers]
  );

  const updateEmail = (email: string) => {
    setTimeSlot(undefined);
    setCurrentEmail(email);
  };

  const submitForm = () => {
    const questionsWithAnswers = questions.map((question) => ({
      label: question.label,
      answer: answers[question.id],
    }));
    if (timeSlot !== undefined) onSubmit(timeSlot, questionsWithAnswers);
  };

  const renderCharacterCard = (email: string) => {
    const selected = email === currentEmail;
    return (
      <CharacterCardWrapper>
        <CharacterCard
          key={`CharacterCard-${email}`}
          onCardClick={() => updateEmail(email)}
          title={email}
          department=""
          jobTitle=""
          icon={icons.ICON_CONTACT_PERSON_1}
          selected={selected}
        />
      </CharacterCardWrapper>
    );
  };

  const canSubmit = timeSlot?.startTime !== undefined;
  let currentAvailableTimes = {};
  let questionsToMap = [];

  if (!isContactsMode) {
    currentAvailableTimes = consolidateTimeSlots(availableTimes);
    questionsToMap = questions;
  } else {
    questionsToMap = contactQuestions;
    if (currentEmail) {
      currentAvailableTimes = consolidateTimeSlots({
        [currentEmail]: availableTimes[currentEmail],
      });
    }
  }

  return (
    <Scroller>
      <ListWrapper>
        {isContactsMode && emails.map(renderCharacterCard)}
        <TimeSlotPicker
          availableTimes={currentAvailableTimes}
          onChange={setTimeSlot}
          value={timeSlot}
        />
        {questionsToMap.map((question) => (
          <FormField
            key={`${question.id}`}
            label={question.label}
            labelLine={question.labelLine}
            inputType={question.type}
            colorSchema="red"
            id={question.id}
            onChange={(newAnswer: Record<string, string>) =>
              updateAnswers(newAnswer)
            }
            onBlur={() => validateAnswer(question.id, question.validation)}
            onFocus={() => true}
            onMount={() => true}
            onAddAnswer={() => true}
            value={answers[question.id]}
            answers={answers}
            validationErrors={validationErrors}
            help={question.help}
            inputSelectValue={question.type}
            type={question.type}
            description={question.description}
            conditionalOn={question.conditionalOn}
            placeholder={question.placeholder}
            explainer={question.explainer}
            loadPrevious={question.loadPrevious}
            items={question.items}
            inputs={question.inputs}
            validation={question.validation}
            choices={question.choices}
            text={question.text}
          />
        ))}
      </ListWrapper>
      <SubmitButton
        colorSchema="red"
        onClick={submitForm}
        disabled={!canSubmit}
      >
        <Text style={{ color: canSubmit ? "white" : "gray" }}>Skicka</Text>
      </SubmitButton>
    </Scroller>
  );
};

export default BookingForm;
