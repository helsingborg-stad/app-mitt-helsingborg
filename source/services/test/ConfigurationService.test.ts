import ConfigurationService from "../ConfigurationService";

describe("Test parsing of environment variables", () => {
  it("Extract the API key and URL from environment variables", () => {
    const cfg = new ConfigurationService(["PRODUCTION"], {
      PRODUCTION_MITTHELSINGBORG_IO: "https://production",
      PRODUCTION_MITTHELSINGBORG_IO_APIKEY: "1234",
    });

    expect(cfg.activeEndpoint).toStrictEqual({
      name: "PRODUCTION",
      baseUrl: "https://production",
      apiKey: "1234",
    });
  });
  it("Return undefined when API KEY is missing", () => {
    const cfg = new ConfigurationService(["PRODUCTION"], {
      PRODUCTION_MITTHELSINGBORG_IO: "https://production",
    });

    expect(cfg.activeEndpoint).toBeUndefined();
  });

  it("Return undefined when URL KEY is missing", () => {
    const cfg = new ConfigurationService(["PRODUCTION"], {
      PRODUCTION_MITTHELSINGBORG_IO_APIKEY: "1234",
    });

    expect(cfg.activeEndpoint).toBeUndefined();
  });

  it("Choose first as default endpoint when multiple environments exists", () => {
    const cfg = new ConfigurationService(["DEVELOP", "PRODUCTION"], {
      PRODUCTION_MITTHELSINGBORG_IO: "https://production",
      PRODUCTION_MITTHELSINGBORG_IO_APIKEY: "1234",
      DEVELOP_MITTHELSINGBORG_IO: "https://develop",
      DEVELOP_MITTHELSINGBORG_IO_APIKEY: "5678",
    });

    expect(cfg.activeEndpoint).toStrictEqual({
      name: "DEVELOP",
      baseUrl: "https://develop",
      apiKey: "5678",
    });
  });

  it("Set active endpoint to arbitraty values", () => {
    const cfg = new ConfigurationService(["DEVELOP", "PRODUCTION"], {
      PRODUCTION_MITTHELSINGBORG_IO: "https://production",
      PRODUCTION_MITTHELSINGBORG_IO_APIKEY: "1234",
      DEVELOP_MITTHELSINGBORG_IO: "https://develop",
      DEVELOP_MITTHELSINGBORG_IO_APIKEY: "5678",
    });

    cfg.activeEndpoint = {
      name: "TEST",
      baseUrl: "https://test",
      apiKey: "1234",
    };

    expect(cfg.activeEndpoint).toStrictEqual({
      name: "TEST",
      baseUrl: "https://test",
      apiKey: "1234",
    });
  });
});
