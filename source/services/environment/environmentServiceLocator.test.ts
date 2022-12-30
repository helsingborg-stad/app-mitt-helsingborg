import EnvironmentServiceLocator from "./environmentServiceLocator";
import type {
  EnvironmentConfig,
  EnvironmentService,
} from "./environmentService.types";

const MOCK_SERVICE: EnvironmentService = {
  getEnvironmentMap() {
    return {};
  },
  parse() {
    //
  },
  setActive() {
    //
  },
  getActive(): EnvironmentConfig {
    return { apiKey: "", url: "" };
  },
  async parseFromStorage() {
    //
  },
};

const MOCK_SERVICE_2: EnvironmentService = Object.create(MOCK_SERVICE);

describe("Environment Service Locator", () => {
  beforeEach(() => {
    EnvironmentServiceLocator.clear();
  });

  it("returns the registered service", () => {
    EnvironmentServiceLocator.register(MOCK_SERVICE);
    const service = EnvironmentServiceLocator.get();

    expect(service).toBe(MOCK_SERVICE);
  });

  it("uses the last registered service", () => {
    EnvironmentServiceLocator.register(MOCK_SERVICE);
    EnvironmentServiceLocator.register(MOCK_SERVICE_2);
    const service = EnvironmentServiceLocator.get();

    expect(service).toBe(MOCK_SERVICE_2);
  });

  it("throws when no service is registered", () => {
    const func = () => EnvironmentServiceLocator.get();

    expect(func).toThrow("No EnvironmentService registered");
  });

  it("should allow clearing the service", () => {
    EnvironmentServiceLocator.register(MOCK_SERVICE);
    EnvironmentServiceLocator.clear();

    const func = () => EnvironmentServiceLocator.get();

    expect(func).toThrow("No EnvironmentService registered");
  });
});
