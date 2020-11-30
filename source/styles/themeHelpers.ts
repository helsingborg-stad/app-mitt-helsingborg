import theme from './theme';

export type PrimaryColor = keyof typeof theme.colors.primary;
export type ComplementaryColor = keyof typeof theme.colors.complementary;

function isPrimaryColor(color: string): color is MainColor {
  return Object.keys(theme.colors.primary).includes(color);
}
function isComplementaryColor(color: string): color is MainColor {
  return Object.keys(theme.colors.primary).includes(color);
}
/**
 * Helper function that checks if the passed colorSchema exists on the theme, and if so returns it.
 * Otherwise defaults to the blue colorSchema.
 */
export const getValidColorSchema = (
  colorSchema: string,
  variant: 'primary' | 'complementary' = 'primary'
): PrimaryColor | ComplementaryColor => {
  if (variant === 'primary' && isMainColor(colorSchema)) return colorSchema;
  if (variant === 'complementary' && isSecondaryColor(colorSchema)) return colorSchema;
  return 'blue';
}

