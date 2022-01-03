type CompletionsType = {
  approved: boolean;
  description: string;
};

const getUnApprovedCompletionsDescriptions = (
  completions: CompletionsType[]
): string[] => {
  const completionsList = completions.reduce(
    (previous: string[], current: CompletionsType) => {
      if (!current?.approved) {
        return [...previous, current.description];
      }
      return [...previous];
    },
    []
  );

  return completionsList;
};

export default getUnApprovedCompletionsDescriptions;
