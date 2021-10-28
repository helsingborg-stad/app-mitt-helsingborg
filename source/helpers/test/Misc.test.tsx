import { wait } from "../Misc";

describe("Misc helper functions", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test("wait", () => {
    const DELAY = 500;
    jest.useFakeTimers();
    const callback = jest.fn();

    wait(DELAY).then(callback);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(DELAY);

    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
