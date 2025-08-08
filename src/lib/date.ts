// Shared date utilities to handle local date-only strings safely
// Prevents timezone shifts when parsing YYYY-MM-DD by constructing dates in local time

export const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const DATE_ONLY_ISO_MIDNIGHT_REGEX = /^\d{4}-\d{2}-\d{2}T00:00(?::00(?:\.\d{1,3})?)?(?:Z|[+-]00:00)?$/i;

export function isDateOnly(value: unknown): value is string {
  return typeof value === 'string' && DATE_ONLY_REGEX.test(value);
}

export function parseDateSafe(value: string | Date | undefined | null): Date {
  if (!value) return new Date(NaN);
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    if (isDateOnly(value)) {
      const [y, m, d] = value.split('-').map(Number);
      // Construct using local time to avoid UTC shift
      return new Date(y, (m ?? 1) - 1, d ?? 1);
    }
    // Treat ISO midnight UTC strings as date-only to avoid timezone shift
    if (DATE_ONLY_ISO_MIDNIGHT_REGEX.test(value)) {
      const [y, m, d] = (value as string).slice(0, 10).split('-').map(Number);
      return new Date(y, (m ?? 1) - 1, d ?? 1);
    }
  }
  return new Date(value as any);
}


export function formatLocalDateForStorage(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
