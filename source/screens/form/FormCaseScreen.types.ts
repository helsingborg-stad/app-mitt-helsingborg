interface ResetParameters {
  index: number;
  routes: { name: string }[];
}

interface Navigation {
  reset: (parameters: ResetParameters) => void;
}

export interface Props {
  route: { params: { caseId: string; isSignMode: boolean } };
  navigation: Navigation;
}
