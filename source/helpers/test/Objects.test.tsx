import { deepCompareEquals, deepCopyViaJson, filterAsync } from "../Objects";

describe("Object helper functions", () => {
  test("deepCopyViaJson", () => {
    const testObject = {
      msg: "Hello",
      data: { arr: [1, 2, 3], flag: true },
    };

    const copy = deepCopyViaJson(testObject);

    expect(copy).not.toBe(testObject);
    expect(copy).toEqual(testObject);
  });

  test("filterAsync", async () => {
    const arr = [true, true, false, false, true, false];

    const waitFor = (seconds: number) =>
      new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
      });

    const filtered = await filterAsync(arr, async (value) => {
      await waitFor(0.1);
      return value;
    });

    expect(filtered).toEqual([true, true, true]);
  });

  test("deepCompareEquals", async () => {
    const first = { msg: "Hello", data: { arr: [1, 2, 3], flag: true } };
    const second = { msg: "Hello", data: { arr: [1, 2, 3], flag: true } };
    const third = { data: { flag: true, arr: [1, 2, 3] }, msg: "Hello" };
    const fourth = { data: { arr: [1, 2, 3], flag: true } };

    const firstSecond = await deepCompareEquals(first, second);
    const secondFirst = await deepCompareEquals(second, first);
    const firstThird = await deepCompareEquals(first, third);
    const secondThird = await deepCompareEquals(second, third);
    const firstFourth = await deepCompareEquals(first, fourth);

    expect(firstSecond).toEqual(true);
    expect(secondFirst).toEqual(true);
    expect(firstThird).toEqual(true);
    expect(secondThird).toEqual(true);
    expect(firstFourth).toEqual(false);
  });
});
