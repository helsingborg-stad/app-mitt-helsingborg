import env, { NativeConfig } from "react-native-config";

const URL_SUFFIX = "_MITTHELSINGBORG_IO";
const API_SUFFIX = "_MITTHELSINGBORG_IO_APIKEY";

interface Endpoint {
  baseUrl: string;
  apiKey: string;
}

interface EnvironmentOption {
  label: string;
  value: Endpoint;
  key: number;
}

export default class ConfigurationService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly source: NativeConfig | { [key: string]: string } = env
  ) {}

  /**
   * Returns the environments specified in the API_ENVS variable as an array
   */
  get environments(): string[] {
    return this.source.API_ENVS?.split(",") ?? ["DEVELOP"];
  }

  /**
   * Returns the endpoint first environment specified in the API_ENVS variable
   */
  get defaultEndpoint(): Endpoint {
    return this.getNamedEndpoint(this.environments[0]);
  }

  /**
   * Returns the complete set of environment options in a format that could be consumed by a picker
   */
  get environmentOptions(): EnvironmentOption[] {
    return this.environments.map((label, key) => ({
      label,
      value: this.getNamedEndpoint(label),
      key,
    }));
  }

  /**
   * Extracts endpoint information from a name value set
   * @param name The name of the environment as it appears in the API_ENVS key
   * @returns The url and apikey of the endpoint
   */
  getNamedEndpoint(name: string): Endpoint {
    const baseUrl = this.source[`${name}${URL_SUFFIX}`];
    const apiKey = this.source[`${name}${API_SUFFIX}`];

    if (baseUrl && apiKey) {
      return {
        baseUrl,
        apiKey,
      };
    }
    throw new Error(`Missing Environment variable for key ${name}`);
  }
}
