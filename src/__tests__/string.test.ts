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
  it('should convert obj to string', () => {
    expect(StringHelper.getQueryString({query:"423", page:1})).toBe("query=423&page=1");
  });
  it('should convert obj with null or undefined to string', () => {
    expect(StringHelper.getQueryString({query:null, page:undefined, obj:{a:1}})).toBe("query=null&page=undefined&obj={a:1}");
  });
});