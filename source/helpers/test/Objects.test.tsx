import {
  deepCompareEquals,
  deepCopyViaJson,
  filterAsync,
  deepCopy,
  unsetObjectPathValue,
} from "../Objects";

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

describe("setObjectPathValue", () => {
  test.each([
    {
      path: "a",
      object: { a: 1 },
      expectedResult: {},
    },
    {
      path: "a.b.c",
      object: { a: { b: { c: 2 } } },
      expectedResult: { a: { b: {} } },
    },
    {
      path: "a",
      object: { b: 1 },
      expectedResult: { b: 1 },
    },
    {
      path: "a.b.c.d",
      object: { a: {} },
      expectedResult: { a: {} },
    },
  ])("unsets object path $path", ({ path, object, expectedResult }) => {
    const result = unsetObjectPathValue(object, path);

    expect(result).toEqual(expectedResult);
  });
});
