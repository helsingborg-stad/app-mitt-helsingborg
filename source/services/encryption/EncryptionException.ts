import type {
  EncryptionExceptionInterface,
  EncryptionExceptionStatus,
} from "../../types/Encryption";

export default class EncryptionException
  extends Error
  implements EncryptionExceptionInterface
{
  status: EncryptionExceptionStatus = null;

  constructor(status: EncryptionExceptionStatus, message: string) {
    super(message);

    // See https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, EncryptionException.prototype);

    this.name = "EncryptionException";
    this.status = status;
  }
}
