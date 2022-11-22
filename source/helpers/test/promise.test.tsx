import type {
  RejectedSettledPromise,
  ResolvedSettledPromise,
} from "../promise";
import { allSettled, isRejectedSettledPromise } from "../promise";

describe("Promise helpers", () => {
  describe("allSettled", () => {
    it("returns resolved values", async () => {
      const promises: Promise<number | string>[] = [
        Promise.resolve(1),
        Promise.resolve("Hello"),
      ];

      const result = await allSettled(promises);

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([
          {
            status: "fulfilled",
            value: 1,
          },
          {
            status: "fulfilled",
            value: "Hello",
          },
        ])
      );
    });

    it("returns rejected errors", async () => {
      const errors = [new Error("Hello"), new Error("World")];
      const promises: Promise<never>[] = [
        Promise.reject(errors[0]),
        Promise.reject(errors[1]),
      ];

      const result = await allSettled(promises);

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([
          {
            status: "rejected",
            reason: errors[0],
          },
          {
            status: "rejected",
            reason: errors[1],
          },
        ])
      );
    });

    it("returns both resolved and rejected values", async () => {
      const promises: Promise<number | string>[] = [
        Promise.resolve(5),
        Promise.reject(new Error("lorem ipsum")),
        Promise.resolve("hello world"),
      ];

      const result = await allSettled(promises);

      expect(result).toHaveLength(3);
      expect(result).toEqual(
        expect.arrayContaining([
          { status: "fulfilled", value: 5 },
          {
            status: "rejected",
            reason: expect.any(Error),
          },
          { status: "fulfilled", value: "hello world" },
        ])
      );
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
