interface CompletionsType {
  approved: boolean;
  description: string;
}
const getUnapprovedCompletionDescriptions = (
  completions: CompletionsType[]
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
