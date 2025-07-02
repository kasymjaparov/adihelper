import { describe, expect, it } from 'vitest';
import { StringHelper } from '../string';

describe('StringHelper', () => {
  it('should get last symbol', () => {
    expect(StringHelper.getLastSymbol('abc')).toBe('c');
  });

  it('should capitalize string', () => {
    expect(StringHelper.capitalize('test')).toBe('Test');
  });

  it('should reverse string', () => {
    expect(StringHelper.reverse('abc')).toBe('cba');
  });
});