import { NativeModules } from "react-native";

const { Aes } = NativeModules;

describe("Aes", () => {
  const testText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
    "Ut tellus diam, pellentesque sed rutrum eget, pretium ut dui. " +
    "Sed vitae diam metus. Cras in maximus ipsum, non scelerisque " +
    "dolor. Morbi viverra, dui nec auctor luctus, augue nulla " +
    "egestas ipsum, pulvinar faucibus sapien felis sed velit. " +
    "Praesent eros felis, mattis a suscipit ut, lobortis et " +
    "mauris. Cras sit amet augue ex. Curabitur rhoncus interdum " +
    "dolor, non pulvinar lectus vehicula porta. Duis pretium " +
    "venenatis turpis quis consectetur. Suspendisse potenti.";

  const testEncryptedText =
    "20746fe2518656d98c9093d12cbe3075" +
    "8a09d142e594d293cef6bcd060271296" +
    "848f87eb37b20640fa245ded8f528dbc" +
    "f8c053eadc6ac44935c9a44694bcbb95" +
    "d1b267f0c4fe6c2e34277ba0297a4dbf" +
    "1c632ea77823b6a9c6438237614494ad" +
    "9194b23b59aa542a8519622e81126878" +
    "1070b1ac4d0a4e59a4e8aba1d75eed57" +
    "5461a5bf3cb3ede0bc474627e0d4420d" +
    "e1737add114c0a4d7e5c98e6d50d269c" +
    "f6db6878a1021addf90231da3ea15516" +
    "6ecfbee166d5e036be4ad1a12219759f" +
    "1b985eee712a4440d856c828601e657b" +
    "c78b199ac265c6f5b3916bce6aeadaaa" +
    "8c3fbd3f0fe23fa5c62d4d0aa5c57ef9" +
    "8d68ac96818581241e0f9f99cb868160" +
    "23519f06be44cbd0bf977cf2b4b3b348" +
    "9fc6db39570fb83a140ea67f7d786022" +
    "ae2cce0d566a9db071ff625d12129b3b" +
    "71a6c766c426c4188d6b68733ac2341b" +
    "34ae45b22edf0e3106d5f18235808ba7" +
    "1776870dead368d905ad8f0bb848c4c9" +
    "6cb77c7a25c9eb2e843a998b438da575" +
    "bcf75c2ba2b611bdbb5e24a0a27e42d7" +
    "022e2255678be60fbf07da91b9513636" +
    "478e0b412bd6e88c2d4126e621697a5b" +
    "e2410a90851ef6a7c865d8c3923e4f3b" +
    "f26aa403f354f2ae9fa1ae17af0b7ca0" +
    "16c65fd0ecefa2a7b9226c092a9708a5" +
    "aa0e0c20bbccf591272ca90f5234de44" +
    "92e275b118d9735ae0e0a7fde5abddf3" +
    "204ff620d693bf2bbf2533eea2de466e" +
    "adef04a776305dd6efb6cd2f6ebd35c7";

  const testKey =
    "f952122ebd198f5971a36886d495b45085bc6bf05f9697d4f732aff055db23f5";
  const testIV = "003d8999f6a4bb9800ed24b5d1846523";
  const testPassword = "boll1234";
  const testPBKDF2Salt = "salt4D42bf960Sm1";
  const testPBKDF2Rounds = 5000;
  const testPBKDF2Length = 256;
  const testPBKDF2Digest =
    "a4451f49223eef2169a04c01951fea15c87dd11dca3aea763c81906e11c5464f";
  const testSHA1Digest = "8434f837d5dc6c649f56bf56fc239b47682433b2";
  const testSHA256Digest =
    "4de60032bc7e7171c6e69bd4a19f540c14f64284f9c67c5fd4d91651a696b577";
  const testSHA512Digest =
    "7865f93ceaac9e8b763815b216fbfefb4fef006746d1eac9997dcd74beb556283d5adec198926781398e84ab5400fa804f4d027d287500f36ca640b91b1ba189";
  const testHMACDigest =
    "98fdf315561cfad0f6c80373a5936c29dbee774fe52a2a87ad997db2237897eb";

  it("generates random key", async () => {
    const newKey = await Aes.randomKey(32);
    expect(typeof newKey).toBe("string");

    const buff = Buffer.from(newKey, "hex");
    expect(buff.byteLength).toBe(32);
  });

  it("produces a SHA1 hash", async () => {
    const hash = await Aes.sha1(testText);
    expect(hash).toBe(testSHA1Digest);
  });

  it("produces a SHA256 hash", async () => {
    const hash = await Aes.sha256(testText);
    expect(hash).toBe(testSHA256Digest);
  });

  it("produces a SHA512 hash", async () => {
    const hash = await Aes.sha512(testText);
    expect(hash).toBe(testSHA512Digest);
  });

  it("produces a HMAC256 digest", async () => {
    const digest = await Aes.hmac256(testText, testKey);
    expect(digest).toBe(testHMACDigest);
  });

  it("encrypts", async () => {
    const encrypted = await Aes.encrypt(testText, testKey, testIV);
    expect(encrypted).toBe(testEncryptedText);
  });

  it("decrypts", async () => {
    const decrypted = await Aes.decrypt(testEncryptedText, testKey, testIV);
    expect(decrypted).toBe(testText);
  });

  it("derives keys with pbkdf2", async () => {
    const derivedKey = await Aes.pbkdf2(
      testPassword,
      testPBKDF2Salt,
      testPBKDF2Rounds,
      testPBKDF2Length
    );
    const buff = Buffer.from(derivedKey, "hex");
    expect(derivedKey).toBe(testPBKDF2Digest);
    expect(buff.byteLength).toBe(testPBKDF2Length / 8);
  });
});
