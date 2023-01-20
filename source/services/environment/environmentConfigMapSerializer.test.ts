import type {
  RawEnvironmentConfigMap,
  SerializedEnvironmentConfigMap,
  EnvironmentConfigMap,
} from "./environmentService.types";
import {
  rawEnvironmentConfigMapToEnvironmentConfigMap,
  deserializeEnvironmentConfigMap,
  environmentConfigMapToRawEnvironmentConfigMap,
  serializeEnvironmentConfigMap,
} from "./environmentConfigMapSerializer";

const MOCK_CONFIG: EnvironmentConfigMap = {
  sandbox: {
    name: "sandbox",
    url: "https://example.com",
    apiKey: "abc123",
  },
  develop: {
    name: "develop",
    url: "https://example.com/dev",
    apiKey: "xyz987",
  },
};

const MOCK_CONFIG_RAW: RawEnvironmentConfigMap = {
  sandbox: ["https://example.com", "abc123"],
  develop: ["https://example.com/dev", "xyz987"],
};

const MOCK_CONFIG_SERIALIZED: SerializedEnvironmentConfigMap =
  '{"sandbox":["https://example.com","abc123"],"develop":["https://example.com/dev","xyz987"]}';

describe("environmentConfigMapSerializer", () => {
  describe("serializeEnvironmentConfigMap", () => {
    it("serializes", () => {
      const result = serializeEnvironmentConfigMap(MOCK_CONFIG);

      expect(result).toBe(MOCK_CONFIG_SERIALIZED);
    });
  });

  describe("deserializeEnvironmentConfigMap", () => {
    it("deserializes", () => {
      const result = deserializeEnvironmentConfigMap(MOCK_CONFIG_SERIALIZED);

      expect(result).toEqual(MOCK_CONFIG);
    });
  });

  describe("environmentConfigMapToRawEnvironmentConfigMap", () => {
    it("converts", () => {
      const result = environmentConfigMapToRawEnvironmentConfigMap(MOCK_CONFIG);

      expect(result).toEqual(MOCK_CONFIG_RAW);
    });
  });

  describe("rawEnvironmentConfigMapToEnvironmentConfigMap", () => {
    it("converts", () => {
      const result =
        rawEnvironmentConfigMapToEnvironmentConfigMap(MOCK_CONFIG_RAW);

      expect(result).toEqual(MOCK_CONFIG);
    });
  });
});
