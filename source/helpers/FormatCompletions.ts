interface CompletionsType {
  approved: boolean;
  description: string;
}
const getUnapprovedCompletionDescriptions = (
  completions: CompletionsType[]
): string[] => {
  const unApprovedCompletions = completions.filter(
    ({ approved = false }) => !approved
  );

  const completionDescriptions = unApprovedCompletions.map(
    ({ description }) => description
  );

  return completionDescriptions;
};

export default getUnapprovedCompletionDescriptions;
