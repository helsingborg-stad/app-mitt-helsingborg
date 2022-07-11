export interface Navigation {
  reset: (parameters: { index: number; routes: { name: string }[] }) => void;
}

export interface Props {
  navigation: Navigation;
}
