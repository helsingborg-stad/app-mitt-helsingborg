import axios from 'axios';
import StorageService, { TOKEN_KEY } from '../services/StorageService';
import { buildServiceUrl } from './UrlHelper';

/**
 * Helper for uploading a file to S3
 *
 * @param {string} endpoint
 * @param {string} fileName
 * @param {string} fileType
 * @param {obj} fileData should be binary data (a blob, for example)
 * @param {obj} headers
 */
const uploadFile = async (endpoint, fileName, fileType, fileData, headers = {}) => {
  // Build complete api url
  const reqUrl = buildServiceUrl(endpoint);
  // console.log(reqUrl);

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

    // alternative version
    // const { url, fields } = signedUrlResponse.data.data.attributes;

    const { uploadUrl, fileName: uploadedFileName } = signedUrlResponse.data.data.attributes;

    const putResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: fileData,
      headers: {
        'Content-Type': `image/${fileType}`,
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
