import getUnapprovedCompletionDescriptions from "../FormatCompletions";

const mockCompletions = [
  {
    received: false,
    description: "mock description one",
  },
  {
    received: true,
    description: "mock description two",
  },
];

describe("FormatCompletions", () => {
  it("returns unapproved completions and its descriptions", () => {
    const result = getUnapprovedCompletionDescriptions(mockCompletions);

    expect(result).toHaveLength(1);
    expect(result).toEqual(["mock description one"]);
  });
});
