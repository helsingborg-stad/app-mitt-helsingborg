import React, { useCallback, useState } from "react";
import { Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styled from "styled-components/native";
import { TimeSlot } from "../../components/molecules/TimeSlotPicker/TimeSlotPicker";
import icons from "../../helpers/Icons";
import { consolidateTimeSlots } from "../../helpers/BookingHelper";
import { CharacterCard, TimeSlotPicker } from "../../components/molecules";
import { Button } from "../../components/atoms";
import FormField from "../FormField/FormField";
import { validateInput } from "../../helpers/ValidationHelper";

const Container = styled.View`
  flex: 1;
`;

const Scroller = styled(KeyboardAwareScrollView)`
  flex: 1;
`;

const ListWrapper = styled.View`
  margin: 24px;
`;

interface BookingFormProps {
  questions: Record<string, any>[];
  availableTimes: Record<string, any>;
  isContactsMode: boolean;
  onSubmit: (
    timeSlot: TimeSlot | undefined,
    formAnswers: Record<string, any>
  ) => void;
}

const BookingForm = ({
  questions,
  availableTimes,
  isContactsMode,
  onSubmit,
}: BookingFormProps): JSX.Element => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [validations, setValidations] = useState<Record<string, any>>({});
  const [timeSlot, setTimeSlot] = useState<TimeSlot>();
  const [currentEmail, setCurrentEmail] = useState<string>("");

  const emails = Object.keys(availableTimes);

  const validateAnswer = (questionId: string, validation: any) => {
    if (validation) {
      const [isValid, message] = validateInput(
        answers[questionId],
        validation.rules
      );
      setValidations({
        ...validations,
        [questionId]: isValid ? undefined : { isValid, message },
      });
    }
  };

  const updateAnswers = useCallback(
    (answer: any) => {
      setAnswers({ ...answers, ...answer });
    },
    [answers]
  );

  const updateEmail = (email: string) => {
    setCurrentEmail(email);
  };

  const submitForm = () => {
    const questionsWithAnswers = questions.map((question) => ({
      ...question,
      answer: answers[question.id],
    }));
    onSubmit(timeSlot, questionsWithAnswers);
  };

  const renderCharacterCard = (email: string) => {
    const selected = email === currentEmail;
    return (
      <CharacterCard
        key={`CharacterCard-${email}`}
        onCardClick={() => updateEmail(email)}
        title={email}
        department=""
        jobTitle=""
        icon={icons.ICON_CONTACT_PERSON_1}
        selected={selected}
      />
    );
  };

  let currentAvailableTimes = {};

  if (!isContactsMode) {
    currentAvailableTimes = consolidateTimeSlots(availableTimes);
  } else if (currentEmail) {
    currentAvailableTimes = consolidateTimeSlots({
      [currentEmail]: availableTimes[currentEmail],
    });
  }

  console.log(currentAvailableTimes);

  return (
    <Container>
      <Scroller>
        <ListWrapper>
          {isContactsMode && emails.map(renderCharacterCard)}
          <TimeSlotPicker
            availableTimes={currentAvailableTimes}
            emails={emails}
            onChange={setTimeSlot}
            value={timeSlot}
          />
          {!isContactsMode ? (
            questions.map((question) => (
              <FormField
                key={`${question.id}`}
                onChange={(value: any) => updateAnswers(value)}
                onBlur={() => validateAnswer(question.id, question.validation)}
                inputType={question.type}
                value={answers[question.id]}
                colorSchema="red"
                label={question.label}
                help={question.help}
                id={question.id}
                validationErrors={validations}
                {...question}
              />
            ))
          ) : (
            <Text>contact mode :)</Text>
          )}
        </ListWrapper>
        <Button colorSchema="red" onClick={submitForm}>
          <Text style={{ color: "white" }}>Skicka</Text>
        </Button>
      </Scroller>
    </Container>
  );
};

export default BookingForm;
