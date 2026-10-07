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

const WEBSITE_PATTERN =
  /^(https?:\/\/)?(?!-)[a-zA-Z0-9-]{1,63}(?<!-)(\.(?!-)[a-zA-Z0-9-]{1,63}(?<!-))*\.[a-zA-Z]{2,}(:\d{1,5})?([/?#]\S*)?$/;

export const WEBSITE_ERROR = 'Enter a valid website (e.g. example.com).';

/** Shared rule for every Website field: an optional scheme, a dotted domain and a real TLD. */
export function isValidWebsite(value: string | undefined | null): boolean {
  return WEBSITE_PATTERN.test((value ?? '').trim());
}
