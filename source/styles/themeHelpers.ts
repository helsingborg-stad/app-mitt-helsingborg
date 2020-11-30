import theme from './theme';

export type MainColor = keyof typeof theme.colors.primary;
export type SecondaryColor = keyof typeof theme.colors.complementary;

function isMainColor(color: string): color is MainColor {
  return Object.keys(theme.colors.primary).includes(color);
}
function isSecondaryColor(color: string): color is MainColor {
  return Object.keys(theme.colors.primary).includes(color);
}
/**
 * Helper function that checks if the passed colorSchema exists on the theme, and if so returns it.
 * Otherwise defaults to the blue colorSchema.
 */
export const getValidColorSchema = (
  colorSchema: string,
  variant: 'primary' | 'complementary' = 'primary'
): MainColor | SecondaryColor => {
  if (variant === 'primary' && isMainColor(colorSchema)) return colorSchema;
  if (variant === 'complementary' && isSecondaryColor(colorSchema)) return colorSchema;
  return 'blue';
}

