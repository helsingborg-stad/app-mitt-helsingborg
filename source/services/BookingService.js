import moment from "moment";
import { get, post, remove } from "../helpers/ApiRequest";

const createBooking = async (
  requiredAttendees,
  optionalAttendees,
  startTime,
  endTime,
  refCode,
  address,
  message
) => {
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

  const booked = response?.data?.data?.attributes;
  if (booked) return booked;
  throw new Error(
    "createBooking: Response does not contain data.data.attributes"
  );
};

const getTimeSlots = async (attendees, startTime, endTime) => {
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

const deleteBooking = async (id) => {
  const response = await remove(`/booking/${encodeURIComponent(id)}`);
  if (response.status !== 200) {
    throw new Error(
      response?.message || `deleteBooking: Recieved error ${response.status}`
    );
  }

  const success = response?.data?.data?.attributes;
  if (success) return success;
  throw new Error(
    "deleteBooking: Response does not contain data.data.attributes"
  );
};

const searchBookings = async (referenceCode, startTime, endTime) => {
  const response = await get(
    `/booking/search/${encodeURIComponent(referenceCode)}` +
      `?startTime=${startTime}&endTime=${endTime}`
  );
  const bookings = response?.data?.data?.attributes;
  if (bookings) return bookings;
  throw new Error(
    "searchBookings: Response does not contain data.data.attributes"
  );
};

export { createBooking, getTimeSlots, searchBookings, deleteBooking };
