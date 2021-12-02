import moment from "moment";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { TimeSlot, TimeSlotDataType } from "../../../types/BookingTypes";
import {
  cancelBooking,
  getTimeSlots,
  updateBooking,
} from "../../../services/BookingService";
import BookingForm from "../../../containers/BookingForm/BookingForm";
import { ModalScreen } from "../../featureModalScreens/types";

const SpinnerContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ScreenContainer = styled.View`
  height: 80%;
  padding: 0px 10px;
`;

interface RescheduleFormScreenProps {
  route: any;
  onChangeModalScreen: (
    screen: ModalScreen,
    params?: Record<string, unknown>
  ) => void;
  closeModal: () => void;
}

const RescheduleFormScreen = ({
  route,
  onChangeModalScreen,
  closeModal,
}: RescheduleFormScreenProps): JSX.Element => {
  const [timeSlots, setTimeSlots] = useState<TimeSlotDataType | undefined>(
    undefined
  );
  const [submitPending, setSubmitPending] = useState<boolean>(false);
  const [deletePending, setDeletePending] = useState<boolean>(false);

  const { bookingItem } = route?.params || {};

  useEffect(() => {
    const fetchTimeSlots = async () => {
      const timeSlotData = await getTimeSlots(
        [bookingItem.administrator.email],
        moment().startOf("day").format(),
        moment().add(6, "months").format()
      );

      setTimeSlots(timeSlotData);
    };
    void fetchTimeSlots();
  }, [bookingItem]);

  const handleReschedule = async (timeSlot: TimeSlot | undefined) => {
    if (timeSlot === undefined) return;
    setSubmitPending(true);
    try {
      const startDate = moment(`${timeSlot.date} ${timeSlot.startTime}`);
      const endDate = moment(`${timeSlot.date} ${timeSlot.endTime}`);
      await updateBooking(
        bookingItem.id,
        [bookingItem.administrator.email],
        startDate.format(),
        endDate.format(),
        [],
        bookingItem.referenceCode,
        bookingItem.title,
        bookingItem.address,
        bookingItem.message
      );
      setSubmitPending(false);

      const newBookingItem = {
        ...bookingItem,
        date: startDate.format("yyyy-MM-DD"),
        time: {
          startTime: startDate.format("HH:mm"),
          endTime: endDate.format("HH:mm"),
        },
      };

      onChangeModalScreen(ModalScreen.Confirmation, {
        bookingItem: newBookingItem,
        isConfirmation: true,
      });
    } catch (error) {
      setSubmitPending(false);
    }
  };

  const handleDelete = async () => {
    setDeletePending(true);
    try {
      await cancelBooking(bookingItem.id);
      closeModal();
    } catch (err) {
      console.log(err);
    } finally {
      setDeletePending(false);
    }
  };

  if (timeSlots === undefined || timeSlots === {}) {
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
        name={bookingItem.title}
        description={bookingItem.body || "Boka om eller avboka bokning"}
        administrator={bookingItem.administrator}
        isContactsMode={false}
        availableTimes={timeSlots}
        questions={[]}
        submitButtonText="Skicka ombokning"
        submitPending={submitPending}
        onSubmit={handleReschedule}
        deleteButtonText="Avboka"
        deletePending={deletePending}
        onDelete={handleDelete}
      />
    </ScreenContainer>
  );
};

export default RescheduleFormScreen;
