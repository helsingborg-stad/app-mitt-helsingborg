import moment from "moment";
import { get, patch, post, remove } from "../helpers/ApiRequest";

const getBooking = async (id: string): Promise<Record<string, unknown>> => {
  const response = await get(`/booking/${encodeURIComponent(id)}`);
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
  optionalAttendees: string[],
  startTime: string,
  endTime: string,
  refCode: string,
  address: string,
  message: string
): Promise<Record<string, unknown>> => {
  const body = {
    requiredAttendees,
    optionalAttendees,
    startTime: moment(startTime).format(),
    endTime: moment(endTime).format(),
    subject: "Mitt Helsingborg bokning",
    referenceCode: refCode,
    body: `Du har fått en bokning ifrån Mitt Helsingborg. Klicka på Acceptera för att bekräfta bokningen.\n\n${message}`,
    location: address,
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

const cancelBooking = async (id: string): Promise<Record<string, unknown>> => {
  const response = await remove(`/booking/${encodeURIComponent(id)}`);
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
  id: string,
  requiredAttendees: string[],
  optionalAttendees: string[],
  startTime: string,
  endTime: string,
  refCode: string,
  address: string,
  message: string
): Promise<Record<string, unknown>> => {
  const body = {
    requiredAttendees,
    optionalAttendees,
    startTime: moment(startTime).format(),
    endTime: moment(endTime).format(),
    subject: "Mitt Helsingborg bokning",
    referenceCode: refCode,
    body: `Du har fått en bokning ifrån Mitt Helsingborg. Klicka på Acceptera för att bekräfta bokningen.\n\n${message}`,
    location: address,
  };

  const response = await patch(`/booking/${encodeURIComponent(id)}`, body);
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
): Promise<Record<string, unknown>[]> => {
  const response = await get(
    `/booking/search/${encodeURIComponent(referenceCode)}` +
      `?startTime=${startTime}&endTime=${endTime}`
  );
  if (response.status !== 200) {
    throw new Error(
      response?.message || `searchBookings: Recieved error ${response.status}`
    );
  }

  const bookings = response?.data?.data?.attributes;
  if (bookings) return bookings;
  throw new Error(
    "searchBookings: Response does not contain data.data.attributes"
  );
};

const getHistoricalAttendees = async (
  refCode: string,
  startTime: string,
  endTime: string
): Promise<string[]> => {
  const response = await get(
    `/booking/getHistoricalAttendees/${encodeURIComponent(refCode)}` +
      `?startTime=${startTime}` +
      `&endTime=${endTime}`
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
): Promise<Record<string, unknown>> => {
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

  const timeSlots = response?.data?.data?.attributes;
  if (timeSlots) return timeSlots;
  throw new Error(
    "getTimeSlots: Response does not contain data.data.attributes"
  );
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
