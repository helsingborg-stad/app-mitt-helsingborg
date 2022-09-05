import type { PrimaryColor } from "../../theme/themeHelpers";

interface Route {
  params: {
    id: string;
    name: string;
  };
}

interface ResetParams {
  index: number;
  routes: { name: string }[];
}

interface Navigation {
  navigate: (route: string, params: Record<string, string | boolean>) => void;
  reset: (params: ResetParams) => void;
}

export interface Props {
  colorSchema: PrimaryColor;
  route: Route;
  navigation: Navigation;
}
