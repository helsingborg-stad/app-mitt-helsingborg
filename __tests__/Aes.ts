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
    "9d67ec30d1598a7866209cd555652413" +
    "d24d174e4e8680e0168ab230c62dbb68" +
    "c3eef17957d73397f64e3545f456a602" +
    "68728e91331bbfafef68675074a12d83" +
    "0e6d35f8dca51fe1f0a9585d741061f8" +
    "2b0ed2b9b478f938f4497bb4029b5617" +
    "cabb1029fded4a6e052ff7757224fd56" +
    "42cb6eb795120481107c23213814e234" +
    "d777bc95c0b5ca32a9459bdd25ee532e" +
    "4705e06717fbaca36183ff8b2662a8d7" +
    "41ccbc2c62e361e1a6bf627c23b8c237" +
    "70c7bb4f31c17829de0b01ef03fa6111" +
    "0ce118bf5e17f34f76fcb3b6e286d731" +
    "c545bfa70410cdbcac853b7da4ee65f5" +
    "4bab8d551c874b618b70e6ea5aba33ef" +
    "230bce325a83c19e0ed8b3015e089cb8" +
    "37aaea72514b891e76f6e1702e6f712c" +
    "eb60a4c28be8617121cdace6dda86f0a" +
    "ab6f8fadec8675369f805d9afae22d3f" +
    "a693cea09aaa1fe6dafb028cbc97349d" +
    "02a7f3fee1df77970e965558a799f6d2" +
    "af4db6cc98bcd866ca57d11a8e31c173" +
    "d8ba63406057b812c804d59b463167de" +
    "80ec82672f2fcdf1c5c497b99b8a5180" +
    "ad5e4122d93cb1f6ab6383623bfdde2a" +
    "52f9b52938ae6bd4a0b60e5d3301e5e0" +
    "09f7ea46e9c123fe51d931d1f01c34ec" +
    "198a2f4ebf1a1fe833f6998650a092ed" +
    "8d70d8fb7287e5a1282ca93ac8cb374d" +
    "042c8d233999dd6a14f7aa25738ed37d" +
    "90c32aa33361bf681c0915a5c4818fba" +
    "f7775cac70f8432ba427851415bb69a6" +
    "ddd89afdf01484970985c2fc5d877556";

  const testKey = "3a2926938e179e7cfbc6d2162e16dbf1";
  const testIV = "003d8999f6a4bb9800ed24b5d1846523";
  const testPassword = "boll1234";
  const testPBKDF2Salt = "salt4D42bf960Sm1";
  const testPBKDF2Rounds = 5000;
  const testPBKDF2Length = 256;
  const testPBKDF2Digest =
    "a4451f49223eef2169a04c01951fea15" +
    "c87dd11dca3aea763c81906e11c5464f" +
    "12d120f4e7c90275f542ecfc23934226" +
    "5edd285c0dc91d1235bc4168cee29cb5" +
    "1a43db0b3f84f27fd6bd359fb361cd50" +
    "8de94c9a550f3c19fc8188bff92f2f8c" +
    "4f7cdb86619d54c2a41e788aeb8e9790" +
    "721f829cc7cdef03b3ccd6f6b391aca8" +
    "f31c11c17f2f51b5883cd9f8e5c69a91" +
    "ce902cc2616501c43398fbc05842d580" +
    "e9c30ab27b348954e8799f707b228cfb" +
    "4bf6b9cdbaffe6aca618381eb8c234ca" +
    "7fc46c3fbd6f7be4ae00576faede09d4" +
    "4c8b8844cf5345ca7c6ae6b7658a4291" +
    "f83419aede82b64d8a644faf6622546f" +
    "be24245a140d42896eee2b53d480fb30";

  it("generates random key", async () => {
    const newKey = await Aes.randomKey(16);
    expect(typeof newKey).toBe("string");

    const buff = Buffer.from(newKey, "hex");
    expect(buff.byteLength).toBe(16);
  });

  it("produces a SHA1 hash", async () => {
    const hash = await Aes.sha1(testText);
    expect(hash).toBe("8434f837d5dc6c649f56bf56fc239b47682433b2");
  });

  it("produces a SHA256 hash", async () => {
    const hash = await Aes.sha256(testText);
    expect(hash).toBe(
      "4de60032bc7e7171c6e69bd4a19f540c14f64284f9c67c5fd4d91651a696b577"
    );
  });

  it("produces a SHA512 hash", async () => {
    const hash = await Aes.sha512(testText);
    expect(hash).toBe(
      "7865f93ceaac9e8b763815b216fbfefb4fef006746d1eac9997dcd74beb556283d5adec198926781398e84ab5400fa804f4d027d287500f36ca640b91b1ba189"
    );
  });

  it("produces a HMAC256 digest", async () => {
    const digest = await Aes.hmac256(testText, testKey);
    expect(digest).toBe(
      "c90e9d1469a11d04525575c5973a68a34154ba60531bb1672ed83f1a13e7d050"
    );
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
    expect(buff.byteLength).toBe(testPBKDF2Length);
  });
});
