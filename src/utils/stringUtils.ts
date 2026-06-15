/**
 * Capitalizes the first letter of each word in a string.
 */
export const capitalize = (str: string | undefined): string => {
  if (!str) return '';
  return str
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
