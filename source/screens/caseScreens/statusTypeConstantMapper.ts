import { ApplicationStatusType } from "../../types/Case";

const {
  CLOSED_PARTIALLY_APPROVED_VIVA,
  CLOSED_REJECTED_VIVA,
  ACTIVE_SUBMITTED_RANDOM_CHECK_VIVA,
  ACTIVE_RANDOM_CHECK_REQUIRED_VIVA,
  ACTIVE_COMPLETION_REQUIRED_VIVA,
  ACTIVE_SUBMITTED_COMPLETION,
  ACTIVE_SIGNATURE_PENDING,
  NOT_STARTED,
  ACTIVE_ONGOING,
  CLOSED,
} = ApplicationStatusType;

export default function statusTypeConstantMapper(
  statusType: string
): Record<string, boolean> {
  const isNotStarted = statusType.includes(NOT_STARTED);
  const isOngoing = statusType.includes(ACTIVE_ONGOING);
  const isClosed = statusType.includes(CLOSED);
  const isRandomCheckRequired = statusType.includes(
    ACTIVE_RANDOM_CHECK_REQUIRED_VIVA
  );
  const isVivaCompletionRequired = statusType.includes(
    ACTIVE_COMPLETION_REQUIRED_VIVA
  );
  const isWaitingForSign = statusType.includes(ACTIVE_SIGNATURE_PENDING);

  const shouldShowAppealButton =
    statusType.includes(CLOSED_PARTIALLY_APPROVED_VIVA) ||
    statusType.includes(CLOSED_REJECTED_VIVA);

  const isActiveSubmittedRandomCheck = statusType.includes(
    ACTIVE_SUBMITTED_RANDOM_CHECK_VIVA
  );

  const activeSubmittedCompletion = statusType.includes(
    ACTIVE_SUBMITTED_COMPLETION
  );

  return {
    isNotStarted,
    isOngoing,
    isClosed,
    isRandomCheckRequired,
    isVivaCompletionRequired,
    isWaitingForSign,
    shouldShowAppealButton,
    isActiveSubmittedRandomCheck,
    activeSubmittedCompletion,
  };
}
