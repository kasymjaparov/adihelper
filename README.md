# @kasymjaparov/adihelper

Набор утилит на TypeScript: работа со строками, файлами и датами.

## 📦 Установка

```bash
npm install @kasymjaparov/adihelper
```

## 📚 Использование

```ts
import { StringHelper, FileHelper, DateHelper } from "@kasymjaparov/adihelper";

StringHelper.capitalize("hello");     // "Hello"
FileHelper.getExtension("file.txt");  // ".txt"
DateHelper.formatDate(new Date());    // "2025-07-02"
```

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