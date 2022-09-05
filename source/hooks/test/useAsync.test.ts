import { renderHook } from "@testing-library/react-hooks";
import useAsync from "../useAsync";

describe("useAsync", () => {
  it("calls the function", async () => {
    const mockFunction = jest.fn();
    const { waitForNextUpdate } = renderHook(() => useAsync(mockFunction));

    await waitForNextUpdate();
    expect(mockFunction).toHaveBeenCalled();
  });

  it("sets loading", async () => {
    const mockFunction = jest.fn();

    const { result, waitForNextUpdate } = renderHook(() =>
      useAsync(mockFunction)
    );

    expect(result.current[0]).toBe(true);
    await waitForNextUpdate();
    expect(result.current[0]).toBe(false);
  });

  it("sets value", async () => {
    const expectedValue = "Hello World";
    const mockFunction = () => Promise.resolve(expectedValue);

    const { result, waitForNextUpdate } = renderHook(() =>
      useAsync(mockFunction)
    );

    await waitForNextUpdate();
    expect(result.current[1]).toBe(expectedValue);
  });

  it("sets error", async () => {
    const expectedError = new Error("Hello World");
    const mockFunction = () => Promise.reject(expectedError);

    const { result, waitForNextUpdate } = renderHook(() =>
      useAsync(mockFunction)
    );
    await waitForNextUpdate();

    expect(result.current[2]).toEqual(expectedError);
  });
});
