/**
 * Хелпер для работы с датами
 */
export class DateHelper {
  private static readonly MONTHS_RU = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
  ];

  /**
   * Проверяет валидность даты
   * @param {Date} date - Объект Date для проверки
   * @returns {boolean} true если дата валидна
   */
  private static isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Добавляет ведущий ноль к числу если необходимо
   * @param {number} num - Число для форматирования
   * @returns {string} Отформатированное число
   */
  private static padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }

  /**
   * Парсит дату из строки формата "dd.MM.yyyy" или "dd.MM.yyyy HH:mm"
   * @param {string} dateStr - Строка с датой
   * @returns {Date | null} Объект Date или null при ошибке
   */
  private static parseRuDate(dateStr: string): Date | null {
    // Пробуем формат "dd.MM.yyyy HH:mm"
    const withTimeMatch = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2}):(\d{1,2})$/);
    if (withTimeMatch) {
      const [, day, month, year, hour, minute] = withTimeMatch;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
      return this.isValidDate(date) ? date : null;
    }

    // Пробуем формат "dd.MM.yyyy"
    const dateMatch = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (dateMatch) {
      const [, day, month, year] = dateMatch;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return this.isValidDate(date) ? date : null;
    }

    return null;
  }

  /**
   * Проверяет является ли дата сегодняшней
   * @param {Date} date - Дата для проверки
   * @returns {boolean} true если дата является сегодняшней
   */
  private static isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
  }

  /**
   * Форматирует дату в строку вида "DD.MM.YYYY" или "DD.MM.YYYY HH:MM"
   * @param {string | Date} dateInput - Строка с датой в любом формате, распознаваемом Date
   * @param {boolean} [withTime=false] - Флаг, указывающий нужно ли включать время
   * @returns {string} Отформатированная дата
   * @throws {Error} Если передана некорректная строка даты
   * @example
   * DateHelper.formatDate("2025-02-23T12:00:00") // "23.02.2025"
   * DateHelper.formatDate("2025-02-23T12:00:00", true) // "23.02.2025 12:00"
   */
  public static formatDate(
      dateInput: string | Date,
      withTime: boolean = false,
  ): string {
    try {
      let date: Date;

      if (typeof dateInput === "string") {
        // Пробуем парсить как русский формат
        date = this.parseRuDate(dateInput) as Date;
        if (!date) {
          // Пробуем как ISO или другой стандартный формат
          date = new Date(dateInput);
        }
      } else {
        date = dateInput;
      }

      if (!this.isValidDate(date)) {
        return "";
      }

      const day = this.padZero(date.getDate());
      const month = this.padZero(date.getMonth() + 1);
      const year = date.getFullYear();

      let formatted = `${day}.${month}.${year}`;

      if (withTime) {
        const hours = this.padZero(date.getHours());
        const minutes = this.padZero(date.getMinutes());
        formatted += ` ${hours}:${minutes}`;
      }

      return formatted;
    } catch (error: unknown) {
      throw new Error(`Failed to format date: ${(error as Error).message}`);
    }
  }

  /**
   * Преобразует номер дня в строку даты текущего месяца и года
   * @param {number | string} day - Номер дня месяца (1-31)
   * @returns {string} Отформатированная дата в формате "DD.MM.YYYY"
   * @throws {Error} Если передан некорректный номер дня
   * @example
   * DateHelper.formatDayToDate(12) // "12.03.2025" (при текущей дате март 2025)
   * DateHelper.formatDayToDate("15") // "15.03.2025" (при текущей дате март 2025)
   */
  public static formatDayToDate(day: number | string): string {
    try {
      const dayNumber: number = Number(day);

      // Проверка валидности номера дня
      if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 31) {
        throw new Error("Invalid day number. Must be between 1 and 31");
      }

      // Создаем дату с текущим месяцем и годом
      const date: Date = new Date();
      date.setDate(dayNumber);

      // Проверка валидности полученной даты
      if (!this.isValidDate(date)) {
        throw new Error("Invalid date resulted from day number");
      }

      return this.formatDate(date);
    } catch (error: unknown) {
      throw new Error(
          `Failed to format day to date: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Извлекает день месяца из даты
   * @param {string} dateStr - Строка с датой в формате "dd.MM.yyyy"
   * @returns {number | null} День месяца (1-31) или null при невалидных данных
   */
  public static extractDayFromDate(dateStr: string): number | null {
    if (!dateStr) return null;

    try {
      const parsed = this.parseRuDate(dateStr);
      if (!parsed) {
        return null;
      }
      return parsed.getDate();
    } catch (error: unknown) {
      console.error(
          `Failed to extract day from date: ${(error as Error).message}`,
      );
      return null;
    }
  }

  /**
   * Преобразует дату из формата "dd.MM.yyyy" или ISO в "yyyy-MM-dd" для API
   * @param {string} dateStr - Строка с датой в формате "dd.MM.yyyy" или ISO
   * @returns {string} Отформатированная дата в формате "yyyy-MM-dd" или пустая строка при невалидных данных
   */
  public static formatDateToISO(dateStr: string): string {
    if (!dateStr) return "";

    try {
      let parsed: Date | null;

      // Пробуем разобрать как "dd.MM.yyyy"
      parsed = this.parseRuDate(dateStr);
      if (!parsed) {
        // Пробуем разобрать как ISO формат
        parsed = new Date(dateStr);
        if (!this.isValidDate(parsed)) {
          return "";
        }
      }

      const year = parsed.getFullYear();
      const month = this.padZero(parsed.getMonth() + 1);
      const day = this.padZero(parsed.getDate());

      return `${year}-${month}-${day}`;
    } catch (error: unknown) {
      console.error(
          `Failed to format date for create plan: ${(error as Error).message}`,
      );
      return "";
    }
  }

  /**
   * Форматирует дату в текстовый вид, например "3 апреля 2025"
   * @param {string | Date} dateInput - Строка с датой или объект Date
   * @returns {string} Отформатированная дата в текстовом виде или пустая строка при невалидных данных
   * @example
   * DateHelper.formatDateToText("03.04.2025") // "3 апреля 2025"
   * DateHelper.formatDateToText(new Date(2025, 3, 3)) // "3 апреля 2025"
   * DateHelper.formatDateToText("invalid") // ""
   */
  public static formatDateToText(dateInput: string | Date): string {
    try {
      let date: Date;

      if (typeof dateInput === "string") {
        date = this.parseRuDate(dateInput) as Date;
        if (!date) {
          date = new Date(dateInput);
        }
      } else {
        date = dateInput;
      }

      if (!this.isValidDate(date)) {
        return "";
      }

      const day = date.getDate();
      const month = this.MONTHS_RU[date.getMonth()];
      const year = date.getFullYear();

      return `${day} ${month} ${year}`;
    } catch (error: unknown) {
      console.error(
          `Failed to format date to text: ${(error as Error).message}`,
      );
      return "";
    }
  }

  /**
   * Получает дату для списка истории
   * @param {string} timestamp - ISO строка с датой
   * @returns {string} Отформатированная дата для истории
   */
  public static getDateForHistoryList(timestamp: string): string {
    try {
      const date = new Date(timestamp);

      if (!this.isValidDate(date)) {
        return "";
      }

      const day = date.getDate();
      const month = this.MONTHS_RU[date.getMonth()];

      if (this.isToday(date)) {
        return `Сегодня, ${day} ${month}`;
      }

      return `${day} ${month}`;
    } catch (error: unknown) {
      console.error(
          `Failed to get date for history list: ${(error as Error).message}`,
      );
      return "";
    }
  }
}