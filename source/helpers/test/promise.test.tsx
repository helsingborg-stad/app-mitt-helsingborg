import type {
  RejectedSettledPromise,
  ResolvedSettledPromise,
} from "../promise";
import {
  toRejectedSettledPromise,
  toResolvedSettledPromise,
  allSettled,
  isRejectedSettledPromise,
} from "../promise";

describe("Promise helpers", () => {
  describe("toResolvedSettledPromise", () => {
    it("returns correct structure", () => {
      const expected: ResolvedSettledPromise<number> = {
        status: "fulfilled",
        value: 5,
      };

      const result = toResolvedSettledPromise(5);

      expect(result).toEqual(expected);
    });
  });

  describe("toRejectedSettledPromise", () => {
    it("returns correct structure", () => {
      const expected: RejectedSettledPromise = {
        status: "rejected",
        reason: new Error("fail"),
      };

      const result = toRejectedSettledPromise(new Error("fail"));

      expect(result).toEqual(expected);
    });
  });

  describe("allSettled", () => {
    it("returns resolved values", async () => {
      const promises: Promise<number | string>[] = [
        Promise.resolve(1),
        Promise.resolve("Hello"),
      ];

      const result = await allSettled(promises);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        toResolvedSettledPromise(1),
        toResolvedSettledPromise("Hello"),
      ]);
    });

    it("returns rejected errors", async () => {
      const errors = [new Error("Hello"), new Error("World")];
      const promises: Promise<never>[] = [
        Promise.reject(errors[0]),
        Promise.reject(errors[1]),
      ];

      const result = await allSettled(promises);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        toRejectedSettledPromise(errors[0]),
        toRejectedSettledPromise(errors[1]),
      ]);
    });

    it("returns both resolved and rejected values", async () => {
      const promises: Promise<number | string>[] = [
        Promise.resolve(5),
        Promise.reject(new Error("lorem ipsum")),
        Promise.resolve("hello world"),
      ];

      const result = await allSettled(promises);

      expect(result).toHaveLength(3);
      expect(result).toEqual([
        toResolvedSettledPromise(5),
        toRejectedSettledPromise(new Error("lorem ipsum")),
        toResolvedSettledPromise("hello world"),
      ]);
    });
  });

  describe("isRejectedSettledPromise", () => {
    it("returns true for rejected settled promises", () => {
      const rejected: RejectedSettledPromise = {
        status: "rejected",
        reason: new Error("oops"),
      };

      const result = isRejectedSettledPromise(rejected);

      expect(result).toBe(true);
    });

    it("returns false for non-rejected settled promises", () => {
      const fulfilled: ResolvedSettledPromise<number> = {
        status: "fulfilled",
        value: 5,
      };

      const result = isRejectedSettledPromise(fulfilled);

      expect(result).toBe(false);
    });
  });
});
