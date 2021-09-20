import { ApplicationStatusType } from '../types/Case';
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

export function isAnyCaseActionPossible(
  isCoApplicant: boolean,
  statusType: ApplicationStatusType,
  selfHasSigned: boolean,
  encryptionStatus: SymmetricSetupStatus
) {
  if (isCoApplicant) {
    const isWaitingForSign = statusType.includes('active:signature:pending');
    const canSign = isWaitingForSign && encryptionStatus === 'ready';
    const shouldSign = canSign && !selfHasSigned;
    return shouldSign;
  }

  const isOngoing = statusType.includes('ongoing');
  const isNotStarted = statusType.includes('notStarted');
  const isCompletionRequired = statusType.includes('completionRequired');
  const isSigned = statusType.includes('signed');
  const canDoSomething = isOngoing || isNotStarted || isCompletionRequired || isSigned;
  return canDoSomething;
}

export function getUserFriendlyCaseActionText(
  statusType: ApplicationStatusType,
  selfHasSigned: boolean
) {
  const isNotStarted = statusType.includes('notStarted');
  const isOngoing = statusType.includes('ongoing');
  const isCompletionRequired = statusType.includes('completionRequired');
  const isSigned = statusType.includes('signed');
  const isWaitingForSign = statusType.includes('active:signature:pending');

  if (isWaitingForSign && !selfHasSigned) {
    return 'Granska och signera';
  }

  if (isOngoing) {
    return 'Fortsätt';
  }

  if (isNotStarted) {
    return 'Starta ansökan';
  }

  if (isCompletionRequired) {
    return 'Starta stickprov';
  }

  if (isSigned) {
    return 'Ladda upp filer och dokument';
  }

  return null;
}
