const fs = require("fs");

const replaced = `import ReactNativeBlobUtil from '../index.js'`;
const replacement = `import {NativeModules} from 'react-native';\nconst ReactNativeBlobUtil = NativeModules.ReactNativeBlobUtil`;

const files = [
  "node_modules/react-native-blob-util/polyfill/Fetch.js",
  "node_modules/react-native-blob-util/polyfill/Blob.js",
  "node_modules/react-native-blob-util/polyfill/XMLHttpRequest.js",
];

files.forEach((file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    const result = data.replace(new RegExp(replaced, "g"), replacement);
    fs.writeFile(file, result, "utf8", (err2) => {
      if (err2) {
        console.log(err2);
      }
    });
  });
});
