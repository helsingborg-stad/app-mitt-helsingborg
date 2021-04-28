import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import StorageService, { ACCESS_TOKEN_KEY } from '../services/StorageService';
import { buildServiceUrl } from './UrlHelper';

export const getBlob = async (fileUri: string) => {
  const response = await fetch(fileUri);
  const fileBlob = await response.blob();
  return fileBlob;
};

type AllowedFileTypes = 'jpg' | 'jpeg' | 'png' | 'pdf';
const MIMEs: Record<AllowedFileTypes, string> = {
  jpg: 'image/jpg',
  jpeg: 'image/jpg',
  png: 'image/png',
  pdf: 'application/pdf',
};

interface FileUploadParams {
  endpoint: string;
  fileName: string;
  fileType: AllowedFileTypes;
  data: Blob | Buffer;
  headers?: Record<string, string>;
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
}: FileUploadParams) => {
  const requestUrl = await buildServiceUrl(endpoint);
  const token = await StorageService.getData(ACCESS_TOKEN_KEY);
  const bearer = token || '';

  // Merge custom headers
  const newHeaders = {
    Authorization: bearer,
    'Content-Type': 'application/json',
    ...headers,
  };

  try {
    const signedUrlResponse = await axios({
      url: requestUrl,
      method: 'post',
      headers: newHeaders,
      data: { fileName, mime: MIMEs[fileType] },
    });

    const fileUploadAttributes = signedUrlResponse.data.data.attributes;
    const { uploadUrl } = fileUploadAttributes;

    const putResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: data,
      headers: {
        'Content-Type': MIMEs[fileType],
        'Content-Encoding': 'base64',
        'x-amz-acl': 'public-read',
      },
    });

    if (!putResponse.ok) {
      throw new Error(`${putResponse.status} ${putResponse.statusText}`);
    }

    // return the url and filename on server to the uploaded file.
    return { url: putResponse.url, uploadedFileName: fileUploadAttributes.fileName };
  } catch (error) {
    console.error('Error while uploading file:', error);
    return { error: true, message: error.message, ...error.response };
  }
};

const MimeTypes = {
  jpg: 'image/jpeg',
  png: 'image/png',
  pdf: 'application/pdf',
};

interface FileDownloadParams {
  endpoint: string;
  filename: string;
}

export const downloadFile = async ({ endpoint, filename }: FileDownloadParams) => {
  const fileEnding = filename.split('.').pop();
  const mime = MimeTypes[fileEnding];
  const requestUrl = await buildServiceUrl(`${endpoint}/${filename}`);
  const token = await StorageService.getData(ACCESS_TOKEN_KEY);
  const bearer = token || '';

  const { dirs } = RNFetchBlob.fs;
  try {
    const downloadResult = await RNFetchBlob.config({
      path: `${dirs.CacheDir}/${filename}`,
    }).fetch('GET', requestUrl, {
      Authorization: bearer,
      Accept: mime,
    });
    return `file://${downloadResult.path()}`;
  } catch (error) {
    console.log('axios download error: ', error);
    return { error: true, message: error.message, ...error.response };
  }
};
