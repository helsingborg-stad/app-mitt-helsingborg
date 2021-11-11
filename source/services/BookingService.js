import { post } from "../helpers/ApiRequest";

async function createBooking(
  requiredAttendees,
  optionalAttendees,
  startTime,
  endTime,
  refCode,
  address,
  message
) {
  return new Promise((resolve, reject) => {
    const body = {
      requiredAttendees,
      optionalAttendees,
      startTime,
      endTime,
      subject: "Mitt Helsingborg bokning",
      referenceCode: refCode,
      body: `Du har fått en bokning ifrån Mitt Helsingborg. Klicka på Acceptera för att bekräfta bokningen.\n\n${message}`,
      location: address,
    };

    post("/booking", body)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(
            response?.message ||
              `createBooking: Recieved error ${response.status}`
          );
        }

        const booked = response?.data?.data;
        if (booked) return resolve(booked);
        throw new Error("createBooking: Response has no data.data property");
      })
      .catch((error) => reject(error));
  });
}

export { createBooking };
