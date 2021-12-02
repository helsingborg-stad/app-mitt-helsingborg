export type TimeSpan = {
  startTime: string;
  endTime: string;
};

export type TimeSlot = {
  startTime?: string;
  endTime?: string;
  emails?: string[];
  date: string;
};

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
  referenceCode: string;
  body: string;
  id: string;
};

export type GraphData = {
  BookingId: string;
  Subject: string;
  Body: string;
  Location: string;
  ReferenceCode: string;
  StartTime: string;
  EndTime: string;
  Attendees: {
    Email: string;
    Type: string;
    Status: string;
  }[];
};

export type TimeSlotDataType = Record<string, Record<string, TimeSpan[]>>;
