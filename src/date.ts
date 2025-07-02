import { format, parseISO, differenceInDays } from 'date-fns';

export class DateHelper {
  static formatDate(date: Date | string, formatStr = 'yyyy-MM-dd'): string {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, formatStr);
  }

  static daysBetween(date1: string | Date, date2: string | Date): number {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    return Math.abs(differenceInDays(d1, d2));
  }
}