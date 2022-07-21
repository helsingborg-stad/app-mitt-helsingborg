import type { RequestedCompletions } from "../types/Case";

const getUnapprovedCompletionDescriptions = (
  completions: RequestedCompletions[]
): string[] => {
  const unapprovedCompletionDescriptions = completions
    .filter(({ received = false }) => !received)
    .map(({ description }) => description);

  return unapprovedCompletionDescriptions;
};

export default getUnapprovedCompletionDescriptions;
