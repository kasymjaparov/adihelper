import * as fs from 'fs';
import * as path from 'path';

export class FileHelper {
  static getExtension(fileName: string): string {
    return path.extname(fileName);
  }

  static exists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }
}