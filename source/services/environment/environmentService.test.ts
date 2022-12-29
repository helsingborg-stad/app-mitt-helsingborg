import EnvironmentServiceLocator from "./environmentServiceLocator";
import DefaultEnvironmentService, {
  ENVIRONMENT_CONFIG_STORAGE_KEY,
} from "./environmentService";
import type { EnvironmentConfig } from "./environmentService.types";
import type { IStorage } from "../storage/StorageService";

const MOCK_RAW_CONFIG_TEXT =
  '{"sandbox":["https://example.com/","abc123"],"develop":["https://example.com/dev","0000"]}';
const MOCK_RAW_CONFIG = JSON.parse(MOCK_RAW_CONFIG_TEXT);
const MOCK_CONFIG: Record<string, EnvironmentConfig> = {
  sandbox: {
    url: "https://example.com/",
    apiKey: "abc123",
  },
  develop: {
    url: "https://example.com/dev",
    apiKey: "0000",
  },
};

const MOCK_STORAGE: IStorage = {
  async getData(): Promise<string | null> {
    return null;
  },
  async saveData(): Promise<void> {
    //
  },
};

describe("EnvironmentService", () => {
  it("parses", () => {
    EnvironmentServiceLocator.register(
      new DefaultEnvironmentService(MOCK_STORAGE)
    );
    const service = EnvironmentServiceLocator.get();

    service.parse(MOCK_RAW_CONFIG);
    const result = service.getEnvironments();

    expect(result).toEqual(MOCK_CONFIG);
  });

  it("saves to storage on parse", () => {
    const saveFunc = jest.fn();

    EnvironmentServiceLocator.register(
      new DefaultEnvironmentService({ ...MOCK_STORAGE, saveData: saveFunc })
    );
    const service = EnvironmentServiceLocator.get();

    service.parse(MOCK_RAW_CONFIG);

    expect(saveFunc).toHaveBeenCalledWith(
      ENVIRONMENT_CONFIG_STORAGE_KEY,
      MOCK_RAW_CONFIG_TEXT
    );
  });

  it("loads from storage", async () => {
    const getFunc = jest.fn().mockReturnValue(null);

    EnvironmentServiceLocator.register(
      new DefaultEnvironmentService({ ...MOCK_STORAGE, getData: getFunc })
    );
    const service = EnvironmentServiceLocator.get();

    await service.parseFromStorage();

    expect(getFunc).toHaveBeenCalledWith(ENVIRONMENT_CONFIG_STORAGE_KEY);
  });

  it("returns the set active environment", () => {
    EnvironmentServiceLocator.register(
      new DefaultEnvironmentService(MOCK_STORAGE)
    );
    const service = EnvironmentServiceLocator.get();
    service.parse(MOCK_RAW_CONFIG);

    service.setActive("sandbox");
    const result = service.getActive();

    expect(result).toEqual(MOCK_CONFIG.sandbox);
  });

  it("throws when an invalid environment is set as active", () => {
    EnvironmentServiceLocator.register(
      new DefaultEnvironmentService(MOCK_STORAGE)
    );
    const service = EnvironmentServiceLocator.get();
    service.parse(MOCK_RAW_CONFIG);

    const func = () => service.setActive("invalid");

    expect(func).toThrow(
      "Environment 'invalid' does not exist in list: sandbox, develop"
    );
  });

  it("uses fallback when no active environment is set", () => {
    const expectedUrl = "http://example.com/fallback";
    const expectedApiKey = "12345";

    EnvironmentServiceLocator.register(
      new DefaultEnvironmentService(MOCK_STORAGE, {
        MITTHELSINGBORG_IO: expectedUrl,
        MITTHELSINGBORG_IO_APIKEY: expectedApiKey,
      })
    );
    const service = EnvironmentServiceLocator.get();

    const result = service.getActive();

    expect(result).toEqual({
      url: expectedUrl,
      apiKey: expectedApiKey,
    });
  });

  it("throws if no active environment is set and no fallback is found", () => {
    EnvironmentServiceLocator.register(
      new DefaultEnvironmentService(MOCK_STORAGE, {})
    );
    const service = EnvironmentServiceLocator.get();

    const func = () => service.getActive();

    expect(func).toThrow(
      "No active environment set and no fallback environment found"
    );
  });
});
