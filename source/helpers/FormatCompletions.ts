import { RequestedCompletions } from "../types/Case";

const getUnapprovedCompletionDescriptions = (
  completions: RequestedCompletions[]
): string[] => {
  const unapprovedCompletionDescriptions = completions
    .filter(({ approved = false }) => !approved)
    .map(({ description }) => description);

  return unapprovedCompletionDescriptions;
};

export default getUnapprovedCompletionDescriptions;
