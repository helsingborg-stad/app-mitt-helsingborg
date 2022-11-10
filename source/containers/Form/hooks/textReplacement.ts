import _get from "lodash.get";
import _set from "lodash.set";
import moment from "moment";
import { deepCopy } from "../../../helpers/Objects";
import type { Question, Step } from "../../../types/FormTypes";
import type { PartnerInfo, User } from "../../../types/UserTypes";
import type { Case } from "../../../types/Case";
import type { FormPeriod } from "./useForm";

interface CaseReplacementRule {
  key: string;
  from: string;
  to: string[];
  timeFormat?: string;
  customTransformer?: (value: unknown) => unknown;
}

const CASE_REPLACEMENT_RULES: CaseReplacementRule[] = [
  {
    key: "#MONTH_NAME",
    from: "details.period.startDate",
    to: ["status.description", "status.detailedDescription"],
    timeFormat: "MMMM",
  },
  {
    key: "#COMPLETION_DUEDATE",
    from: "details.completions.dueDate",
    to: ["status.description", "status.detailedDescription"],
  },
  {
    key: "#ATTACHMENT_UPLOADED_COUNT",
    from: "details.completions.attachmentUploaded",
    to: ["status.description", "status.detailedDescription"],
    customTransformer: (value) => (Array.isArray(value) ? value.length : value),
  },
];

/**
 * The first argument is the string that should be replaced,
 * the second should be something that we can use to compute the
 * replacement value, such as getting it from the user object,
 * or perhaps computing some dates based on the current time.
 */
const REPLACEMENT_RULES = [
  ["#firstName", "user.firstName"],
  ["#lastName", "user.lastName"],
  ["#personalNumber", "user.personalNumber"],
  ["#partnerName", "partner.partnerName"],
  ["#date-1", "date.nextMonth.first"],
  ["#date-2", "date.nextMonth.last"],
  ["#month-1", "date.previousMonth.currentMonth-1"],
  ["#month-2", "date.previousMonth.currentMonth-2"],
  ["#month+1", "date.previousMonth.currentMonth+1"],
  ["#month+2", "date.previousMonth.currentMonth+2"],
  ["#month", "date.previousMonth.currentMonth"],
  ["#year", "date.currentYear"],
  ["#today-45", "date.currentDate.minus-45"],
  ["#today", "date.currentDate"],
  ["#encryptionPin", "encryptionPin"],
  ["#du/ni", "duNiReplacer"],
  ["#COMPLETIONS_CLARIFICATION", "completionsClarificationReplacer"],
];

const SWEDISH_MONTH_NAME_TABLE = Array.from({ length: 12 }, (_, i) =>
  new Date(0, i + 1, 0).toLocaleDateString("sv-SE", { month: "long" })
);

export function replaceCaseItemText(caseItem: Case): Case {
  const caseItemCopy = deepCopy(caseItem);

  CASE_REPLACEMENT_RULES.forEach(
    ({ key, from, to, timeFormat = "YYYY-MM-DD", customTransformer }) => {
      to.forEach((toPath) => {
        let newPropertyValue = _get(caseItemCopy, from, "");

        const oldValue = _get(caseItemCopy, toPath, "");

        const isDateValid = moment(newPropertyValue).isValid();
        if (isDateValid) {
          newPropertyValue = moment(newPropertyValue).format(timeFormat);
        }

        if (customTransformer) {
          newPropertyValue = customTransformer(newPropertyValue);
        }

        const newValue = oldValue.replace(key, newPropertyValue);

        _set(caseItemCopy, toPath, newValue);
      });
    }
  );
  return caseItemCopy;
}

function replaceDate(
  descriptorDateParts: string[],
  period?: FormPeriod
): string {
  const currentDate = new Date();
  const activeDateByPeriodEndDate = period
    ? new Date(period.endDate)
    : currentDate;

  const [calendarType, position] = descriptorDateParts;

  if (calendarType === "nextMonth") {
    const activeMonth = activeDateByPeriodEndDate.getMonth() + 2;
    if (position === "first") {
      return `1/${activeMonth}`;
    }
    if (position === "last") {
      const days = new Date(
        activeDateByPeriodEndDate.getFullYear(),
        activeMonth,
        0
      ).getDate();
      return `${days}/${activeMonth}`;
    }
  }

  if (calendarType === "currentYear") {
    return currentDate.getFullYear().toString();
  }

  if (calendarType === "currentDate") {
    if (position === "minus-45") {
      currentDate.setDate(currentDate.getDate() - 45);
      return `${currentDate.getDate()}/${currentDate.getMonth() + 1}`;
    }
    return `${currentDate.getDate()}`;
  }

  if (calendarType === "previousMonth") {
    const currentMonth = activeDateByPeriodEndDate.getMonth();

    switch (position) {
      case "currentMonth":
        return `${SWEDISH_MONTH_NAME_TABLE[currentMonth]}`;
      case "currentMonth-1":
        return `${SWEDISH_MONTH_NAME_TABLE[(currentMonth + 11) % 12]}`;
      case "currentMonth-2":
        return `${SWEDISH_MONTH_NAME_TABLE[(currentMonth + 10) % 12]}`;
      case "currentMonth+1":
        return `${SWEDISH_MONTH_NAME_TABLE[(currentMonth + 1) % 12]}`;
      case "currentMonth+2":
        return `${SWEDISH_MONTH_NAME_TABLE[(currentMonth + 2) % 12]}`;
      default:
        return `${SWEDISH_MONTH_NAME_TABLE[currentMonth]}`;
    }
  }

  return "";
}

function replaceUserInfo(
  descriptorUserParts: string[],
  userType: User | PartnerInfo
): string {
  const result = descriptorUserParts.reduce(
    (prev: unknown, current: string) => {
      if (prev[current]) {
        return prev[current];
      }
      return "";
    },
    { ...userType }
  ) as string;

  return result;
}

function computeText(
  descriptor: string,
  user: User,
  period?: FormPeriod,
  partner?: PartnerInfo,
  encryptionPin?: string,
  completionsClarificationMessage?: string
): string {
  const [descriptorFirstPart, ...descriptorRestParts] = descriptor.split(".");

  if (descriptorFirstPart === "user") {
    return replaceUserInfo(descriptorRestParts, user);
  }

  if (descriptorFirstPart === "partner" && partner) {
    return replaceUserInfo(descriptorRestParts, partner);
  }

  if (descriptorFirstPart === "date") {
    return replaceDate(descriptorRestParts, period);
  }

  if (descriptorFirstPart === "encryptionPin" && encryptionPin) {
    return encryptionPin;
  }

  if (descriptorFirstPart === "duNiReplacer") {
    return partner?.role === "coApplicant" ? "ni" : "du";
  }

  if (
    descriptorFirstPart === "completionsClarificationReplacer" &&
    completionsClarificationMessage
  ) {
    return completionsClarificationMessage;
  }

  return "";
}

function replaceText(
  text: string,
  user: User,
  period?: FormPeriod,
  partner?: PartnerInfo,
  encryptionPin?: string,
  completionsClarificationMessage?: string
): string {
  // This allows for nesting replacement rules and then applying them in order one after the other.
  let res = text ?? "";
  REPLACEMENT_RULES.forEach(([replacementParameter, descriptor]) => {
    res = res.replace(
      replacementParameter,
      computeText(
        descriptor,
        user,
        period,
        partner,
        encryptionPin,
        completionsClarificationMessage
      )
    );
  });
  return res;
}

export function replaceMarkdownTextInSteps(
  steps: Step[],
  user: User,
  period?: FormPeriod,
  partner?: PartnerInfo,
  encryptionPin?: string,
  completionsClarificationMessage?: string
): Step[] {
  const replaceString = (text: string | undefined): string =>
    text
      ? replaceText(
          text,
          user,
          period,
          partner,
          encryptionPin,
          completionsClarificationMessage
        )
      : "";

  return steps.map((step) => {
    const title = replaceString(step.title);
    const description = replaceString(step.description);

    const questions: Question[] = (step.questions ?? []).map((question) => ({
      ...question,
      text: replaceString(question.text),
      label: replaceString(question.label),
      title: replaceString(question.title),
      heading: replaceString(question.heading),
      components: (question.components ?? []).map((component) => ({
        ...component,
        text: replaceString(component.text),
      })),
      items: (question.items ?? []).map((item) => ({
        ...item,
        title: replaceString(item.title),
      })),
      categories: (question.categories ?? []).map((category) => ({
        ...category,
        description: replaceString(category.description),
      })),
      inputs: (question.inputs ?? []).map((input) => ({
        ...input,
        label: replaceString(input.label),
        title: replaceString(input.title),
      })),
    }));

    return {
      ...step,
      title,
      description,
      questions,
    };
  });
}
