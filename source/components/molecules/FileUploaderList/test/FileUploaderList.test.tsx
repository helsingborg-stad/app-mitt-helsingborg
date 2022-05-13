import React from "react";
import { render } from "../../../../../test-utils";
import FileUploaderList from "../FileUploaderList";

describe("FileUploaderList", () => {
  it("renders without error", () => {
    const func = () =>
      render(
        <FileUploaderList
          id="test"
          colorSchema="blue"
          answers={{}}
          values={[]}
          onChange={() => undefined}
        />
      );
    expect(func).not.toThrow();
  });

  it("shows labels", () => {
    const labels = ["A", "hello", "hej det här är en komplex text!"];

    const { getByText } = render(
      <FileUploaderList
        id="test"
        colorSchema="blue"
        answers={{}}
        values={labels}
        onChange={() => undefined}
      />
    );

    const func = () => labels.forEach((label) => getByText(new RegExp(label)));
    expect(func).not.toThrow();
  });
});
