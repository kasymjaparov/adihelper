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

    static getQueryString(obj: Record<string, unknown>): string {
        return Object.keys(obj).reduce((result, key) => {
            const value = obj[key];
            let stringValue: string;
            if (value === null) {
                stringValue = 'null';
            } else if (value === undefined) {
                stringValue = 'undefined';
            } else if (typeof value === 'object') {
                stringValue = JSON.stringify(value).replace(/"([^"]+)":/g, '$1:')
            } else {
                stringValue = String(value);
            }
          return result + `${key}=${stringValue}&`;
        }, '').replace(/&+$/, '');
    }
}