const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const CACHE_TIMES = {
  /** Always refetch */
  NONE: { staleTime: 0, gcTime: 5 * MINUTE },
  /** Fresh for 5 mins */
  SHORT: { staleTime: 5 * MINUTE, gcTime: 30 * MINUTE },
  /** Fresh for 1 hour */
  MEDIUM: { staleTime: 1 * HOUR, gcTime: 5 * HOUR },
  /** Fresh for 24 hours */
  LONG: { staleTime: 24 * HOUR, gcTime: 7 * DAY },
  /** Fresh for a week */
  WEEK: { staleTime: 7 * DAY, gcTime: 7 * DAY },
  /** Cache forever (manual invalidation) */
  INFINITE: { staleTime: Infinity, gcTime: Infinity },
} as const;
