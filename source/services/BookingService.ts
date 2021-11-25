import moment from "moment";
import {
  BookingItem,
  convertGraphDataToBookingItem,
  TimeSlotDataType,
} from "../helpers/BookingHelper";
import { get, patch, post, remove } from "../helpers/ApiRequest";

const getBooking = async (
  bookingId: string
): Promise<Record<string, unknown>> => {
  const response = await get(`/booking/${encodeURIComponent(bookingId)}`);
  if (response.status !== 200) {
    throw new Error(
      response?.message || `getBooking: Recieved error ${response.status}`
    );
  }

  const success = response?.data?.data?.attributes;
  if (success) return success;
  throw new Error("getBooking: Response does not contain data.data.attributes");
};

const createBooking = async (
  requiredAttendees: string[],
  startTime: string,
  endTime: string,
  optionalAttendees?: string[],
  referenceCode?: string,
  subject?: string,
  location?: string,
  message?: string
): Promise<Record<string, unknown>> => {
  const body = {
    requiredAttendees,
    startTime: moment(startTime).format(),
    endTime: moment(endTime).format(),
    optionalAttendees,
    referenceCode,
    location,
    body: `Du har fått en bokning ifrån Mitt Helsingborg. Klicka på Acceptera för att bekräfta bokningen.\n\n${message}`,
    subject: subject || "Mitt Helsingborg bokning",
  };

  const response = await post("/booking", body);
  if (response.status !== 200) {
    throw new Error(
      response?.message || `createBooking: Recieved error ${response.status}`
    );
  }

  const booked = response?.data?.data;
  if (booked) return booked;
  throw new Error("createBooking: Response does not contain data.data");
};

const cancelBooking = async (
  bookingId: string
): Promise<Record<string, unknown>> => {
  const response = await remove(`/booking/${encodeURIComponent(bookingId)}`);
  if (response.status !== 200) {
    throw new Error(
      response?.message || `cancelBooking: Recieved error ${response.status}`
    );
  }

  const success = response?.data?.data;
  if (success) return success;
  throw new Error("cancelBooking: Response does not contain data.data");
};

const updateBooking = async (
  bookingId: string,
  requiredAttendees: string[],
  startTime: string,
  endTime: string,
  optionalAttendees?: string[],
  referenceCode?: string,
  location?: string,
  message?: string
): Promise<Record<string, unknown>> => {
  const body = {
    requiredAttendees,
    startTime: moment(startTime).format(),
    endTime: moment(endTime).format(),
    optionalAttendees,
    referenceCode,
    location,
    body: `Du har fått en bokning ifrån Mitt Helsingborg. Klicka på Acceptera för att bekräfta bokningen.\n\n${message}`,
    subject: "Mitt Helsingborg bokning",
  };

  const response = await patch(
    `/booking/${encodeURIComponent(bookingId)}`,
    body
  );
  if (response.status !== 200) {
    throw new Error(
      response?.message || `updateBooking: Recieved error ${response.status}`
    );
  }

  const booked = response?.data?.data;
  if (booked) return booked;
  throw new Error("updateBooking: Response does not contain data.data");
};

const searchBookings = async (
  referenceCode: string,
  startTime: string,
  endTime: string
): Promise<BookingItem[]> => {
  const response = await post(`/booking/search`, {
    referenceCode,
    startTime,
    endTime,
  });
  if (response.status !== 200) {
    throw new Error(
      response?.message || `searchBookings: Recieved error ${response.status}`
    );
  }

  const bookings = response?.data?.data?.attributes;
  if (!bookings) {
    throw new Error(
      "searchBookings: Response does not contain data.data.attributes"
    );
  }

  return bookings
    .map(convertGraphDataToBookingItem)
    .filter((item: BookingItem) => item.status !== "Declined");
};

const getHistoricalAttendees = async (
  referenceCode: string,
  startTime: string,
  endTime: string
): Promise<string[]> => {
  const response = await get(
    `/booking/getHistoricalAttendees/${referenceCode}`,
    undefined,
    { startTime, endTime }
  );
  if (response.status !== 200) {
    throw new Error(
      response?.message ||
        `getHistoricalAttendees: Recieved error ${response.status}`
    );
  }

  const timeSlots = response?.data?.data?.attributes;
  if (timeSlots) return timeSlots;
  throw new Error(
    "getHistoricalAttendees: Response does not contain data.data.attributes"
  );
};

const getTimeSlots = async (
  attendees: string[],
  startTime: string,
  endTime: string
): Promise<TimeSlotDataType> => {
  const response = await post(`/timeslots/getTimeSlots`, {
    attendees,
    startTime,
    endTime,
  });
  if (response.status !== 200) {
    throw new Error(
      response?.message || `getTimeSlots: Recieved error ${response.status}`
    );
  }

  const timeSlots = response?.data?.data;
  if (timeSlots) return timeSlots;
  throw new Error("getTimeSlots: Response does not contain data.data");
};

export {
  getBooking,
  createBooking,
  cancelBooking,
  updateBooking,
  searchBookings,
  getHistoricalAttendees,
  getTimeSlots,
};
