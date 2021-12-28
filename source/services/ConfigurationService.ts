import { NativeConfig } from "react-native-config";

const URL_SUFFIX = "_MITTHELSINGBORG_IO";
const API_SUFFIX = "_MITTHELSINGBORG_IO_APIKEY";

interface Endpoint {
  name: string;
  baseUrl: string;
  apiKey: string;
}

interface EnvironmentOption {
  label: string;
  value: Endpoint;
  key: string;
}

export default class ConfigurationService {
  private endpoints: Endpoint[];

  private endpoint: Endpoint;

  constructor(
    readonly configurationNames: string[],
    readonly source: NativeConfig | { [key: string]: string }
  ) {
    this.endpoints = configurationNames
      .map((name) => ({
        name,
        baseUrl: source[`${name}${URL_SUFFIX}`],
        apiKey: source[`${name}${API_SUFFIX}`],
      }))
      .filter(({ baseUrl, apiKey }) => baseUrl && apiKey);
    [this.endpoint] = this.endpoints;
  }

  get environments(): string[] {
    return this.endpoints.map(({ name }) => name);
  }

  get activeEndpoint(): Endpoint {
    return this.endpoint;
  }

  set activeEndpoint(endpoint: Endpoint) {
    this.endpoint = endpoint;
  }

  get environmentOptions(): EnvironmentOption[] {
    return this.endpoints.map((endpoint) => ({
      label: endpoint.name,
      value: endpoint,
      key: endpoint.name,
    }));
  }
}
