import { NetworkInfo } from "react-native-network-info";
import { NativeModules } from "react-native";

interface CustomNetworkInfo {
  GetIPv4Address: () => Promise<string | null>;
}

export default async function getIPv4Address(): Promise<string | null> {
  const customNetworkInfoModule: CustomNetworkInfo =
    NativeModules.BasicNetworkInfoModule;

  if (customNetworkInfoModule) {
    return customNetworkInfoModule.GetIPv4Address();
  }

  return NetworkInfo.getIPV4Address();
}
