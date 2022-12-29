import env from "react-native-config";
import { Linking, Platform } from "react-native";
import { EnvironmentServiceLocator } from "../services/environment";
/**
 * Open requested URL
 *
 * @param {String} url
 */
export const openUrl = (url: string): Promise<boolean> =>
  Linking.openURL(url)
    .then(() => true)
    .catch(() => false);

/**
 * Test if URL can be opened
 * @param {string} url
 */
export const canOpenUrl = (url: string): Promise<boolean> =>
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        return true;
      }
      return false;
    })
    .catch((err) => {
      console.error("An error occurred", err);
      return false;
    });

/**
 * Build query URL
 * @param {obj} queryParams
 */
const encodeQueryData = (
  queryParams:
    | { [s: string]: string | number | boolean }
    | ArrayLike<string | number | boolean>
) => {
  const data: string[] = [];
  const entries = Object.entries(queryParams);
  entries.forEach(([key, value]) => {
    data.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  });

  return data.join("&");
};

export const buildServiceUrl = async (
  endpoint = "",
  params = {}
): Promise<string> => {
  const { url } = EnvironmentServiceLocator.get().getActive();
  // Build query url
  const queryString = encodeQueryData(params);
  // Trim slashes
  const sanitizedEndpoint = endpoint.replace(/^\/|\/$/g, "");
  // Build url
  const completeUrl = `${url}/${sanitizedEndpoint}?${queryString}`;

  return completeUrl;
};

/**
 * Builds the BankID client URL
 * @param {string} autoStartToken
 */
export const buildBankIdClientUrl = (autoStartToken: string): string => {
  let url = "bankid:///";
  let queryString = `?autostarttoken=${autoStartToken}&redirect=null`;

  if (Platform.OS === "ios") {
    url = "https://app.bankid.com/";
    queryString = `?autostarttoken=${autoStartToken}&redirect=${env.APP_SCHEME}://`;
  }

  return `${url}${queryString}`;
};
