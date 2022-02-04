import {
  deepCompareEquals,
  deepCopyViaJson,
  filterAsync,
  deepCopy,
  areSame,
} from "../Objects";

describe("areSame", () => {
  const obj = {
    a: { hello: "world" },
    a2: { hello: "world" },
    b: { goodbye: "cruel world" },
  };
  const arr = {
    a: [1, "two", 3],
    a2: [1, "two", 3],
    b: [3, "four"],
  };
  const testCases = [
    [obj.a, obj.a, true],
    [obj.a, obj.b, false],
    [obj.a, obj.a2, true],
    [arr.a, arr.a, true],
    [arr.a, arr.b, false],
    [arr.a, arr.a2, true],
    [123, 123, true],
    [123, "123", false],
    [obj.a, arr.a, false],
  ];
  test.each(testCases)(
    "areSame ($1, $2)",
    (a: unknown, b: unknown, expected: boolean) =>
      expect(areSame(a, b)).toBe(expected)
  );
});

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

describe("Deep copy", () => {
  interface DeepCopyTestObject {
    hello: string;
    deep: {
      nested: {
        things: boolean;
        arr: string[];
      };
    };
  }

  let data: DeepCopyTestObject;
  let copiedData: DeepCopyTestObject;

  beforeAll(() => {
    data = {
      hello: "world",
      deep: {
        nested: {
          things: true,
          arr: ["1", "2", "3"],
        },
      },
    };

    copiedData = deepCopy(data);
  });

  it("Should clone without references", () => {
    copiedData.hello = "not world!";
    copiedData.deep.nested.things = false;
    copiedData.deep.nested.arr.push("4");
    expect(copiedData.hello).toBe("not world!");
    expect(copiedData.deep.nested.things).toBe(false);
    expect(copiedData.deep.nested.arr).toContain("4");
  });

  it("Should not modify the original object", () => {
    expect(data.hello).toBe("world");
    expect(data.deep.nested.things).toBe(true);
    expect(data.deep.nested.arr).not.toContain("4");
  });
});
