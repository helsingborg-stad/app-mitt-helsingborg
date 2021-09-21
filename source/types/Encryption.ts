export type EncryptionType = "decrypted" | "privateAesKey" | "symmetricKey";

export interface EncryptionDetails {
  type: EncryptionType;
  symmetricKeyName?: string;
  primes?: {
    P: number;
    G: number;
  };
  publicKeys?: Record<string, number>;
}
