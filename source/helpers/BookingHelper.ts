import { TimeSlot } from "../components/molecules/TimeSlotPicker/TimeSlotPicker";

type TimeSpan = {
  startTime: string;
  endTime: string;
};

function formDataToQuestions(formData: Record<string, any>): any[] {
  return formData.steps.flatMap(
    (step: Record<string, unknown>) => step.questions
  );
}

function timeSpanToString(timeSpan: TimeSpan | TimeSlot): string {
  return `${timeSpan.startTime}-${timeSpan.endTime}`;
}

function compareTimeSlots(a: TimeSlot, b: TimeSlot) {
  return timeSpanToString(a).localeCompare(timeSpanToString(b));
}

/**
 * @description Takes a timeSlots object output by the backend and propagates information from
 * the higher levels to the innermost objects, while also joining the timetables of all admins
 */
function consolidateTimeSlots(
  timeSlots: Record<string, Record<string, TimeSpan[]>>
): Record<string, TimeSlot[]> {
  /**
   * First we do the joining, by using the timespan as a property.
   * This allows the data to be used for booking a service.
   * We will go from format:
   * {email: {date: [{ startTime, endTime }]}}
   * To format:
   * {date: {time: { startTime, endTime, date, emails }}}
   */
  const joinedTimeSlots: Record<string, Record<string, TimeSlot>> = {};
  const emails = Object.keys(timeSlots);
  emails.forEach((email) => {
    const dates = Object.keys(timeSlots[email]);
    dates.forEach((date) => {
      timeSlots[email][date].forEach((timeSpan: TimeSpan) => {
        const timeString = timeSpanToString(timeSpan);
        if (joinedTimeSlots[date] === undefined) {
          joinedTimeSlots[date] = {};
        }
        if (joinedTimeSlots[date][timeString] === undefined) {
          const newObject: TimeSlot = { ...timeSpan, date, emails: [email] };
          joinedTimeSlots[date][timeString] = newObject;
        } else {
          const oldEmails: string[] = joinedTimeSlots[date][timeString].emails;
          joinedTimeSlots[date][timeString].emails = [...oldEmails, email];
        }
      });
    });
  });
  /**
   * We have done one pass over the data, newTimeSlots is now in format:
   * {date: {time: { startTime, endTime, date, emails }}}
   * We want the data to be in the format:
   * {date: [{ startTime, endTime, date, emails }]}
   */
  const reformattedTimeSlots: Record<string, TimeSlot[]> = {};
  const dates = Object.keys(joinedTimeSlots);
  dates.forEach((date) => {
    const timeList = Object.values(joinedTimeSlots[date]);
    timeList.sort(compareTimeSlots);
    reformattedTimeSlots[date] = timeList;
  });
  return reformattedTimeSlots;
}

export { formDataToQuestions, consolidateTimeSlots };
