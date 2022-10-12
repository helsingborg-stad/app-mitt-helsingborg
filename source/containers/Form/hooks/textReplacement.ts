import _get from "lodash.get";
import _set from "lodash.set";
import moment from "moment";

import { deepCopy } from "../../../helpers/Objects";

import type { Question, Step } from "../../../types/FormTypes";
import type { PartnerInfo, User } from "../../../types/UserTypes";
import type { Case } from "../../../types/Case";

import type { FormPeriod } from "./useForm";

type CaseItemReplacementRuleType = {
  key: string;
  from: string;
  to: string[];
  timeFormat?: string;
  customTransformer?: (value: unknown) => unknown;
};

const caseItemReplacementRules: CaseItemReplacementRuleType[] = [
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

export const replaceCaseItemText = (caseItem: Case): Case => {
  const caseItemCopy = deepCopy(caseItem);

  caseItemReplacementRules.forEach(
    ({ key, from, to, timeFormat = "YYYY-MM-DD", customTransformer }) => {
      to.forEach((toPath) => {
        let newPropertyValue = _get(caseItemCopy, from, "");

        const oldValue = _get(caseItemCopy, toPath, "");

        const isDate = moment(newPropertyValue).isValid();
        if (isDate) {
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
};

/**
 * The first argument is the string that should be replaced,
 * the second should be something that we can use to compute the
 * replacement value, such as getting it from the user object,
 * or perhaps computing some dates based on the current time.
 */
const replacementRules = [
  ["#firstName", "user.firstName"],
  ["#lastName", "user.lastName"],
  ["#personalNumber", "user.personalNumber"],
  ["#date-1", "date.nextMonth.first"], // Who named this???? pls fixs
  ["#date-2", "date.nextMonth.last"],
  ["#month-1", "date.previousMonth.currentMonth-1"],
  ["#month-2", "date.previousMonth.currentMonth-2"],
  ["#month+1", "date.previousMonth.currentMonth+1"],
  ["#month+2", "date.previousMonth.currentMonth+2"],
  ["#month", "date.previousMonth.currentMonth"],
  ["#year", "date.currentYear"], // this is the current year of next month
  ["#today", "date.currentDate"], // this is the current year of next month
  ["#partnerName", "partner.partnerName"],
  ["#encryptionPin", "encryptionPin"],
  ["#du/ni", "duNiReplacer"],
  ["#COMPLETIONS_CLARIFICATION", "completionsClarificationReplacer"],
];

const swedishMonthTable = [
  "januari",
  "februari",
  "mars",
  "april",
  "maj",
  "juni",
  "juli",
  "augusti",
  "september",
  "oktober",
  "november",
  "december",
];

const replaceDates = (descriptor: string[], period?: FormPeriod): string => {
  const currentDate = new Date();
  const activeDate = period ? new Date(period.endDate) : currentDate;

  if (descriptor[1] === "nextMonth") {
    const month = activeDate.getMonth() + 2;
    if (descriptor[2] === "first") {
      return `1/${month}`;
    }
    if (descriptor[2] === "last") {
      const days = new Date(activeDate.getFullYear(), month, 0).getDate();
      return `${days}/${month}`;
    }
  }

  if (descriptor[1] === "currentYear") {
    return currentDate.getFullYear().toString();
  }

  if (descriptor[1] === "currentDate") {
    return `${currentDate.getDate()}`;
  }

  if (descriptor[1] === "previousMonth") {
    const currentMonth = activeDate.getMonth();

    switch (descriptor[2]) {
      case "currentMonth":
        return `${swedishMonthTable[currentMonth]}`;
      case "currentMonth-1":
        return `${swedishMonthTable[(currentMonth + 11) % 12]}`;
      case "currentMonth-2":
        return `${swedishMonthTable[(currentMonth + 10) % 12]}`;
      case "currentMonth+1":
        return `${swedishMonthTable[(currentMonth + 1) % 12]}`;
      case "currentMonth+2":
        return `${swedishMonthTable[(currentMonth + 2) % 12]}`;
      default:
        return `${swedishMonthTable[currentMonth]}`;
    }
  }
  return "";
};

const replaceUserInfo = (
  descriptor: string[],
  user: User | PartnerInfo
): string => {
  const res = descriptor.slice(1).reduce((prev, current) => {
    if (prev && prev[current]) return prev[current];
    return undefined;
  }, user);
  return res || "";
};

const computeText = (
  descriptor: string,
  user: User,
  period?: FormPeriod,
  partner?: PartnerInfo,
  encryptionPin?: string,
  completionsClarificationMessage?: string
): string => {
  const strArr = descriptor.split(".");

  if (strArr[0] === "user") {
    return replaceUserInfo(strArr, user);
  }

  if (strArr[0] === "partner" && partner) {
    return replaceUserInfo(strArr, partner);
  }

  if (strArr[0] === "date") {
    return replaceDates(strArr, period);
  }

  if (strArr[0] === "encryptionPin" && encryptionPin) {
    return encryptionPin;
  }

  if (strArr[0] === "duNiReplacer") {
    return partner?.role === "coApplicant" ? "ni" : "du";
  }

  if (
    strArr[0] === "completionsClarificationReplacer" &&
    completionsClarificationMessage
  ) {
    return completionsClarificationMessage;
  }
  return "";
};

export const replaceText = (
  text: string,
  user: User,
  period?: FormPeriod,
  partner?: PartnerInfo,
  encryptionPin?: string,
  completionsClarificationMessage?: string
): string => {
  // This way of doing it might be a bit overkill, but the idea is that this in principle
  // allows for nesting replacement rules and then applying them in order one after the other.
  let res = text ?? "";
  replacementRules.forEach(([template, descriptor]) => {
    res = res.replace(
      template,
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
};

/**
 * Replaces the markdown as specified by a set of markdown rules and logic that we've defined.
 */
export const replaceMarkdownTextInSteps = (
  steps: Step[],
  user: User,
  period?: FormPeriod,
  partner?: PartnerInfo,
  encryptionPin?: string,
  completionsClarificationMessage?: string
): Step[] => {
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
};
