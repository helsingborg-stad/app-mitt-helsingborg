import moment from "moment";

export interface BookingItem {
  date: string;
  time: { startTime: string; endTime: string };
  title: string;
  status: string;
}

const mockBookingData: BookingItem[] = [
  {
    date: moment().add(2, "days").format("yyyy-MM-DD"),
    time: { startTime: "11.00", endTime: "12.00" },
    title: "Event 1",
    status: "Busy",
  },
  {
    date: moment().add(10, "days").format("yyyy-MM-DD"),
    time: { startTime: "11.00", endTime: "12.00" },
    title: "Event 2",
    status: "Busy",
  },
  {
    date: "2022-02-18",
    time: { startTime: "13.00", endTime: "14.00" },
    title: "Event 4",
    status: "Busy",
  },
  {
    date: moment().add(45, "days").format("yyyy-MM-DD"),
    time: { startTime: "10.00", endTime: "11.00" },
    title: "Event 3",
    status: "Busy",
  },
];

export { mockBookingData };
