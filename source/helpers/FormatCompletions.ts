interface CompletionsType {
  approved: boolean;
  description: string;
}
const getUnapprovedCompletionDescriptions = (
  completions: CompletionsType[]
): string[] => {
  const completionDescriptions = completions.reduce(
    (previous: string[], current: CompletionsType) => {
      const unapprovedCompletion = !current?.approved;

      if (unapprovedCompletion) {
        return [...previous, current.description];
      }
      return previous;
    },
    []
  );

  return completionDescriptions;
};

export default getUnapprovedCompletionDescriptions;
