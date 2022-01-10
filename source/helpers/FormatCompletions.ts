import { RequestedCompletions } from "../types/Case";

const getUnapprovedCompletionDescriptions = (
  completions: RequestedCompletions[]
): string[] => {
  const completionDescriptions = completions
    .filter(({ approved = false }) => !approved)
    .map(({ description }) => description);

  return completionDescriptions;
};

export default getUnapprovedCompletionDescriptions;
