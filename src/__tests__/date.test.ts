import { describe, expect, it } from 'vitest';
import { DateHelper } from '../date';

describe('DateHelper', () => {
  it('should format date', () => {
    expect(DateHelper.formatDate('2025-01-01')).toBe('2025-01-01');
  });

  it('should calculate days between', () => {
    expect(DateHelper.daysBetween('2025-01-01', '2025-01-11')).toBe(10);
  });
});