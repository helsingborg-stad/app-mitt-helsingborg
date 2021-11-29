import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { Question } from "../types/FormTypes";
import { TimeSlot, BookingItem, TimeSlotDataType } from "../types/BookingTypes";
import {
  formDataToQuestions,
  getReferenceCodeForUser,
} from "../helpers/BookingHelper";
import AuthContext from "../store/AuthContext";
import { createBooking, getTimeSlots } from "../services/BookingService";
import { getAdministratorsBySharedMailbox } from "../services/BookablesService";
import BookingForm from "../containers/Form/BookingForm";
import FormContext from "../store/FormContext";
import { ModalScreen } from "./featureModalScreens/types";

const SpinnerContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ScreenContainer = styled.View`
  height: 80%;
  padding: 0px 10px;
`;

interface BookingFormScreenProps {
  route: any;
  onChangeModalScreen: (
    screen: ModalScreen,
    params?: Record<string, unknown>
  ) => void;
}

const BookingFormScreen = ({
  route,
  onChangeModalScreen,
}: BookingFormScreenProps): JSX.Element => {
  const [questions, setQuestions] = useState<Question[] | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<TimeSlotDataType | undefined>(
    undefined
  );
  const [submitPending, setSubmitPending] = useState<boolean>(false);
  const { getForm } = useContext(FormContext);
  const {
    formId,
    address,
    sharedMailbox,
    isContactsMode,
    contactsList,
    name,
    description,
  } = route?.params || {};
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (isContactsMode) {
        const timeSlotData = await getTimeSlots(
          contactsList,
          moment().startOf("day").format(),
          moment().add(6, "months").format()
        );

        setTimeSlots(timeSlotData);
        setQuestions([]);
      } else {
        const formData = await getForm(formId);
        const emailsResponse = await getAdministratorsBySharedMailbox(
          sharedMailbox
        );

        const timeSlotData = await getTimeSlots(
          emailsResponse,
          moment().format(),
          moment().add(6, "months").format()
        );

        setTimeSlots(timeSlotData);
        setQuestions(formDataToQuestions(formData));
      }
    };
    void fetchData();
  }, [sharedMailbox, formId, getForm, isContactsMode, user, contactsList]);

  const formatAnswer = (answer: string | boolean | undefined): string => {
    if (answer === undefined) return "Inget svar";
    if (answer === true) return "Ja";
    if (answer === false) return "Nej";
    return JSON.stringify(answer);
  };

  const selectEmailFromArray = (emailsArray: string[]): string => {
    if (emailsArray.length === 1) return emailsArray[0];
    const randomIndex = Math.floor(Math.random() * emailsArray.length);
    return emailsArray[randomIndex];
  };

  const handleSubmitForm = async (
    timeSlot: TimeSlot | undefined,
    questionsWithAnswers: { label: string; answer: string }[]
  ) => {
    if (timeSlot === undefined) return;
    setSubmitPending(true);
    try {
      let message = "";
      questionsWithAnswers.forEach((qna: { label: string; answer: string }) => {
        message += `Q: ${qna.label}\n`;
        message += `A: ${formatAnswer(qna.answer)}\n\n`;
      });
      const startDate = moment(`${timeSlot.date} ${timeSlot.startTime}`);
      const endDate = moment(`${timeSlot.date} ${timeSlot.endTime}`);
      const refCode = getReferenceCodeForUser(user);
      if (timeSlot?.emails !== undefined) {
        const selectedEmail = selectEmailFromArray(timeSlot.emails);
        await createBooking(
          [selectedEmail],
          startDate.format(),
          endDate.format(),
          [],
          refCode,
          name,
          address,
          message
        );
        setSubmitPending(false);
        const status = "None";
        const administrator = {
          email: selectedEmail,
        };
        const date = moment(startDate).format("yyyy-MM-DD");
        const startTime = moment(startDate).format("HH:mm");
        const endTime = moment(endDate).format("HH:mm");
        const title = "Mitt Helsingborg bokning";
        const bookingItem = {
          date,
          time: { startTime, endTime },
          title,
          status,
          administrator,
          addressLines: [address],
        } as BookingItem;

        onChangeModalScreen(ModalScreen.Confirmation, {
          bookingItem,
        });
      }
    } catch (error) {
      setSubmitPending(false);
    }
  };

  if (
    questions === undefined ||
    timeSlots === undefined ||
    questions === [] ||
    timeSlots === {}
  ) {
    return (
      <ScreenContainer>
        <SpinnerContainer>
          <ActivityIndicator size="large" color="slategray" />
        </SpinnerContainer>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <BookingForm
        name={name}
        description={description}
        isContactsMode={isContactsMode}
        availableTimes={timeSlots}
        questions={questions}
        submitPending={submitPending}
        onSubmit={handleSubmitForm}
      />
    </ScreenContainer>
  );
};

export default BookingFormScreen;
