import axios from "axios";
import ReactNativeBlobUtil from "react-native-blob-util";

import StorageService, {
  ACCESS_TOKEN_KEY,
} from "../services/storage/StorageService";
import { buildServiceUrl } from "./UrlHelper";
import EnvironmentConfigurationService from "../services/EnvironmentConfigurationService";

export const getBlob = async (fileUri: string): Promise<Blob> => {
  const response = await fetch(fileUri);
  const fileBlob = await response.blob();
  return fileBlob;
};

export type AllowedFileTypes = "jpg" | "jpeg" | "png" | "pdf";
const MIMEs: Record<AllowedFileTypes, string> = {
  jpg: "image/jpg",
  jpeg: "image/jpg",
  png: "image/png",
  pdf: "application/pdf",
};

interface FileUploadParams {
  endpoint: string;
  fileName: string;
  fileType: AllowedFileTypes;
  data: Blob | Buffer;
  headers?: Record<string, string>;
}

interface UploadFileResponse {
  url: string;
  uploadedFileName: string;
  message?: string;
}

/**
 * Helper for uploading a file to S3
 */
export const uploadFile = async ({
  endpoint,
  fileName,
  fileType,
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
      data: { fileName, mime: MIMEs[fileType] },
    });

    const fileUploadAttributes = signedUrlResponse.data.data.attributes;
    const { uploadUrl } = fileUploadAttributes;

    const putResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: data,
      headers: {
        "Content-Type": MIMEs[fileType],
        "Content-Encoding": "base64",
        "x-amz-acl": "public-read",
        "x-api-key": apiKey,
      },
    });

    if (!putResponse.ok) {
      throw new Error(`${putResponse.status} ${putResponse.statusText}`);
    }

    // return the url and filename on server to the uploaded file.
    return {
      url: putResponse.url,
      uploadedFileName: fileUploadAttributes.fileName,
    };
  } catch (error) {
    console.error("Error while uploading file:", error);
    return { error: true, message: error.message, ...error.response };
  }
};

const MimeTypes = {
  jpg: "image/jpeg",
  png: "image/png",
  pdf: "application/pdf",
};

interface FileDownloadParams {
  endpoint: string;
  filename: string;
}

export const downloadFile = async ({
  endpoint,
  filename,
}: FileDownloadParams): Promise<unknown> => {
  const fileEnding = filename.split(".").pop();
  const mime = MimeTypes[fileEnding];
  const requestUrl = await buildServiceUrl(`${endpoint}/${filename}`);
  const token = await StorageService.getData(ACCESS_TOKEN_KEY);
  const bearer = token || "";

  const { dirs } = ReactNativeBlobUtil.fs;
  try {
    const downloadResult = await ReactNativeBlobUtil.config({
      path: `${dirs.CacheDir}/${filename}`,
    }).fetch("GET", requestUrl, {
      Authorization: bearer,
      Accept: mime,
    });
    return `file://${downloadResult.path()}`;
  } catch (error) {
    console.log("axios download error: ", error);
    return { error: true, message: error.message, ...error.response };
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
