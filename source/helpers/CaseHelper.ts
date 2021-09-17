import { SymmetricSetupStatus } from '../types/Encryption';

export function getUserFriendlyEncryptionStatusMessage(
  encryptionStatus: SymmetricSetupStatus,
  selfHasSigned: boolean,
  isWaitingForSign: boolean
): string | null {
  if (isWaitingForSign) {
    const statusesRequiringSync: SymmetricSetupStatus[] = [
      'missingCoApplicantPublicKey',
      'missingSymmetricKey',
      'missingAesKey',
    ];

    if (statusesRequiringSync.includes(encryptionStatus)) {
      return 'Din partner måste logga in för att synka.';
    }

    if (selfHasSigned) {
      return 'Din partner måste logga in och signera.';
    }
  }

  return null;
}
