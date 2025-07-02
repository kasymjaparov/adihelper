import { format, isToday, isValid, parse, parseISO } from "date-fns"
import { ru } from "date-fns/locale/ru"

/**
 * Хелпер для работы с датами
 */
export class DateHelper {
  /**
   * Форматирует дату в строку вида "DD.MM.YYYY" или "DD.MM.YYYY HH:MM"
   * @param {string} dateInput - Строка с датой в любом формате, распознаваемом Date
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
        // Попытка распарсить с временем
        date = parse(dateInput, "dd.MM.yyyy HH:mm", new Date());
        if (!isValid(date)) {
          // Попытка без времени
          date = parse(dateInput, "dd.MM.yyyy", new Date());
        }
        if (!isValid(date)) {
          // Пробуем ISO
          date = new Date(dateInput);
        }
      } else {
        date = dateInput;
      }

      if (!isValid(date)) {
        return "";
      }

      const formatString: string = withTime ? "dd.MM.yyyy HH:mm" : "dd.MM.yyyy";
      return format(date, formatString);
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
      const dayNumber: number = Number(day)

      // Проверка валидности номера дня
      if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 31) {
        throw new Error("Invalid day number. Must be between 1 and 31")
      }

      // Создаем дату с текущим месяцем и годом
      const date: Date = new Date()
      date.setDate(dayNumber)

      // Проверка валидности полученной даты
      if (!isValid(date)) {
        throw new Error("Invalid date resulted from day number")
      }

      return format(date, "dd.MM.yyyy")
    } catch (error: unknown) {
      throw new Error(
          `Failed to format day to date: ${(error as Error).message}`,
      )
    }
  }

  /**
   * Извлекает день месяца из даты
   * @param {string} dateStr - Строка с датой в формате "dd.MM.yyyy"
   * @returns {number | null} День месяца (1-31) или null при невалидных данных
   */
  public static extractDayFromDate(dateStr: string): number | null {
    if (!dateStr) return null

    try {
      const parsed = parse(dateStr, "dd.MM.yyyy", new Date())
      if (!isValid(parsed)) {
        return null
      }
      return parsed.getDate()
    } catch (error: unknown) {
      console.error(
          `Failed to extract day from date: ${(error as Error).message}`,
      )
      return null
    }
  }

  /**
   * Преобразует дату из формата "dd.MM.yyyy" или ISO в "yyyy-MM-dd" для API
   * @param {string} dateStr - Строка с датой в формате "dd.MM.yyyy" или ISO
   * @returns {string} Отформатированная дата в формате "yyyy-MM-dd" или пустая строка при невалидных данных
   */
  public static formatDateToISO(dateStr: string): string {
    if (!dateStr) return ""
    try {
      let parsed: Date
      // Пробуем разобрать как "dd.MM.yyyy"
      parsed = parse(dateStr, "dd.MM.yyyy", new Date())
      if (isValid(parsed)) {
        return format(parsed, "yyyy-MM-dd")
      }
      // Пробуем разобрать как ISO формат
      parsed = new Date(dateStr)
      if (isValid(parsed)) {
        return format(parsed, "yyyy-MM-dd")
      }
      return ""
    } catch (error: unknown) {
      console.error(
          `Failed to format date for create plan: ${(error as Error).message}`,
      )
      return ""
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
      let date: Date
      if (typeof dateInput === "string") {
        date = parse(dateInput, "dd.MM.yyyy", new Date())
        if (!isValid(date)) {
          date = new Date(dateInput)
        }
      } else {
        date = dateInput
      }

      if (!isValid(date)) {
        return ""
      }

      return format(date, "d MMMM yyyy", { locale: ru })
    } catch (error: unknown) {
      console.error(
          `Failed to format date to text: ${(error as Error).message}`,
      )
      return ""
    }
  }
  public static getDateForHistoryList(timestamp: string): string {
    const date = parseISO(timestamp);
    if (isToday(date)) {
      return `Сегодня, ${format(date, "d MMMM", { locale: ru })}`;
    }
    return format(date, "d MMMM", { locale: ru });
  }
}
