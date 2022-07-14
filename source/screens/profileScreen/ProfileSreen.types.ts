export interface Navigation {
  navigate: (screen: string) => void;
}

export interface Props {
  navigation: Navigation;
}
