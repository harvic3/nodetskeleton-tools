export class StringUtil {
  static readonly EMPTY = "";

  static capitalize(str: string): string {
    if (!str) return this.EMPTY;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
