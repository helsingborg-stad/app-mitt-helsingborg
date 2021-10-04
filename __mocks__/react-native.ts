import { NativeModulesStatic } from "react-native";
import crypto from "crypto";
import { AesModule } from "../source/types/Encryption";

interface NativeModulesEx extends NativeModulesStatic {
  Aes: AesModule;
}

interface ReactNative {
  NativeModules: NativeModulesEx;
}

const reactNative: ReactNative = jest.requireActual("react-native");

reactNative.NativeModules.Aes = {
  pbkdf2: async (
    password: string,
    salt: string,
    cost: number,
    length: number
  ) => {
    const keyBuffer: Buffer = await new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, cost, length, "sha1", (err, buf) => {
        if (err) reject(err);
        else resolve(buf);
      });
    });
    return keyBuffer.toString("hex");
  },
  encrypt: async (text: string, key: string, iv: string) => {
    const keyBuffer = Buffer.from(key, "hex");
    const ivBuffer = Buffer.from(iv, "hex");
    const cipher = crypto.createCipheriv("aes-128-cbc", keyBuffer, ivBuffer);
    const encrypted = cipher.update(text, "utf-8", "hex") + cipher.final("hex");
    return encrypted;
  },
  decrypt: async (ciphertext: string, key: string, iv: string) => {
    const keyBuffer = Buffer.from(key, "hex");
    const ivBuffer = Buffer.from(iv, "hex");
    const cipher = crypto.createDecipheriv("aes-128-cbc", keyBuffer, ivBuffer);
    const encrypted =
      cipher.update(ciphertext, "hex", "utf-8") + cipher.final("utf-8");
    return encrypted;
  },
  hmac256: async (ciphertext: string, key: string) => {
    const hmac = crypto.createHmac("sha256", key);
    hmac.update(ciphertext);
    return hmac.digest("hex");
  },
  randomKey: async (length: number) => {
    const buffer: Buffer = await new Promise((resolve, reject) => {
      crypto.randomBytes(length, (err, buf) => {
        if (err) reject(err);
        else resolve(buf);
      });
    });
    return buffer.toString("hex");
  },
  sha1: async (text: string) => {
    const hasher = crypto.createHash("sha1");
    hasher.update(text);
    return hasher.digest("hex");
  },
  sha256: async (text: string) => {
    const hasher = crypto.createHash("sha256");
    hasher.update(text);
    return hasher.digest("hex");
  },
  sha512: async (text: string) => {
    const hasher = crypto.createHash("sha512");
    hasher.update(text);
    return hasher.digest("hex");
  },
};

module.exports = reactNative;
