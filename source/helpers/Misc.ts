import { Dimensions } from "react-native";
import Config from "react-native-config";
import DeviceInfo from "react-native-device-info";

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
  };

  const prefixRegex = /^https:\/\/(?:(.*)\.)?api\.helsingborg.io/i;

  const apiUrlLowercase = apiUrl.toLowerCase();
  const match = apiUrlLowercase.match(prefixRegex);

  if (match) {
    const apiPrefix = match[1];

    if (apiPrefix === undefined) {
      return "p";
    }

    const acceptablePrefixLetter = apiUrlPrefixEnvironmentMapping[apiPrefix];

    if (typeof acceptablePrefixLetter === "string") {
      return acceptablePrefixLetter;
    }
  }
  return null;
}

export function getAPIEnvironmentIdentifier(): string | null {
  const isDev = Config.APP_ENV === "development";

  const apiUrl = isDev
    ? Config.MITTHELSINGBORG_IO_DEV
    : Config.MITTHELSINGBORG_IO;

  return getAPIEnvironmentIdentifierFromUrl(apiUrl);
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
