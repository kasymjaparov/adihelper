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

| Метод | Описание | Пример |
|-------|----------|--------|
| `getLastSymbol(str: string)` | Возвращает последний символ строки | `getLastSymbol("hello")` → `"o"` |
| `capitalize(str: string)` | Делает первую букву заглавной | `capitalize("hello")` → `"Hello"` |
| `reverse(str: string)` | Переворачивает строку | `reverse("hello")` → `"olleh"` |

### FileHelper

| Метод | Описание | Пример |
|-------|----------|--------|
| `getExtension(fileName: string)` | Возвращает расширение файла | `getExtension("file.txt")` → `".txt"` |
| `exists(filePath: string)` | Проверяет существование файла | `exists("./file.txt")` → `true/false` |

### DateHelper

| Метод | Описание | Пример |
|-------|----------|--------|
| `formatDate(dateInput, withTime?)` | Форматирует дату в DD.MM.YYYY | `formatDate("2025-02-23")` → `"23.02.2025"` |
| `formatDayToDate(day)` | Преобразует день в дату текущего месяца | `formatDayToDate(15)` → `"15.03.2025"` |
| `extractDayFromDate(dateStr)` | Извлекает день из даты | `extractDayFromDate("15.03.2025")` → `15` |
| `formatDateToISO(dateStr)` | Преобразует в формат yyyy-MM-dd | `formatDateToISO("15.03.2025")` → `"2025-03-15"` |
| `formatDateToText(dateInput)` | Форматирует в текстовый вид | `formatDateToText("03.04.2025")` → `"3 апреля 2025"` |
| `getDateForHistoryList(timestamp)` | Форматирует для списка истории | `getDateForHistoryList(iso)` → `"Сегодня, 2 июля"` |

## 🧪 Тесты

```bash
npm run test
```

## 🛠️ Сборка

```bash
npm run build
```

## 📜 Лицензия

MIT