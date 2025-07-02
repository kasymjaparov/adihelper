export class StringHelper {
  static getLastSymbol(str: string): string {
    return str.length > 0 ? str[str.length - 1] : "";
  }

  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static reverse(str: string): string {
    return str.split('').reverse().join('');
  }
}