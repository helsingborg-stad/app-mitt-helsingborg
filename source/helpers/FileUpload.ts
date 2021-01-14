import axios from 'axios';
import StorageService, { TOKEN_KEY } from '../services/StorageService';
import { buildServiceUrl } from './UrlHelper';

export const getBlob = async (fileUri: string) => {
  const response = await fetch(fileUri);
  const fileBlob = await response.blob();
  return fileBlob;
};

/**
 * Helper for uploading a file to S3
 *
 * @param {string} endpoint
 * @param {string} fileName
 * @param {string} fileType
 * @param {Blob | Buffer} fileData should be binary data (a blob, for example)
 * @param {obj} headers
 */
const uploadFile = async (
  endpoint: string,
  fileName: string,
  fileType: string,
  fileData: Blob | Buffer,
  headers: Record<string, string> = {}
) => {
  // Build complete api url
  const reqUrl = buildServiceUrl(endpoint);

  const token = await StorageService.getData(TOKEN_KEY);
  const bearer = token || '';

  // Merge custom headers
  const newHeaders = {
    Authorization: bearer,
    'Content-Type': 'application/json',
    ...headers,
  };

  try {
    // Do request
    const signedUrlResponse = await axios({
      url: reqUrl,
      method: 'post',
      headers: newHeaders,
      data: { fileName, mime: `image/${fileType}` },
    });

    const { uploadUrl, fileName: uploadedFileName } = signedUrlResponse.data.data.attributes;

    const putResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: fileData,
      headers: {
        'Content-Type': `image/${fileType}`,
        'Content-Encoding': 'base64',
        'x-amz-acl': 'public-read',
      },
    });
    // return the url and filename on server to the uploaded file.
    return { url: putResponse.url, uploadedFileName };
  } catch (error) {
    console.log('axios error', error);
    return { error: true, message: error.message, ...error.response };
  }
};

export default uploadFile;
