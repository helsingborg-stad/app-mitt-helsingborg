import { RequestedCompletions } from "../types/Case";

const getUnapprovedCompletionDescriptions = (
  completions: RequestedCompletions[]
): string[] => {
  const unapprovedCompletions = completions.filter(
    ({ approved = false }) => !approved
  );

  const completionDescriptions = unapprovedCompletions.map(
    ({ description }) => description
  );

  return completionDescriptions;
};

export default getUnapprovedCompletionDescriptions;
