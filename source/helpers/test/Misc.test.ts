import { getUserFriendlyAppVersion, wait } from "../Misc";

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

describe("getUserFriendlyAppVersion", () => {
  it("returns an string containing the version and build number", () => {
    const value = getUserFriendlyAppVersion();

    expect(typeof value).toEqual("string");
    expect(value.length).toBeGreaterThan(0);
    expect(value).toContain("1.2.3");
    expect(value).toContain("1337");
  });
});
