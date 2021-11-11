import moment from "moment";

export type Administrator = {
  title: string;
  department: string;
  jobTitle: string;
  email: string;
  phone: string;
};

export type BookingItem = {
  date: string;
  time: { startTime: string; endTime: string };
  title: string;
  status: string;
  administrator: Administrator;
  addressLines: string[];
};

const mockAdministrator: Administrator = {
  title: "Lex Luthor",
  department: "Socialförvaltningen",
  jobTitle: "Socialsekreterare",
  email: "kontaktcenter@helsingborg.se",
  phone: "042 - 00 00 00",
};

const mockAddressLines = ["Socialförvaltningen", "Bredgatan 17"];

const mockBookingData: BookingItem[] = [
  {
    date: moment().add(2, "days").format("yyyy-MM-DD"),
    time: { startTime: "11.00", endTime: "12.00" },
    title: "Event 1",
    status: "Busy",
    administrator: mockAdministrator,
    addressLines: mockAddressLines,
  },
  {
    date: moment().add(10, "days").format("yyyy-MM-DD"),
    time: { startTime: "11.00", endTime: "12.00" },
    title: "Event 2",
    status: "Busy",
    administrator: mockAdministrator,
    addressLines: mockAddressLines,
  },
  {
    date: "2022-02-18",
    time: { startTime: "13.00", endTime: "14.00" },
    title: "Event 4",
    status: "Busy",
    administrator: mockAdministrator,
    addressLines: mockAddressLines,
  },
  {
    date: moment().add(45, "days").format("yyyy-MM-DD"),
    time: { startTime: "10.00", endTime: "11.00" },
    title: "Event 3",
    status: "Busy",
    administrator: mockAdministrator,
    addressLines: mockAddressLines,
  },
];

export { mockBookingData };
