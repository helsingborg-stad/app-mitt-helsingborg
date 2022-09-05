import DeviceInfo from "react-native-device-info";

import getIPv4Address from "../NetworkInfo";
import {
  getUserFriendlyAppVersion,
  roundToPrecision,
  BYTES_PER_GIGABYTE,
  getPhoneLocale,
} from "../Misc";

import type { DebugInfoCategoryGetter } from "./debugInfo.types";

const systemInfo: DebugInfoCategoryGetter = {
  name: "System",
  getEntries: async () => [
    {
      name: "Version",
      value: getUserFriendlyAppVersion(),
    },
    {
      name: "Märke",
      value: `${DeviceInfo.getBrand()} (${await DeviceInfo.getManufacturer()})`,
    },
    {
      name: "Model",
      value: `${DeviceInfo.getModel()} (${DeviceInfo.getDeviceId()})`,
    },
    {
      name: "Produkt",
      value: await DeviceInfo.getProduct(),
    },
    {
      name: "OS",
      value: `${DeviceInfo.getSystemName()} (${DeviceInfo.getSystemVersion()})`,
    },
    {
      name: "RAM",
      value: `${roundToPrecision(
        (await DeviceInfo.getTotalMemory()) / BYTES_PER_GIGABYTE,
        1
      ).toString(10)} GB`,
    },
    {
      name: "Disk",
      value: `${roundToPrecision(
        (await DeviceInfo.getFreeDiskStorage()) / BYTES_PER_GIGABYTE,
        2
      )} / ${roundToPrecision(
        (await DeviceInfo.getTotalDiskCapacity()) / BYTES_PER_GIGABYTE,
        2
      )} GB`,
    },
    {
      name: "IP-adress",
      value: (await getIPv4Address()) ?? "<unknown>",
    },
    {
      name: "Språk",
      value: getPhoneLocale(),
    },
  ],
};

export default systemInfo;
