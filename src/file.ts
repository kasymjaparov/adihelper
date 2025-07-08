import * as fs from 'fs';
import * as path from 'path';

export class FileHelper {
    static getExtension(fileName: string): string {
        return path.extname(fileName);
    }

    static exists(filePath: string): boolean {
        return fs.existsSync(filePath);
    }

    /**
     * Преобразует файл в base64 строку
     * @param filePath - Путь к файлу
     * @returns Base64 строка
     */
    static fileToBase64(filePath: string): string {
        try {
            const fileBuffer = fs.readFileSync(filePath);
            return fileBuffer.toString('base64');
        } catch (error) {
            throw new Error(`Failed to convert file to base64: ${(error as Error).message}`);
        }
    }

    /**
     * Сохраняет base64 строку как файл
     * @param base64String - Base64 строка
     * @param filePath - Путь для сохранения файла
     */
    static base64ToFile(base64String: string, filePath: string): void {
        try {
            const buffer = Buffer.from(base64String, 'base64');
            fs.writeFileSync(filePath, buffer);
        } catch (error) {
            throw new Error(`Failed to save base64 to file: ${(error as Error).message}`);
        }
    }

    /**
     * Преобразует Buffer в base64 строку
     * @param buffer - Buffer для конвертации
     * @returns Base64 строка
     */
    static bufferToBase64(buffer: Buffer): string {
        return buffer.toString('base64');
    }

    /**
     * Преобразует base64 строку в Buffer
     * @param base64String - Base64 строка
     * @returns Buffer
     */
    static base64ToBuffer(base64String: string): Buffer {
        return Buffer.from(base64String, 'base64');
    }

    /**
     * Преобразует base64 строку в Blob (для браузера)
     * @param base64String - Base64 строка
     * @param mimeType - MIME тип файла (например, 'image/png')
     * @returns Blob объект
     */
    static base64ToBlob(base64String: string, mimeType: string = 'application/octet-stream'): Blob {
        // Удаляем data URL префикс если он есть
        const cleanBase64 = base64String.replace(/^data:[^;]+;base64,/, '');

        try {
            const binaryString = atob(cleanBase64);
            const bytes = new Uint8Array(binaryString.length);

            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            return new Blob([bytes], {type: mimeType});
        } catch (error) {
            throw new Error(`Failed to convert base64 to blob: ${(error as Error).message}`);
        }
    }

    /**
     * Преобразует Blob в base64 строку (для браузера)
     * @param blob - Blob объект
     * @returns Promise с base64 строкой
     */
    static async blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // Возвращаем только base64 часть без data URL префикса
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = () => reject(new Error('Failed to convert blob to base64'));
            reader.readAsDataURL(blob);
        });
    }

    /**
     * Преобразует File в base64 строку (для браузера)
     * @param file - File объект
     * @returns Promise с base64 строкой
     */
    static async fileObjectToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.onerror = () => reject(new Error('Failed to convert blob to base64'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * Создает data URL из base64 строки
     * @param base64String - Base64 строка
     * @param mimeType - MIME тип
     * @returns Data URL строка
     */
    static base64ToDataURL(base64String: string, mimeType: string): string {
        return `data:${mimeType};base64,${base64String}`;
    }

    /**
     * Извлекает base64 данные из data URL
     * @param dataURL - Data URL строка
     * @returns Объект с base64 данными и MIME типом
     */
    static dataURLToBase64(dataURL: string): { base64: string; mimeType: string } {
        const matches = dataURL.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches) {
            throw new Error('Invalid data URL format');
        }

        return {
            mimeType: matches[1],
            base64: matches[2]
        };
    }

    /**
     * Получает размер файла в байтах
     * @param filePath - Путь к файлу
     * @returns Размер файла в байтах
     */
    static getFileSize(filePath: string): number {
        try {
            const stats = fs.statSync(filePath);
            return stats.size;
        } catch (error) {
            throw new Error(`Failed to get file size: ${(error as Error).message}`);
        }
    }

    /**
     * Получает MIME тип по расширению файла
     * @param fileName - Имя файла или расширение
     * @returns MIME тип
     */
    static getMimeType(fileName: string): string {
        const ext = path.extname(fileName).toLowerCase();
        const mimeTypes: { [key: string]: string } = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
            '.txt': 'text/plain',
            '.json': 'application/json',
            '.xml': 'application/xml',
            '.csv': 'text/csv',
            '.mp4': 'video/mp4',
            '.mp3': 'audio/mpeg',
            '.wav': 'audio/wav',
            '.zip': 'application/zip',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };

        return mimeTypes[ext] || 'application/octet-stream';
    }

    /**
     * Форматирует размер файла в человекочитаемый вид
     * @param bytes - Размер в байтах
     * @param decimals - Количество знаков после запятой
     * @returns Отформатированная строка (например, "1.5 MB")
     */
    static formatFileSize(bytes: number, decimals: number = 2): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const value = bytes / Math.pow(k, i);

        const formatted = dm === 0 ? Math.round(value).toString() : parseFloat(value.toFixed(dm)).toString();

        return formatted + ' ' + sizes[i];
    }
}