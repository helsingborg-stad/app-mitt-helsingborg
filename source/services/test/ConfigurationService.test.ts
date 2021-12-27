import ConfigurationService from "../ConfigurationService";

describe("Test parsing of environment variables", () => {
  it("Extract the API key and URL from environment variables", () => {
    const cfg = new ConfigurationService({
      PRODUCTION_MITTHELSINGBORG_IO: "https://production",
      PRODUCTION_MITTHELSINGBORG_IO_APIKEY: "1234",
    });

    expect(cfg.getNamedEndpoint("PRODUCTION")).toStrictEqual({
      baseUrl: "https://production",
      apiKey: "1234",
    });
  });
  it("THROW when API key corresponding to the name is missing", () => {
    const cfg = new ConfigurationService({
      PRODUCTION_MITTHELSINGBORG_IO: "https://production",
    });

    expect(() => {
      cfg.getNamedEndpoint("PRODUCTION");
    }).toThrow();
  });

  it("THROW when the URL key corresponding the name is missing", () => {
    const cfg = new ConfigurationService({
      PRODUCTION_MITTHELSINGBORG_IO_APIKEY: "1234",
    });

    expect(() => {
      cfg.getNamedEndpoint("PRODUCTION");
    }).toThrow();
  });

  it("Choose default endpoint when the API_ENVS key exists", () => {
    const cfg = new ConfigurationService({
      API_ENVS: "DEVELOP,PRODUCTION",
      PRODUCTION_MITTHELSINGBORG_IO: "https://production",
      PRODUCTION_MITTHELSINGBORG_IO_APIKEY: "1234",
      DEVELOP_MITTHELSINGBORG_IO: "https://develop",
      DEVELOP_MITTHELSINGBORG_IO_APIKEY: "5678",
    });

    expect(cfg.defaultEndpoint).toStrictEqual({
      baseUrl: "https://develop",
      apiKey: "5678",
    });
  });

  it("Choose default endpoint as DEVELOP when the API_ENVS key is missing", () => {
    const cfg = new ConfigurationService({
      PRODUCTION_MITTHELSINGBORG_IO: "https://production",
      PRODUCTION_MITTHELSINGBORG_IO_APIKEY: "1234",
      DEVELOP_MITTHELSINGBORG_IO: "https://develop",
      DEVELOP_MITTHELSINGBORG_IO_APIKEY: "5678",
    });

    expect(cfg.defaultEndpoint).toStrictEqual({
      baseUrl: "https://develop",
      apiKey: "5678",
    });
  });
});
