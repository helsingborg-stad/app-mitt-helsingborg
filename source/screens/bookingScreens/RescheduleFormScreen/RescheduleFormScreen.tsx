import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import NotifeeContext from "../../../store/NotifeeContext";
import { TimeSlot, TimeSlotDataType } from "../../../types/BookingTypes";
import {
  cancelBooking,
  getTimeSlots,
  updateBooking,
} from "../../../services/BookingService";
import BookingForm from "../../../containers/BookingForm/BookingForm";
import Dialog from "../../../components/molecules/Dialog/Dialog";
import { Text } from "../../../components/atoms";

import { ModalScreen } from "../../featureModalScreens/types";

import ConfirmDialogContent from "./ConfirmDialogContent";

import { ScreenContainer, SpinnerContainer } from "./styled";

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
  const { showScheduledNotification, removeScheduledNotification } =
    useContext(NotifeeContext);

  const [timeSlots, setTimeSlots] = useState<TimeSlotDataType | undefined>(
    undefined
  );
  const [submitPending, setSubmitPending] = useState<boolean>(false);
  const [deletePending, setDeletePending] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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
    setShowConfirmDialog(true);
    setSubmitPending(true);
    try {
      const startDate = moment(`${timeSlot.date} ${timeSlot.startTime}`);
      const endDate = moment(`${timeSlot.date} ${timeSlot.endTime}`);
      const { bookingId } = await updateBooking(
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

      const newBookingItem = {
        ...bookingItem,
        date: startDate.format("yyyy-MM-DD"),
        time: {
          startTime: startDate.format("HH:mm"),
          endTime: endDate.format("HH:mm"),
        },
      };

      setSubmitPending(false);
      setShowConfirmDialog(false);
      onChangeModalScreen(ModalScreen.Confirmation, {
        bookingItem: newBookingItem,
        isConfirmation: true,
      });

      void removeScheduledNotification(bookingItem.id);

      void showScheduledNotification({
        title: "Påminnelse",
        body: `Du har möte imorgon ${timeSlot.startTime} - ${timeSlot.endTime} på ${bookingItem.address}`,
        timestamp: startDate.subtract(1, "days").valueOf(),
        id: bookingId as string,
        data: {
          nextRoute: "Calendar",
          params: {
            initial: false,
          },
        },
      });
    } catch (error) {
      setSubmitPending(false);
      setShowConfirmDialog(false);
    }
  };

  const handleDelete = async () => {
    setDeletePending(true);
    try {
      await cancelBooking(bookingItem.id);
      await removeScheduledNotification(bookingItem.id);
      setShowConfirmDialog(false);
      closeModal();
    } catch (err) {
      setDeletePending(false);
      console.log(err);
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

  const pendingText = deletePending ? "Avbokar möte..." : "Ombokar möte...";

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
        onDelete={() => setShowConfirmDialog(true)}
      />
      <Dialog visible={showConfirmDialog}>
        {!deletePending && !submitPending ? (
          <ConfirmDialogContent
            modalHeader="Avboka möte"
            modalText="Vill du verkligen avboka ditt möte?"
            cancelButtonText="Avbryt"
            okButtonText="Ja"
            onCancelButtonClick={() => setShowConfirmDialog(false)}
            onOkButtonClick={handleDelete}
          />
        ) : (
          <>
            <Text type="h4" style={{ paddingBottom: 24 }}>
              {pendingText}
            </Text>
            <ActivityIndicator size="large" />
          </>
        )}
      </Dialog>
    </ScreenContainer>
  );
};

export default RescheduleFormScreen;
