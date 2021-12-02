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
}

const RescheduleFormScreen = ({
  route,
  onChangeModalScreen,
}: RescheduleFormScreenProps): JSX.Element => {
  const [timeSlots, setTimeSlots] = useState<TimeSlotDataType | undefined>(
    undefined
  );
  const [submitPending, setSubmitPending] = useState<boolean>(false);
  const [cancelPending, setCancelPending] = useState<boolean>(false);

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
        endDate.format()
      );
      setSubmitPending(false);

      onChangeModalScreen(ModalScreen.Confirmation, {
        bookingItem,
        isConfirmation: true,
      });
    } catch (error) {
      setSubmitPending(false);
    }
  };

  const handleCancel = async () => {
    await cancelBooking(bookingItem.id);
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
        name="Boka om"
        description="Boka om ett möte"
        isContactsMode={false}
        availableTimes={timeSlots}
        questions={[]}
        submitPending={submitPending}
        onSubmit={handleReschedule}
      />
    </ScreenContainer>
  );
};

export default RescheduleFormScreen;
