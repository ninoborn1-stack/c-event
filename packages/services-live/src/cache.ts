/** Kleiner In-Memory-Cache mit Ablaufzeit, damit die Seite nicht bei jedem Aufruf die API trifft. */
export function ttlCache<T>(ttlMs: number, load: () => Promise<T>) {
  let value: { v: T; at: number } | null = null;
  let pending: Promise<T> | null = null;
  return async (): Promise<T> => {
    if (value && Date.now() - value.at < ttlMs) return value.v;
    pending ??= load()
      .then((v) => {
        value = { v, at: Date.now() };
        return v;
      })
      .finally(() => (pending = null));
    try {
      return await pending;
    } catch (e) {
      // API kurz weg: lieber den letzten Stand zeigen als nichts
      if (value) return value.v;
      throw e;
    }
  };
}
