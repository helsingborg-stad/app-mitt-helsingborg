import { Dimensions } from "react-native";
import Config from "react-native-config";
import DeviceInfo from "react-native-device-info";
import EnvironmentConfigurationService from "../services/EnvironmentConfigurationService";

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getScreenHeightProportion(proportion: number): number {
  return Math.floor((Dimensions.get("window").height * proportion) / 100);
}

export function getAPIEnvironmentIdentifierFromUrl(
  apiUrl: string
): string | null {
  const apiUrlPrefixEnvironmentMapping: Record<string, string> = {
    dev: "d",
    release: "r",
    staging: "s",
    test: "t",
    api: "p",
  };

  const prefixRegex = /^(?:[a-z]+:\/\/)?([a-zA-Z0-9-]+?)\..*/i;

  const apiUrlLowercase = apiUrl.toLowerCase();
  const match = apiUrlLowercase.match(prefixRegex);

  if (match) {
    const apiPrefix = match[1];
    const acceptablePrefixLetter = apiUrlPrefixEnvironmentMapping[apiPrefix];

    if (typeof acceptablePrefixLetter === "string") {
      return acceptablePrefixLetter;
    }
  }

  return null;
}

export function getAPIEnvironmentIdentifier(): string | null {
  const { baseUrl } =
    EnvironmentConfigurationService.getInstance().activeEndpoint;
  return getAPIEnvironmentIdentifierFromUrl(baseUrl);
}

export function getUserFriendlyAppVersion(): string {
  const SHORT_HASH_LENGTH = 7;

  const semver = DeviceInfo.getVersion();
  const build = DeviceInfo.getBuildNumber();
  const envLetter = getAPIEnvironmentIdentifier() ?? "";
  const hash = Config.GIT_COMMIT_HASH ?? "";
  const shortHash = hash.length > 7 ? hash.substr(0, SHORT_HASH_LENGTH) : hash;

  return `v${semver}-${build}${envLetter}-${shortHash}`;
}
