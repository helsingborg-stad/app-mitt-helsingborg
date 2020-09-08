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

    const { uploadUrl, uploadedFileName } = signedUrlResponse.data.data.attributes;

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

    // Alternative with signed post request that we didn't get to work... saving for reference if we later want to change this.
    // fields.acl = 'public-read';
    // const formData = new FormData();
    // Object.keys(fields).forEach(key => {
    //   formData.append(key, fields[key]);
    // });
    // formData.append('file', fileData);

    // console.log(
    //   'form data',
    //   JSON.stringify(
    //     {
    //       ...fields,
    //       file: fileData,
    //     },
    //     null,
    //     2
    //   )
    // );

    // const r = await fetch(url, {
    //   method: 'POST',
    //   body: formData,
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    // },
    // });
    // console.log(r);
    // return r;
  } catch (error) {
    console.log('axios error', error);
    return { error: true, message: error.message, ...error.response };
  }
};

export default uploadFile;
