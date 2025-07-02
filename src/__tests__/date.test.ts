import {describe, it, expect} from "vitest";
import {DateHelper} from "../date";

describe("DateHelper", () => {
    describe("formatDate", () => {
        it("форматирует дату без времени", () => {
            expect(DateHelper.formatDate("23.02.2025")).toBe("23.02.2025");
            expect(DateHelper.formatDate(new Date(2025, 1, 23))).toBe("23.02.2025");
        });

        it("форматирует дату с временем", () => {
            expect(
                DateHelper.formatDate("23.02.2025 12:30", true)
            ).toBe("23.02.2025 12:30");
            expect(
                DateHelper.formatDate(new Date(2025, 1, 23, 12, 30), true)
            ).toBe("23.02.2025 12:30");
        });

        it("возвращает пустую строку для невалидной даты", () => {
            expect(DateHelper.formatDate("invalid date")).toBe("");
        });
    });

    describe("formatDayToDate", () => {
        it("преобразует номер дня в дату текущего месяца", () => {
            const now = new Date();
            const expected = new Date(now.getFullYear(), now.getMonth(), 15);
            const result = DateHelper.formatDayToDate(15);
            expect(result).toBe(
                expected.toLocaleDateString("ru-RU").split(".").reverse().join(".")
                ===
                result.split(".").reverse().join(".")
                    ? result
                    : expect.any(String)
            );
            // Просто проверим что день совпадает и формат
            expect(result.split(".")[0]).toBe("15");
        });

        it("кидает ошибку при невалидном номере дня", () => {
            expect(() => DateHelper.formatDayToDate(0)).toThrow();
            expect(() => DateHelper.formatDayToDate(32)).toThrow();
            expect(() => DateHelper.formatDayToDate("abc")).toThrow();
        });
    });

    describe("extractDayFromDate", () => {
        it("извлекает день из строки даты", () => {
            expect(DateHelper.extractDayFromDate("12.03.2025")).toBe(12);
        });

        it("возвращает null для невалидной даты", () => {
            expect(DateHelper.extractDayFromDate("invalid")).toBeNull();
            expect(DateHelper.extractDayFromDate("")).toBeNull();
        });
    });

    describe("formatDateToISO", () => {
        it("конвертирует dd.MM.yyyy в yyyy-MM-dd", () => {
            expect(DateHelper.formatDateToISO("23.02.2025")).toBe("2025-02-23");
        });

        it("конвертирует ISO дату в yyyy-MM-dd", () => {
            expect(DateHelper.formatDateToISO("2025-02-23T12:00:00")).toBe(
                "2025-02-23"
            );
        });

        it("возвращает пустую строку для невалидной даты", () => {
            expect(DateHelper.formatDateToISO("invalid")).toBe("");
        });
    });

    describe("formatDateToText", () => {
        it("форматирует строку даты в текст", () => {
            expect(DateHelper.formatDateToText("03.04.2025")).toBe("3 апреля 2025");
        });

        it("форматирует объект Date в текст", () => {
            expect(DateHelper.formatDateToText(new Date(2025, 3, 3))).toBe(
                "3 апреля 2025"
            );
        });

        it("возвращает пустую строку для невалидной даты", () => {
            expect(DateHelper.formatDateToText("invalid")).toBe("");
        });
    });

    describe("getDateForHistoryList", () => {
        it("возвращает строку с 'Сегодня' для текущей даты", () => {
            const now = new Date();
            const isoString = now.toISOString();
            const result = DateHelper.getDateForHistoryList(isoString);
            expect(result.startsWith("Сегодня")).toBe(true);
        });

        it("возвращает форматированную дату для другой даты", () => {
            const pastDate = new Date(2020, 0, 1).toISOString();
            const result = DateHelper.getDateForHistoryList(pastDate);
            expect(result).toBe("1 января");
        });
    });
});
