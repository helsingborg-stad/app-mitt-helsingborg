import getUnApprovedCompletionsDescriptions from "../FormatCompletions";

const mockCompletions = [
  {
    approved: false,
    description: "mock description one",
  },
  {
    approved: true,
    description: "mock description two",
  },
];

describe("FormatCompletions", () => {
  it("returns unapproved completions and its descriptions", () => {
    const result = getUnApprovedCompletionsDescriptions(mockCompletions);

    expect(result).toHaveLength(1);
    expect(result).toEqual(["mock description one"]);
  });
});
