import axios from 'axios';
import StorageService, { ACCESS_TOKEN_KEY } from '../services/StorageService';
import { buildServiceUrl } from './UrlHelper';

export const getBlob = async (fileUri: string) => {
  const response = await fetch(fileUri);
  const fileBlob = await response.blob();
  return fileBlob;
};

interface FileUploadParams {
  endpoint: string;
  fileName: string;
  fileType: string;
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
      data: { fileName, mime: `image/${fileType}` },
    });

    const fileUploadAttributes = signedUrlResponse.data.data.attributes;
    const { uploadUrl } = fileUploadAttributes;

    const putResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: data,
      headers: {
        'Content-Type': `image/${fileType}`,
        'Content-Encoding': 'base64',
        'x-amz-acl': 'public-read',
      },
    });
    // return the url and filename on server to the uploaded file.
    return { url: putResponse.url, uploadedFileName: fileUploadAttributes.fileName };
  } catch (error) {
    console.log('axios error', error);
    return { error: true, message: error.message, ...error.response };
  }
};
