import type { EnvironmentService } from "./environment/environmentService.types";
import { ServiceLocator } from "./serviceLocator";
import type { ServiceTypes } from "./serviceLocator.types";

const mockServices: { [K in keyof ServiceTypes]: ServiceTypes[K] } = {
  environment: {
    getActive: jest.fn(),
    getEnvironmentMap: jest.fn(),
    parse: jest.fn(),
    parseFromStorage: jest.fn(),
    setActive: jest.fn(),
  },
  vivaStatus: {
    state: "idle",
    error: null,
    code: 0,
    parts: [],
    fetch: jest.fn(),
  },
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    remove: jest.fn(),
  },
};

describe("ServiceLocator", () => {
  it("has a singleton instance available", () => {
    const instance = ServiceLocator.getInstance();

    expect(instance).toBeInstanceOf(ServiceLocator);
  });

  it("can override singleton instance explicitely", () => {
    const expectedInstance = new ServiceLocator();

    ServiceLocator.setGlobalInstance(expectedInstance);
    const instance = ServiceLocator.getInstance();

    expect(instance).toBe(expectedInstance);
  });

  it.each(Object.entries(mockServices))(
    "returns registered service (%s)",
    (serviceName, serviceInstance) => {
      const serviceLocator = new ServiceLocator();

      serviceLocator.register(
        serviceName as keyof ServiceTypes,
        serviceInstance
      );

      const result = serviceLocator.get(serviceName as keyof ServiceTypes);

      expect(result).toBe(serviceInstance);
    }
  );

  it("throws when no service is set", () => {
    const serviceLocator = new ServiceLocator();

    const func = () => serviceLocator.get("environment");

    expect(func).toThrow("No instance registered for service 'environment'");
  });

  it("replaces service when registering again", () => {
    const serviceLocator = new ServiceLocator();

    const newServiceMock: EnvironmentService = {
      getActive: jest.fn(),
      getEnvironmentMap: jest.fn(),
      parse: jest.fn(),
      parseFromStorage: jest.fn(),
      setActive: jest.fn(),
    };

    serviceLocator.register("environment", mockServices.environment);
    serviceLocator.register("environment", newServiceMock);

    const service = serviceLocator.get("environment");

    expect(service).toBe(newServiceMock);
  });
});
