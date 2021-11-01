import moment from "moment";

export interface BookingItem {
  date: string;
  time: { start: string; end: string };
  title: string;
  status: string;
}

const mockBookingData: BookingItem[] = [
  {
    date: moment().add(2, "days").format("yyyy-MM-DD"),
    time: { start: "11.00", end: "12.00" },
    title: "Event 1",
    status: "Busy",
  },
  {
    date: moment().add(10, "days").format("yyyy-MM-DD"),
    time: { start: "11.00", end: "12.00" },
    title: "Event 2",
    status: "Busy",
  },
  {
    date: "2022-02-18",
    time: { start: "13.00", end: "14.00" },
    title: "Event 4",
    status: "Busy",
  },
  {
    date: moment().add(45, "days").format("yyyy-MM-DD"),
    time: { start: "10.00", end: "11.00" },
    title: "Event 3",
    status: "Busy",
  },
];

export { mockBookingData };
