import axios from "axios";
import { Buffer } from "buffer";

import StorageService, {
  ACCESS_TOKEN_KEY,
} from "../services/storage/StorageService";
import { buildServiceUrl } from "./UrlHelper";
import EnvironmentConfigurationService from "../services/EnvironmentConfigurationService";

interface FileUploadParams {
  endpoint: string;
  mime: string;
  data: string;
  headers?: Record<string, string>;
}

interface UploadFileResponse {
  id: string;
}

/**
 * Helper for uploading a file to S3
 */
export const uploadFile = async ({
  endpoint,
  mime,
  data,
  headers,
}: FileUploadParams): Promise<UploadFileResponse> => {
  const requestUrl = await buildServiceUrl(endpoint);
  const token = await StorageService.getData(ACCESS_TOKEN_KEY);
  const { apiKey } =
    EnvironmentConfigurationService.getInstance().activeEndpoint;

  const bearer = token || "";

  // Merge custom headers
  const newHeaders = {
    Authorization: bearer,
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    ...headers,
  };

  try {
    const signedUrlResponse = await axios({
      url: requestUrl,
      method: "post",
      headers: newHeaders,
      data: { mime },
    });

    const fileUploadAttributes = signedUrlResponse.data.data;
    const { uploadUrl, id } = fileUploadAttributes;

    const putResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: Buffer.from(data, "base64"),
      headers: {
        "Content-Type": mime,
        "Content-Encoding": "base64",
        "x-amz-acl": "public-read",
        "x-api-key": apiKey,
      },
    });

    if (!putResponse.ok) {
      throw new Error(`${putResponse.status} ${putResponse.statusText}`);
    }

    return {
      id,
    };
  } catch (error) {
    console.error("Error while uploading file:", error);
    return { error: true, message: error?.message, ...error?.response };
  }
};

export function splitFilePath(inPath: string | undefined | null): {
  dir: string;
  name: string;
  ext: string;
  nameWithExt: string;
} {
  if (!inPath) return { dir: "", name: "", ext: "", nameWithExt: "" };

  const lastSlash = inPath.lastIndexOf("/");

  const dir = lastSlash >= 0 ? inPath.substring(0, lastSlash) : "";
  const basename = lastSlash >= 0 ? inPath.substring(lastSlash + 1) : inPath;
  const firstDot = basename.indexOf(".");
  const name = firstDot >= 0 ? basename.substring(0, firstDot) : basename;
  const ext = firstDot >= 0 ? basename.substring(firstDot) : "";
  const nameWithExt = `${name}${ext}`;

  return { dir, name, ext, nameWithExt };
}
