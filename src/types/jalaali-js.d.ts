declare module 'jalaali-js' {
  export interface JalaaliDate {
    jy: number;
    jm: number;
    jd: number;
  }

  export interface GregorianDate {
    gy: number;
    gm: number;
    gd: number;
  }

  export function toJalaali(date: Date): JalaaliDate;
  export function toGregorian(jy: number, jm: number, jd: number): GregorianDate;
  export function jalaaliMonthLength(jy: number, jm: number): number;
  export function j2d(jy: number, jm: number, jd: number): number;
  export function d2j(jdn: number): JalaaliDate;
}
