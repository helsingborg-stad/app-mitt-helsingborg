import { getAPIEnvironmentIdentifierFromUrl, wait } from "../Misc";

describe("Misc helper functions", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test("wait", () => {
    const DELAY = 500;
    jest.useFakeTimers();
    const callback = jest.fn();

    void wait(DELAY).then(callback);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(DELAY);

    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("getAPIEnvironmentIdentifierFromUrl", () => {
  const devUrl = "https://dev.api.helsingborg.io";
  const releaseUrl = "https://release.api.helsingborg.io";
  const prodUrl = "https://api.helsingborg.io";

  it("returns the correct letter for a supported environment", () => {
    const devLetter = getAPIEnvironmentIdentifierFromUrl(devUrl);
    const releaseLetter = getAPIEnvironmentIdentifierFromUrl(releaseUrl);

    expect(devLetter).toEqual("d");
    expect(releaseLetter).toEqual("r");
  });

  it("returns production letter for production environment", () => {
    const prodLetter = getAPIEnvironmentIdentifierFromUrl(prodUrl);

    expect(prodLetter).toEqual("p");
  });

  it("returns null on unexpected urls", () => {
    const invalidUrl = getAPIEnvironmentIdentifierFromUrl("not a valid url");
    const unexpectedPrefix = getAPIEnvironmentIdentifierFromUrl(
      "https://thisdoesnotexist123.api.helsingborg.io"
    );
    const malformedUrl = getAPIEnvironmentIdentifierFromUrl(
      "https://.api.helsingborg.io"
    );

    expect(invalidUrl).toBeNull();
    expect(unexpectedPrefix).toBeNull();
    expect(malformedUrl).toBeNull();
  });

  it("returns null for unexpected reserved keywords", () => {
    const constructorValue = getAPIEnvironmentIdentifierFromUrl(
      "https://constructor.api.helsingborg.io"
    );
    const hasOwnPropertyValue = getAPIEnvironmentIdentifierFromUrl(
      "https://hasOwnProperty.api.helsingborg.io"
    );
    const protoValue = getAPIEnvironmentIdentifierFromUrl(
      "https://__proto__.api.helsingborg.io"
    );

    expect(constructorValue).toBeNull();
    expect(hasOwnPropertyValue).toBeNull();
    expect(protoValue).toBeNull();
  });
});
