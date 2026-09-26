/**
 * Endpoints on this API return their array under `data`, under a resource-named
 * key, or nested inside `data` — and which one varies per endpoint. Check every
 * place the array could be, in the order the old services checked them.
 */
export function unwrapList<T>(response: unknown, ...resourceKeys: string[]): T[] {
  if (Array.isArray(response)) return response as T[];
  if (!response || typeof response !== 'object') return [];

  const envelope = response as Record<string, unknown>;
  const nested = (envelope.data && typeof envelope.data === 'object' ? envelope.data : {}) as Record<string, unknown>;

  const candidates = [
    ...resourceKeys.map((key) => envelope[key]),
    ...resourceKeys.map((key) => nested[key]),
    envelope.data,
  ];

  return (candidates.find(Array.isArray) as T[] | undefined) ?? [];
}

/**
 * The single-entity counterpart to `unwrapList`: detail endpoints return the record
 * under `data` or under a singular resource key (`lead`, `account`, ...).
 */
export function unwrapItem<T>(response: unknown, ...resourceKeys: string[]): T | undefined {
  if (!response || typeof response !== 'object') return undefined;

  const envelope = response as Record<string, unknown>;
  const isEntity = (value: unknown): value is T =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

  for (const key of [...resourceKeys, 'data']) {
    if (isEntity(envelope[key])) return envelope[key] as T;
  }

  // Some endpoints return the record at the top level with no envelope.
  return 'id' in envelope ? (envelope as T) : undefined;
}
