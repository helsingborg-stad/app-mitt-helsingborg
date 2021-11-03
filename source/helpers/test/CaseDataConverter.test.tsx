import { replaceTagPart } from "../CaseDataConverter";

describe("replaceTagPart", () => {
  let input: { tag: string; part: string; value: string };

  beforeEach(() => {
    input = {
      tag: "",
      part: "replace",
      value: "success",
    };
  });

  it("should replace part in tag on single occurence", () => {
    input.tag = "test:example:replace";

    const output = "test:example:success";

    const result = replaceTagPart(input.tag, input.part, input.value);

    expect(result).toBe(output);
  });

  it("should replace part at beginning of tag", () => {
    input.tag = "replace:example:test";

    const output = "success:example:test";

    const result = replaceTagPart(input.tag, input.part, input.value);

    expect(result).toBe(output);
  });

  it("should replace part in tag on multiple occurences", () => {
    input.tag = "test:replace:example:replace";

    const output = "test:success:example:success";

    const result = replaceTagPart(input.tag, input.part, input.value);

    expect(result).toBe(output);
  });

  it("should replace part in tag if part is only part", () => {
    input.tag = "replace";

    const output = "success";

    const result = replaceTagPart(input.tag, input.part, input.value);
    expect(result).toBe(output);
  });

  it("should not replace part in tag if a part contains the value of another part", () => {
    input.tag = "test:examplereplace:replace";

    const output = "test:examplereplace:success";

    const result = replaceTagPart(input.tag, input.part, input.value);

    expect(result).toBe(output);
  });

  it("should not replace any parts", () => {
    input.tag = "test:example:other";

    const output = input.tag;

    const result = replaceTagPart(input.tag, input.part, input.value);

    expect(result).toBe(output);
  });
});
