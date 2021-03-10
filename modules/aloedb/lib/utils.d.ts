import { PlainObject } from './types';
/**
 * Remove all empty items from the array.
 * @param target Array to clean.
 * @returns Cleaned array.
 */
export declare function cleanArray<T extends unknown[]>(target: T): T;
/**
 * Generate array of numbers from 0 to Nth.
 * @param number Nth value.
 * @returns Generated array.
 */
export declare function numbersList(number: number): number[];
/**
 * Checks if the object is empty.
 * @param target Object to check.
 * @returns Is object empty or not.
 */
export declare function isObjectEmpty(target: PlainObject): boolean;
/**
 * Get number of keys in object.
 * @param target An object for key counting.
 * @returns Number of keys.
 */
export declare function getObjectLength(target: PlainObject): number;
/**
 * Get filename from the path.
 * @param path Path to the file.
 * @returns Filename from the path.
 */
export declare function getPathFilename(path: string): string;
/**
 * Get dirname from the path.
 * @param path Path to the file.
 * @returns Dirname from the path.
 */
export declare function getPathDirname(path: string): string;
/**
 * Deep clone for objects and arrays. Can also be used for primitives.
 * @param target Target to clone.
 * @return Clone of the target.
 */
export declare function deepClone<T>(target: T): T;
/**
 * Deep targets comparison.
 * @param targetA First target for comparison.
 * @param targetB Second target for comparison.
 * @returns Targets equal or not.
 */
export declare function deepCompare(targetA: unknown, targetB: unknown): boolean;
/**
 * Prepare object for database storage.
 * @param target Object to prepare.
 */
export declare function prepareObject(target: PlainObject): void;
/**
 * Prepare array for database storage.
 * @param target Array to prepare.
 */
export declare function prepareArray(target: unknown[]): void;
/**
 * Checks whether the value is a string.
 * @param target Target to check.
 * @returns Result of checking.
 */
export declare function isString(target: unknown): target is string;
/**
 * Checks whether the value is a number.
 * @param target Target to check.
 * @returns Result of checking.
 */
export declare function isNumber(target: unknown): target is number;
/**
 * Checks whether the value is a boolean.
 * @param target Target to check.
 * @returns Result of checking.
 */
export declare function isBoolean(target: unknown): target is boolean;
/**
 * Checks whether the value is undefined.
 * @param target Target to check.
 * @returns Result of checking.
 */
export declare function isUndefined(target: unknown): target is undefined;
/**
 * Checks whether the value is a null.
 * @param target Target to check.
 * @returns Result of checking.
 */
export declare function isNull(target: unknown): target is null;
/**
 * Checks whether the value is a function.
 * @param target Target to check.
 * @returns Result of checking.
 */
export declare function isFunction(target: unknown): target is (...args: any) => any;
/**
 * Checks whether the value is an array.
 * @param target Target to check.
 * @returns Result of checking.
 */
export declare function isArray(target: unknown): target is any[];
/**
 * Checks whether the value is a object.
 * @param target Target to check.
 * @returns Result of checking.
 */
export declare function isObject(target: unknown): target is PlainObject;
/**
 * Checks whether the value is a regular expression.
 * @param target Target to check.
 * @returns Result of checking.
 */
export declare function isRegExp(target: unknown): target is RegExp;
/**
 * Checks whether the value is an error.
 * @param target Target to check.
 * @returns Result of checking.
 */
export declare function isError(target: unknown): target is Error;
