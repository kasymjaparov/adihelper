import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import * as fs from 'fs';
import {FileHelper} from '../file';

// Мокаем fs модуль
vi.mock('fs');
const mockedFs = vi.mocked(fs);

// Мокаем глобальные объекты браузера для тестов
Object.defineProperty(global, 'atob', {
    value: (str: string) => Buffer.from(str, 'base64').toString('binary'),
    writable: true
});

Object.defineProperty(global, 'Blob', {
    value: class MockBlob {
        public size: number;
        public type: string;
        private content: any;

        constructor(content: any, options: any = {}) {
            this.content = content;
            this.type = options.type || '';
            this.size = content.length || 0;
        }
    },
    writable: true
});

Object.defineProperty(global, 'FileReader', {
    value: class MockFileReader {
        public result: string | null = null;
        public onload: ((event: any) => void) | null = null;
        public onerror: ((event: any) => void) | null = null;

        readAsDataURL(blob: any) {
            setTimeout(() => {
                this.result = 'data:application/octet-stream;base64,dGVzdA==';
                if (this.onload) {
                    this.onload({target: this});
                }
            }, 0);
        }
    },
    writable: true
});

describe('FileHelper', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getExtension', () => {
        it('should return correct file extension', () => {
            expect(FileHelper.getExtension('test.txt')).toBe('.txt');
            expect(FileHelper.getExtension('image.png')).toBe('.png');
            expect(FileHelper.getExtension('document.pdf')).toBe('.pdf');
            expect(FileHelper.getExtension('file')).toBe('');
        });
    });

    describe('exists', () => {
        it('should return true if file exists', () => {
            mockedFs.existsSync.mockReturnValue(true);
            expect(FileHelper.exists('/path/to/file.txt')).toBe(true);
            expect(mockedFs.existsSync).toHaveBeenCalledWith('/path/to/file.txt');
        });

        it('should return false if file does not exist', () => {
            mockedFs.existsSync.mockReturnValue(false);
            expect(FileHelper.exists('/path/to/nonexistent.txt')).toBe(false);
        });
    });

    describe('fileToBase64', () => {
        it('should convert file to base64', () => {
            const mockBuffer = Buffer.from('test content');
            mockedFs.readFileSync.mockReturnValue(mockBuffer);

            const result = FileHelper.fileToBase64('/path/to/file.txt');

            expect(result).toBe(mockBuffer.toString('base64'));
            expect(mockedFs.readFileSync).toHaveBeenCalledWith('/path/to/file.txt');
        });

        it('should throw error if file reading fails', () => {
            mockedFs.readFileSync.mockImplementation(() => {
                throw new Error('File not found');
            });

            expect(() => FileHelper.fileToBase64('/path/to/file.txt'))
                .toThrow('Failed to convert file to base64: File not found');
        });
    });

    describe('base64ToFile', () => {
        it('should save base64 string to file', () => {
            const base64String = 'dGVzdCBjb250ZW50'; // "test content" in base64
            const filePath = '/path/to/output.txt';

            FileHelper.base64ToFile(base64String, filePath);

            expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
                filePath,
                Buffer.from(base64String, 'base64')
            );
        });

        it('should throw error if file writing fails', () => {
            mockedFs.writeFileSync.mockImplementation(() => {
                throw new Error('Permission denied');
            });

            expect(() => FileHelper.base64ToFile('dGVzdA==', '/path/to/file.txt'))
                .toThrow('Failed to save base64 to file: Permission denied');
        });
    });

    describe('bufferToBase64', () => {
        it('should convert buffer to base64', () => {
            const buffer = Buffer.from('test content');
            const result = FileHelper.bufferToBase64(buffer);

            expect(result).toBe(buffer.toString('base64'));
        });
    });

    describe('base64ToBuffer', () => {
        it('should convert base64 to buffer', () => {
            const base64String = 'dGVzdCBjb250ZW50'; // "test content" in base64
            const result = FileHelper.base64ToBuffer(base64String);

            expect(result).toEqual(Buffer.from(base64String, 'base64'));
            expect(result.toString()).toBe('test content');
        });
    });

    describe('base64ToBlob', () => {
        it('should convert base64 to blob with default mime type', () => {
            const base64String = 'dGVzdA=='; // "test" in base64
            const result = FileHelper.base64ToBlob(base64String);

            expect(result).toBeInstanceOf(global.Blob);
            expect(result.type).toBe('application/octet-stream');
        });

        it('should convert base64 to blob with custom mime type', () => {
            const base64String = 'dGVzdA==';
            const mimeType = 'text/plain';
            const result = FileHelper.base64ToBlob(base64String, mimeType);

            expect(result.type).toBe(mimeType);
        });

        it('should handle base64 with data URL prefix', () => {
            const dataUrl = 'data:text/plain;base64,dGVzdA==';
            const result = FileHelper.base64ToBlob(dataUrl, 'text/plain');

            expect(result).toBeInstanceOf(global.Blob);
        });

        it('should throw error for invalid base64', () => {
            // Мокаем atob чтобы выбросить ошибку
            const originalAtob = global.atob;
            global.atob = vi.fn().mockImplementation(() => {
                throw new Error('Invalid base64');
            });

            expect(() => FileHelper.base64ToBlob('invalid-base64'))
                .toThrow('Failed to convert base64 to blob: Invalid base64');

            global.atob = originalAtob;
        });
    });

    describe('blobToBase64', async () => {
        it('should convert blob to base64', async () => {
            const mockBlob = new global.Blob(['test']);
            const result = await FileHelper.blobToBase64(mockBlob);

            expect(result).toBe('dGVzdA=='); // "test" in base64
        });
    });

    describe('base64ToDataURL', () => {
        it('should create data URL from base64', () => {
            const base64 = 'dGVzdA==';
            const mimeType = 'text/plain';
            const result = FileHelper.base64ToDataURL(base64, mimeType);

            expect(result).toBe('data:text/plain;base64,dGVzdA==');
        });
    });

    describe('dataURLToBase64', () => {
        it('should extract base64 and mime type from data URL', () => {
            const dataUrl = 'data:text/plain;base64,dGVzdA==';
            const result = FileHelper.dataURLToBase64(dataUrl);

            expect(result).toEqual({
                mimeType: 'text/plain',
                base64: 'dGVzdA=='
            });
        });

        it('should throw error for invalid data URL format', () => {
            expect(() => FileHelper.dataURLToBase64('invalid-data-url'))
                .toThrow('Invalid data URL format');
        });
    });

    describe('getFileSize', () => {
        it('should return file size in bytes', () => {
            const mockStats = {size: 1024};
            mockedFs.statSync.mockReturnValue(mockStats as any);

            const result = FileHelper.getFileSize('/path/to/file.txt');

            expect(result).toBe(1024);
            expect(mockedFs.statSync).toHaveBeenCalledWith('/path/to/file.txt');
        });

        it('should throw error if stat fails', () => {
            mockedFs.statSync.mockImplementation(() => {
                throw new Error('File not found');
            });

            expect(() => FileHelper.getFileSize('/path/to/file.txt'))
                .toThrow('Failed to get file size: File not found');
        });
    });

    describe('getMimeType', () => {
        it('should return correct mime types for common extensions', () => {
            expect(FileHelper.getMimeType('image.jpg')).toBe('image/jpeg');
            expect(FileHelper.getMimeType('image.jpeg')).toBe('image/jpeg');
            expect(FileHelper.getMimeType('image.png')).toBe('image/png');
            expect(FileHelper.getMimeType('document.pdf')).toBe('application/pdf');
            expect(FileHelper.getMimeType('text.txt')).toBe('text/plain');
            expect(FileHelper.getMimeType('data.json')).toBe('application/json');
        });

        it('should return default mime type for unknown extensions', () => {
            expect(FileHelper.getMimeType('file.unknown')).toBe('application/octet-stream');
            expect(FileHelper.getMimeType('file')).toBe('application/octet-stream');
        });

        it('should handle uppercase extensions', () => {
            expect(FileHelper.getMimeType('IMAGE.PNG')).toBe('image/png');
            expect(FileHelper.getMimeType('DOCUMENT.PDF')).toBe('application/pdf');
        });
    });

    describe('formatFileSize', () => {
        it('should format bytes correctly', () => {
            expect(FileHelper.formatFileSize(0)).toBe('0 Bytes');
            expect(FileHelper.formatFileSize(1024)).toBe('1 KB');
            expect(FileHelper.formatFileSize(1048576)).toBe('1 MB');
            expect(FileHelper.formatFileSize(1073741824)).toBe('1 GB');
            expect(FileHelper.formatFileSize(1099511627776)).toBe('1 TB');
        });

        it('should format with custom decimal places', () => {
            expect(FileHelper.formatFileSize(1536, 1)).toBe('1.5 KB');
            expect(FileHelper.formatFileSize(1536, 3)).toBe('1.5 KB');
            expect(FileHelper.formatFileSize(1536, 0)).toBe('2 KB');
        });

        it('should handle fractional values', () => {
            expect(FileHelper.formatFileSize(1536)).toBe('1.5 KB');
            expect(FileHelper.formatFileSize(2621440)).toBe('2.5 MB');
        });
    });
});