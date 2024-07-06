import { addDays, formatDistanceToNow, isBefore } from "date-fns";

export default function emailTimeAgo(date: Date): string {
  const now = new Date();
  if (isBefore(addDays(now, -1), date)) {
    return formatDistanceToNow(date, { addSuffix: true, includeSeconds: true });
  }
  if (isBefore(addDays(now, -7), date)) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return formatDistanceToNow(date, { addSuffix: true, includeSeconds: true });
}
