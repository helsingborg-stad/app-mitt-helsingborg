import getMessage from "../helpers/MessageHelper";
import {
  buildBankIdClientUrl,
  canOpenUrl,
  openUrl,
} from "../helpers/UrlHelper";
import { post } from "../helpers/ApiRequest";
import getIPv4Address from "../helpers/NetworkInfo";

async function getIPForBankID() {
  const ip = await getIPv4Address();
  return ip ?? "0.0.0.0";
}

/**
 * Function for polling the status in a BankID authentication process.
 * @param {string} orderRef A valid BankID order reference
 */
async function collect(
  orderRef: string
): Promise<{ success: boolean; data: string }> {
  try {
    const response = await post("auth/bankid/collect", { orderRef });
    const bankIDStatus = response?.data?.data?.attributes?.status;
    const hintCode =
      response?.data?.data?.attributes?.hintCode ?? "unkownError";

    if (response.status === 404) {
      return { success: false, data: getMessage("userCancel") };
    }
    if (response.status === 200 && bankIDStatus === "pending") {
      // Reconnect in one 1050 ms
      await new Promise((resolve) => setTimeout(resolve, 1050));
      return await collect(orderRef);
    }
    if (response.status === 200 && bankIDStatus === "failed") {
      return { success: false, data: getMessage(hintCode) };
    }
    return { success: true, data: response?.data?.data };
  } catch (error) {
    console.error(`BankID Collect Error: ${error}`);
    return { success: false, data: getMessage("unkownError") };
  }
}

/**
 * Function for handling a BankID Authentication request.
 * @param {string} ssn A Swedish Social Security Number.
 */
async function auth(ssn) {
  const endUserIp = await getIPForBankID();
  console.log("ip", endUserIp);
  try {
    const response = await post("auth/bankid/auth", {
      personalNumber: ssn,
      endUserIp,
    });
    if (response.status === 400) {
      return await auth(ssn);
    }
    if (response.status !== 200) {
      throw new Error(response.message);
    }
    return { success: true, data: response.data.data.attributes };
  } catch (error) {
    console.error(`BankID Auth Error: ${error}`);
    return { success: false, data: getMessage("technicalError") };
  }
}

async function cancel(orderRef) {
  try {
    await post("auth/bankid/cancel", { orderRef });
    return { success: true };
  } catch (err) {
    console.error("BankID Cancel Error", err);
    return { success: false, data: getMessage("technicalError") };
  }
}

async function sign(personalNumber, userVisibleData) {
  const endUserIp = await getIPForBankID();

  const requestBody = {
    personalNumber,
    endUserIp,
    userVisibleData,
  };

  try {
    const { data } = await post("auth/bankid/sign", requestBody);
    return { success: true, data: data.data.attributes };
  } catch (error) {
    console.error("BankID Sign Error:", error);
    return { success: false, data: getMessage("technicalError") };
  }
}

/**
 * Launch BankID app on device
 *
 * @param {string} autoStartToken Token retrived from a bankid auth request.
 */
const launchApp = async (autoStartToken) => {
  const bankIdClientUrl = buildBankIdClientUrl(autoStartToken);
  // Launch app if it's installed on this machine
  const canLaunchApp = await canOpenUrl("bankid:///");
  if (canLaunchApp) {
    openUrl(bankIdClientUrl);
  }
};

const bankid = {
  auth,
  collect,
  cancel,
  sign,
  launchApp,
};

export default bankid;
