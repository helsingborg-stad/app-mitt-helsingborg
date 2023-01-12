import EnvironmentServiceLocator from "./environmentServiceLocator";
import DefaultEnvironmentService, {
  ACTIVE_ENVIRONMENT_STORAGE_KEY,
  ENVIRONMENT_CONFIG_STORAGE_KEY,
} from "./environmentService";
import type { EnvironmentConfigMap } from "./environmentService.types";
import type { IStorage } from "../storage/StorageService";

const MOCK_RAW_CONFIG_TEXT =
  '{"sandbox":["https://example.com/sandbox","abc123"],"develop":["https://example.com/dev","0000"]}';
const MOCK_CONFIG: EnvironmentConfigMap = {
  sandbox: {
    name: "sandbox",
    url: "https://example.com/sandbox",
    apiKey: "abc123",
  },
  develop: {
    name: "develop",
    url: "https://example.com/dev",
    apiKey: "0000",
  },
};

const MOCK_FALLBACK_URL = "http://example.com/fallback";
const MOCK_FALLBACK_APIKEY = "12345";
const MOCK_FALLBACK_CONFIG = {
  name: "default",
  url: MOCK_FALLBACK_URL,
  apiKey: MOCK_FALLBACK_APIKEY,
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
  it("parses", async () => {
    EnvironmentServiceLocator.register(
      new DefaultEnvironmentService(MOCK_STORAGE)
    );
    const service = EnvironmentServiceLocator.get();

    await service.parse(MOCK_RAW_CONFIG_TEXT);
    const result = service.getEnvironmentMap();

    expect(result).toEqual(MOCK_CONFIG);
  });

  it("saves to storage on parse", async () => {
    const saveFunc = jest.fn();

    EnvironmentServiceLocator.register(
      new DefaultEnvironmentService({ ...MOCK_STORAGE, saveData: saveFunc })
    );
    const service = EnvironmentServiceLocator.get();

    await service.parse(MOCK_RAW_CONFIG_TEXT);

    expect(saveFunc).toHaveBeenCalledWith(
      ENVIRONMENT_CONFIG_STORAGE_KEY,
      MOCK_RAW_CONFIG_TEXT
    );
  });

  it("loads environment config and active environment from storage", async () => {
    const getFunc = jest
      .fn()
      .mockReturnValueOnce(MOCK_RAW_CONFIG_TEXT)
      .mockReturnValueOnce("sandbox");

    EnvironmentServiceLocator.register(
      new DefaultEnvironmentService({ ...MOCK_STORAGE, getData: getFunc })
    );
    const service = EnvironmentServiceLocator.get();

    await service.parseFromStorage();

    expect(getFunc).toHaveBeenCalledTimes(2);
    expect(getFunc).toHaveBeenCalledWith(ENVIRONMENT_CONFIG_STORAGE_KEY);
    expect(getFunc).toHaveBeenCalledWith(ACTIVE_ENVIRONMENT_STORAGE_KEY);
  });

  it("returns the set active environment", async () => {
    EnvironmentServiceLocator.register(
      new DefaultEnvironmentService(MOCK_STORAGE)
    );
    const service = EnvironmentServiceLocator.get();
    await service.parse(MOCK_RAW_CONFIG_TEXT);

    await service.setActive("sandbox");
    const result = service.getActive();

    expect(result).toEqual(MOCK_CONFIG.sandbox);
  });

  it("throws when an invalid environment is set as active", async () => {
    EnvironmentServiceLocator.register(
      new DefaultEnvironmentService(MOCK_STORAGE)
    );
    const service = EnvironmentServiceLocator.get();
    await service.parse(MOCK_RAW_CONFIG_TEXT);

    const func = () => service.setActive("invalid");

    await expect(func).rejects.toThrow(
      "Environment 'invalid' does not exist in list: sandbox, develop"
    );
  });

  it("uses first (alphabetical) environment if no active is explicitely set", async () => {
    EnvironmentServiceLocator.register(
      new DefaultEnvironmentService(MOCK_STORAGE)
    );
    const service = EnvironmentServiceLocator.get();
    await service.parse(MOCK_RAW_CONFIG_TEXT);

    const result = service.getActive();

    expect(result).toEqual(MOCK_CONFIG.develop);
  });

  it("keeps the same active environment by name if available after parse", async () => {
    EnvironmentServiceLocator.register(
      new DefaultEnvironmentService(MOCK_STORAGE)
    );

    const service = EnvironmentServiceLocator.get();
    await service.parse(MOCK_RAW_CONFIG_TEXT);
    await service.setActive("develop");
    await service.parse('{"develop":["a","b"]}');
    const result = service.getActive();

    expect(result).toEqual({
      name: "develop",
      url: "a",
      apiKey: "b",
    });
  });

  it("uses fallback when active environment is set to blank value", async () => {
    const saveSpy = jest.spyOn(MOCK_STORAGE, "saveData");
    EnvironmentServiceLocator.register(
      new DefaultEnvironmentService(MOCK_STORAGE, {
        MITTHELSINGBORG_IO: MOCK_FALLBACK_URL,
        MITTHELSINGBORG_IO_APIKEY: MOCK_FALLBACK_APIKEY,
      })
    );
    const service = EnvironmentServiceLocator.get();
    await service.parse(MOCK_RAW_CONFIG_TEXT);
    await service.setActive("sandbox");
    const result1 = service.getActive();
    await service.setActive("");
    const result2 = service.getActive();

    expect(result1).not.toEqual(MOCK_FALLBACK_CONFIG);
    expect(result2).toEqual(MOCK_FALLBACK_CONFIG);
    expect(saveSpy).toHaveBeenLastCalledWith(
      ACTIVE_ENVIRONMENT_STORAGE_KEY,
      ""
    );
  });

  it("clears configs and active when parsing empty input", async () => {
    EnvironmentServiceLocator.register(
      new DefaultEnvironmentService(MOCK_STORAGE, {
        MITTHELSINGBORG_IO: MOCK_FALLBACK_URL,
        MITTHELSINGBORG_IO_APIKEY: MOCK_FALLBACK_APIKEY,
      })
    );

    const service = EnvironmentServiceLocator.get();
    await service.parse(MOCK_RAW_CONFIG_TEXT);
    await service.setActive("sandbox");
    const map1 = service.getEnvironmentMap();
    const active1 = service.getActive();
    await service.parse("");
    const map2 = service.getEnvironmentMap();
    const active2 = service.getActive();

    expect(map1).toEqual(MOCK_CONFIG);
    expect(map2).toEqual({});
    expect(active1).toEqual(MOCK_CONFIG.sandbox);
    expect(active2).toEqual(MOCK_FALLBACK_CONFIG);
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

  it("throws if an invalid environment name is provided", async () => {
    EnvironmentServiceLocator.register(
      new DefaultEnvironmentService(MOCK_STORAGE, {
        MITTHELSINGBORG_IO: MOCK_FALLBACK_URL,
        MITTHELSINGBORG_IO_APIKEY: MOCK_FALLBACK_APIKEY,
      })
    );

    const service = EnvironmentServiceLocator.get();

    const func = () => service.setActive("invalid");

    await expect(func).rejects.toThrow(
      "Environment 'invalid' does not exist in list: "
    );
  });
});
