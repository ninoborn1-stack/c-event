'use client';

import { useEffect, useState } from 'react';
import type { DayAvailability } from '@c-event/core';
import { api } from '@/lib/api';

/** Lädt Belegt/Frei über die API-Schicht (Server-Endpunkt bzw. Browser-Demo). */
export function useAvailability(from: string, to: string) {
  const [days, setDays] = useState<DayAvailability[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let alive = true;
    api
      .availability(from, to)
      .then((d) => {
        if (!alive) return;
        setDays(d);
        setError(false);
      })
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [from, to]);
  return { days, error };
}
