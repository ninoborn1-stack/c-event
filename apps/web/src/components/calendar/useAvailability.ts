'use client';

import { useEffect, useState } from 'react';
import type { DayAvailability } from '@c-event/core';

/** Lädt Belegt/Frei über dieselbe API, die später auch eine App nutzt. */
export function useAvailability(from: string, to: string) {
  const [days, setDays] = useState<DayAvailability[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch(`/api/availability?from=${from}&to=${to}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { days: DayAvailability[] }) => {
        if (!alive) return;
        setDays(d.days);
        setError(false);
      })
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [from, to]);
  return { days, error };
}
