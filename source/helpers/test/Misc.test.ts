import { getUserFriendlyAppVersion, wait, arraysAreEqual } from "../Misc";

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

  describe("arraysAreEqual", () => {
    test.each([
      [true, [], []],
      [true, ["a"], ["a"]],
      [true, [0, 1, 2], [0, 1, 2]],
      [false, ["a", "b"], ["b", "a"]],
      [false, ["123"], [123]],
      [false, ["1"], [true]],
    ])("returns %s for %s and %s", (expected, arr1, arr2) => {
      const result = arraysAreEqual(arr1, arr2);
      expect(result).toBe(expected);
    });
  });
});
