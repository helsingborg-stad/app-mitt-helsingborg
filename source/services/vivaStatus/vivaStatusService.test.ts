import type { ApiService } from "../apiService/apiService.types";
import { ServiceLocator } from "../serviceLocator";
import DefaultVivaStatusService from "./vivaStatusService";

const mockServiceLocator = new ServiceLocator();

const mockCode = 1337;
const mockParts = [{ code: 1, message: "Hello World" }];
const mockResponse = {
  data: {
    data: {
      code: mockCode,
      parts: mockParts,
    },
  },
};

function setMockApiService(overrides: Partial<ApiService>): void {
  mockServiceLocator.register("api", {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    remove: jest.fn(),
    ...overrides,
  });
}

describe("VivaStatusService (default)", () => {
  it("calls the status api", async () => {
    ServiceLocator.setGlobalInstance(mockServiceLocator);
    const service = new DefaultVivaStatusService();
    const mockGet = jest.fn().mockReturnValue(mockResponse);
    setMockApiService({
      get: mockGet,
    });

    await service.fetch();
    const { code, parts } = service;

    expect(code).toBe(mockCode);
    expect(parts).toEqual(mockParts);
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  it("sets error if api call fails", async () => {
    ServiceLocator.setGlobalInstance(mockServiceLocator);
    const service = new DefaultVivaStatusService();
    const mockGet = jest.fn().mockReturnValue({
      message: "Test Error",
    });
    setMockApiService({
      get: mockGet,
    });

    jest.spyOn(console, "error").mockImplementationOnce(() => undefined);
    await service.fetch();

    expect(service.error).not.toBeNull();
    expect(service.error).toBeInstanceOf(Error);
  });

  it("sets error back to null after successful re-attempt", async () => {
    ServiceLocator.setGlobalInstance(mockServiceLocator);
    const service = new DefaultVivaStatusService();
    const mockGet = jest
      .fn()
      .mockReturnValueOnce({
        message: "Test Error",
      })
      .mockReturnValueOnce(mockResponse);
    setMockApiService({
      get: mockGet,
    });

    jest.spyOn(console, "error").mockImplementationOnce(() => undefined);
    await service.fetch();
    const { error: error1 } = service;

    await service.fetch();
    const { error: error2 } = service;

    expect(error1).not.toBeNull();
    expect(error1).toBeInstanceOf(Error);
    expect(error2).toBeNull();
  });
});
