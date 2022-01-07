import {
  getAPIEnvironmentIdentifierFromUrl,
  getUserFriendlyAppVersion,
  wait,
} from "../Misc";

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
  const devUrl = "https://dev.api.example.com";
  const releaseUrl = "https://release.api.example.com";
  const prodUrl = "https://api.example.com";

  it("returns the correct letter for a supported environment", () => {
    const devLetter = getAPIEnvironmentIdentifierFromUrl(devUrl);
    const releaseLetter = getAPIEnvironmentIdentifierFromUrl(releaseUrl);

    expect(devLetter).toBe("d");
    expect(releaseLetter).toBe("r");
  });

  it("returns production letter for production environment", () => {
    const prodLetter = getAPIEnvironmentIdentifierFromUrl(prodUrl);

    expect(prodLetter).toBe("p");
  });

  it("returns null on unexpected urls", () => {
    const invalidUrl = getAPIEnvironmentIdentifierFromUrl("not a valid url");
    const unexpectedPrefix = getAPIEnvironmentIdentifierFromUrl(
      "https://thisdoesnotexist123.example.com"
    );
    const malformedUrl = getAPIEnvironmentIdentifierFromUrl(
      "https://.example.com"
    );

    expect(invalidUrl).toBeNull();
    expect(unexpectedPrefix).toBeNull();
    expect(malformedUrl).toBeNull();
  });

  it("returns null for unexpected reserved keywords", () => {
    const constructorValue = getAPIEnvironmentIdentifierFromUrl(
      "https://constructor.example.com"
    );
    const hasOwnPropertyValue = getAPIEnvironmentIdentifierFromUrl(
      "https://hasOwnProperty.example.com"
    );
    const protoValue = getAPIEnvironmentIdentifierFromUrl(
      "https://__proto__.example.com"
    );

    expect(constructorValue).toBeNull();
    expect(hasOwnPropertyValue).toBeNull();
    expect(protoValue).toBeNull();
  });
});

describe("getUserFriendlyAppVersion", () => {
  it("returns an string containing the version and build number", () => {
    const value = getUserFriendlyAppVersion();

    expect(typeof value).toEqual("string");
    expect(value.length).toBeGreaterThan(0);
    expect(value).toContain("1.2.3");
    expect(value).toContain("1337");
  });
});
