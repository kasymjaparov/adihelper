import { describe, expect, it } from 'vitest';
import { FileHelper } from '../file';
import * as fs from 'fs';

describe('FileHelper', () => {
  it('should get extension', () => {
    expect(FileHelper.getExtension('file.txt')).toBe('.txt');
  });

  it('should check if file exists', () => {
    fs.writeFileSync('temp.txt', 'hello');
    expect(FileHelper.exists('temp.txt')).toBe(true);
    fs.unlinkSync('temp.txt');
  });
});