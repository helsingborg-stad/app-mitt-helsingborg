import { RequestedCompletions } from "../types/Case";

const getUnapprovedCompletionDescriptions = (
  completions: RequestedCompletions[]
): string[] => {
  return completions
    .filter(({ approved = false }) => !approved)
    .map(({ description }) => description);

  return completionDescriptions;
};

export default getUnapprovedCompletionDescriptions;
