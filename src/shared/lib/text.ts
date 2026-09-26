/** Title-case each word, leaving the rest of the characters as typed. */
export function capitalize(value: string | undefined | null): string {
  if (!value) return '';
  return value
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Strip the protocol (and leading www.) for display. */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/i, '');
}

/** Add https:// when the user typed a bare domain. */
export function toAbsoluteUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}
