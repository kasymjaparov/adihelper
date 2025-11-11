# @kasymjaparov/adihelper

Набор утилит на TypeScript для работы со строками, файлами и датами.

## 📦 Установка

```bash
npm install @kasymjaparov/adihelper
```

## 📚 Использование

```ts
import { StringHelper, FileHelper, DateHelper } from "@kasymjaparov/adihelper";

// Работа со строками
StringHelper.capitalize("hello");     // "Hello"
StringHelper.getLastSymbol("test");   // "t"

// Работа с файлами
FileHelper.getExtension("file.txt");  // ".txt"
FileHelper.exists("./path/to/file");  // true/false

// Работа с датами
DateHelper.formatDate("2025-02-23T12:00:00");        // "23.02.2025"
DateHelper.formatDateToText("03.04.2025");           // "3 апреля 2025"
```

## 🔧 API

### StringHelper

| Метод                                          | Описание                           | Пример                                  |
|------------------------------------------------|------------------------------------|-----------------------------------------|
| `getLastSymbol(str: string)`                   | Возвращает последний символ строки | `getLastSymbol("hello")` → `"o"`        |
| `capitalize(str: string)`                      | Делает первую букву заглавной      | `capitalize("hello")` → `"Hello"`       |
| `capitalize(str: string)`                      | Делает первую букву заглавной      | `capitalize("hello")` → `"Hello"`       |
| `getQueryString(obj: Record<string, unknown>)` | Получаем querystring               | `getQueryString({page:1})` → `"page=1"` |

### FileHelper

| Метод | Описание | Пример |
|-------|----------|--------|
| `getExtension(fileName: string)` | Возвращает расширение файла | `getExtension("file.txt")` → `".txt"` |
| `exists(filePath: string)` | Проверяет существование файла (Node.js) | `exists("./file.txt")` → `true/false` |
| `fileToBase64(filePath: string)` | Преобразует файл в base64 строку | `fileToBase64("./image.png")` → `"iVBORw0KGgo..."` |
| `base64ToFile(base64String, filePath)` | Сохраняет base64 строку как файл | `base64ToFile(base64, "./output.png")` |
| `bufferToBase64(buffer: Buffer)` | Преобразует Buffer в base64 | `bufferToBase64(buffer)` → `"SGVsbG8="` |
| `base64ToBuffer(base64String: string)` | Преобразует base64 в Buffer | `base64ToBuffer("SGVsbG8=")` → `Buffer` |
| `base64ToBlob(base64String, mimeType?)` | Преобразует base64 в Blob (браузер) | `base64ToBlob(base64, "image/png")` → `Blob` |
| `blobToBase64(blob: Blob)` | Преобразует Blob в base64 (браузер) | `await blobToBase64(blob)` → `"SGVsbG8="` |
| `fileObjectToBase64(file: File)` | Преобразует File в base64 (браузер) | `await fileObjectToBase64(file)` → `"SGVsbG8="` |
| `base64ToDataURL(base64String, mimeType)` | Создает data URL из base64 | `base64ToDataURL(base64, "image/png")` → `"data:image/png;base64,..."` |
| `dataURLToBase64(dataURL: string)` | Извлекает base64 из data URL | `dataURLToBase64(dataURL)` → `{base64, mimeType}` |
| `getFileSize(filePath: string)` | Получает размер файла в байтах (Node.js) | `getFileSize("./file.txt")` → `1024` |
| `getMimeType(fileName: string)` | Получает MIME тип по расширению | `getMimeType("image.png")` → `"image/png"` |
| `formatFileSize(bytes: number, decimals?)` | Форматирует размер в читаемый вид | `formatFileSize(1024)` → `"1 KB"` |

### DateHelper

| Метод | Описание | Пример |
|-------|----------|--------|
| `formatDate(dateInput, withTime?)` | Форматирует дату в DD.MM.YYYY | `formatDate("2025-02-23")` → `"23.02.2025"` |
| `formatDayToDate(day)` | Преобразует день в дату текущего месяца | `formatDayToDate(15)` → `"15.03.2025"` |
| `extractDayFromDate(dateStr)` | Извлекает день из даты | `extractDayFromDate("15.03.2025")` → `15` |
| `formatDateToISO(dateStr)` | Преобразует в формат yyyy-MM-dd | `formatDateToISO("15.03.2025")` → `"2025-03-15"` |
| `formatDateToText(dateInput)` | Форматирует в текстовый вид | `formatDateToText("03.04.2025")` → `"3 апреля 2025"` |
| `getDateForHistoryList(timestamp)` | Форматирует для списка истории | `getDateForHistoryList(iso)` → `"Сегодня, 2 июля"` |

## 💡 Примеры использования

### Работа с файлами и base64

```typescript
import { FileHelper } from "@kasymjaparov/adihelper";

// Node.js - конвертация файла в base64
const base64String = FileHelper.fileToBase64('./image.png');
console.log('Base64:', base64String);

// Сохранение base64 обратно в файл
FileHelper.base64ToFile(base64String, './copy.png');

// Получение информации о файле
const size = FileHelper.getFileSize('./image.png');
const mimeType = FileHelper.getMimeType('image.png');
const formattedSize = FileHelper.formatFileSize(size);

console.log(`Файл: image.png`);
console.log(`Размер: ${formattedSize}`);
console.log(`MIME тип: ${mimeType}`);
```

### Работа с файлами в браузере

```typescript
// HTML: <input type="file" id="fileInput">
const fileInput = document.getElementById('fileInput') as HTMLInputElement;

fileInput.addEventListener('change', async (event) => {
    const file = fileInput.files?.[0];
    if (!file) return;

    // Конвертация File в base64
    const base64 = await FileHelper.fileObjectToBase64(file);
    
    // Создание data URL для отображения
    const mimeType = FileHelper.getMimeType(file.name);
    const dataURL = FileHelper.base64ToDataURL(base64, mimeType);
    
    // Отображение изображения
    const img = document.createElement('img');
    img.src = dataURL;
    document.body.appendChild(img);
    
    // Информация о файле
    const formattedSize = FileHelper.formatFileSize(file.size);
    console.log(`Загружен файл: ${file.name}`);
    console.log(`Размер: ${formattedSize}`);
    console.log(`MIME тип: ${mimeType}`);
});
```

### Работа с Buffer и Blob

```typescript
// Создание Buffer и конвертация в base64
const buffer = Buffer.from('Привет, мир!', 'utf8');
const base64 = FileHelper.bufferToBase64(buffer);

// Обратная конвертация из base64 в Buffer
const restoredBuffer = FileHelper.base64ToBuffer(base64);
const text = restoredBuffer.toString('utf8');
console.log(text); // "Привет, мир!"

// Работа с Blob в браузере
const blob = FileHelper.base64ToBlob(base64, 'text/plain');
const base64FromBlob = await FileHelper.blobToBase64(blob);
```

## 📜 Лицензия

MIT