import { PartnerInfo, User } from "../../../../types/UserTypes";
import { Question, Step } from "../../../../types/FormTypes";
import { Period, Case, ApplicationStatusType } from "../../../../types/Case";
import {
  replaceMarkdownTextInSteps,
  replaceCaseItemText,
} from "../textReplacement";

const mockedUserData: User = {
  address: {
    city: "",
    postalCode: "",
    street: "",
  },
  civilStatus: "",
  email: "",
  firstName: "Kaj-Bertil",
  lastName: "Efternamnsson",
  mobilePhone: "",
};

const baseStep: Step = {
  title: "",
  colorSchema: "blue",
  description: "Description",
  group: "",
};

const basePeriod: Period = {
  endDate: new Date("2021-01-01").getTime(),
  startDate: new Date("2020-12-01").getTime(),
};

const baseQuestion: Question = {
  id: "question-1",
  label: "Label",
  type: "text",
};

const fakedPartnerInfo: PartnerInfo = {
  partnerName: "Anna-Stina",
  partnerLastname: "Partnersson",
  partnerPersonalid: "123456789",
};

const doTest = (
  placeholder: string,
  expected: string,
  partner: PartnerInfo | undefined = undefined,
  period: Period = basePeriod,
  encryptionPin = "1234"
): void => {
  const res = replaceMarkdownTextInSteps(
    [
      {
        ...baseStep,
        title: placeholder,
        description: placeholder,
        questions: [
          { ...baseQuestion, label: placeholder },
          {
            ...baseQuestion,
            type: "summaryList",
            categories: [
              {
                category: "income",
                description: placeholder,
              },
              {
                category: "partnerIncome",
                description: placeholder,
              },
            ],
            items: [
              {
                inputId: "amount",
                id: "unemploymentAllowance",
                category: "benefits",
                title: placeholder,
                type: "checkbox",
                inputSelectValue: "checkbox",
              },
            ],
            components: [
              {
                text: placeholder,
                type: "text",
                heading: "some sort of heading",
              },
            ],
          },
          {
            ...baseQuestion,
            type: "repeaterField",
            description: placeholder,
            heading: placeholder,
            text: placeholder,
            title: placeholder,
            inputs: [
              {
                id: "amount",
                label: placeholder,
                title: placeholder,
              },
            ],
          },
          { ...baseQuestion, label: placeholder },
        ],
      },
    ],
    mockedUserData,
    period,
    partner,
    encryptionPin
  );

  expect(res[0].title).toBe(expected);
  expect(res[0].description).toBe(expected);
  expect(res[0].questions?.[0].label).toBe(expected);

  expect(res[0]?.questions?.[1].categories?.[0].description).toBe(expected);
  expect(res[0]?.questions?.[1].categories?.[1].description).toBe(expected);

  expect(res[0]?.questions?.[1].items?.[0].title).toBe(expected);
  expect(res[0]?.questions?.[1].components?.[0].text).toBe(expected);
  expect(res[0]?.questions?.[2].inputs?.[0].label).toBe(expected);
  expect(res[0]?.questions?.[2].inputs?.[0].title).toBe(expected);
  expect(res[0]?.questions?.[2].text).toBe(expected);
  expect(res[0]?.questions?.[2].heading).toBe(expected);
  expect(res[0]?.questions?.[2].title).toBe(expected);

  expect(res[0]?.questions?.[3].label).toBe(expected);
};

jest.useFakeTimers().setSystemTime(new Date("2021-01-01").getTime());

describe("replaceMarkdownTextInSteps", () => {
  describe("#month", () => {
    it.each([
      ["#month", "januari"],
      ["#month-1", "december"],
      ["#month-2", "november"],
      ["#month+1", "februari"],
      ["#month+2", "mars"],
      ["#month, #month+1 & #month+2", "januari, februari & mars"],
    ])("Replaces %s with %s", doTest);
  });

  describe("#month in december", () => {
    it.each([
      ["#month", "december"],
      ["#month-1", "november"],
      ["#month-2", "oktober"],
      ["#month+1", "januari"],
      ["#month+2", "februari"],
      ["#month, #month+1 & #month+2", "december, januari & februari"],
    ])("Replaces %s with %s", (placeholder, expected) =>
      doTest(placeholder, expected, undefined, {
        endDate: new Date("2021-12-01").getTime(),
        startDate: new Date("2021-12-31").getTime(),
      })
    );
  });

  describe("#date", () => {
    it.each([
      ["#date-1", "1/2"],
      ["#date-2", "28/2"],
    ])("Replaces %s with %s", doTest);
  });

  describe("Miscellaneous date stuff", () => {
    it.each([
      ["#year", "2021"],
      ["#today", "1"],
    ])("Replaces %s with %s", doTest);
  });

  describe("User", () => {
    it.each([
      ["#firstName", "Kaj-Bertil"],
      ["#lastName", "Efternamnsson"],
    ])("Replaces %s with %s", doTest);
  });

  describe("Partner", () => {
    describe("Has a partner", () => {
      it.each([["#partnerName", "Anna-Stina"]])(
        "Replaces %s with %s",
        (placeholder, expected) =>
          doTest(placeholder, expected, fakedPartnerInfo)
      );
    });

    describe("Doesn't have a partner", () => {
      it.each([["#partnerName", ""]])("Replaces %s with %s", doTest);
    });
  });

  describe("Encryption pin", () => {
    it.each([["#encryptionPin", "1111"]])(
      "Replaces %s with %s",
      (placeholder, expected) =>
        doTest(placeholder, expected, undefined, undefined, expected)
    );
  });
});

let mockCase: Case;
beforeEach(() => {
  mockCase = {
    PK: "",
    SK: "",
    status: {
      type: ApplicationStatusType.ACTIVE_COMPLETION_REQUIRED_VIVA,
      name: "Ansökan behöver kompletteras",
      description: "#MONTH_NAME",
      detailedDescription: "My new month: #MONTH_NAME",
    },
    details: {
      completions: {
        requested: [],
        completed: true,
        randomCheck: false,
        dueDate: 1652708743244,
      },
      administrators: [],
      workflowId: "123",
      workflow: {
        application: {
          periodstartdate: "2021-01-04",
          completionduedate: "2021-01-05",
        },
      },
      period: {
        endDate: 123,
        startDate: 456,
      },
    },
    id: "mockId",
    createdAt: 0,
    currentFormId: "",
    expirationTime: 0,
    forms: {},
    persons: [],
    provider: "",
    updatedAt: 0,
  };
});

describe("replaceCaseItemText", () => {
  it("replaces key with a value specified in 'caseItemReplacementRules' rule", () => {
    const expectedResult = "January";

    const result = replaceCaseItemText(mockCase);

    expect(result.status.description).toBe(expectedResult);
  });

  it("does not replace a key that does not exist in 'caseItemReplacementRules' rule", () => {
    const expectedResult = "#MyFakeKey";

    mockCase.status.description = expectedResult;

    const result = replaceCaseItemText(mockCase);

    expect(result.status.description).toBe(expectedResult);
  });

  it("replaces text on multiple `to` properties", () => {
    const result = replaceCaseItemText(mockCase);

    expect(result.status.description).toBe("January");
    expect(result.status.detailedDescription).toBe("My new month: January");
  });

  it("replaces text on multiple `to` properties with multiple keys", () => {
    const expectedDescription = "Month: January, duedate: 2022-05-16";

    mockCase.status.detailedDescription =
      "Month: #MONTH_NAME, duedate: #COMPLETION_DUEDATE";

    const result = replaceCaseItemText(mockCase);

    expect(result.status.detailedDescription).toBe(expectedDescription);
  });

  it("does not replace keys if key does not exist when having multiple `to` paths", () => {
    const expectedDescription = "January";
    const expectedDetailedDescription = "no key to replace";

    mockCase.status.detailedDescription = expectedDetailedDescription;

    const result = replaceCaseItemText(mockCase);

    expect(result.status.description).toBe(expectedDescription);
    expect(result.status.detailedDescription).toBe(expectedDetailedDescription);
  });
});
