"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isError = exports.isRegExp = exports.isObject = exports.isArray = exports.isFunction = exports.isNull = exports.isUndefined = exports.isBoolean = exports.isNumber = exports.isString = exports.prepareArray = exports.prepareObject = exports.deepCompare = exports.deepClone = exports.getPathDirname = exports.getPathFilename = exports.getObjectLength = exports.isObjectEmpty = exports.numbersList = exports.cleanArray = void 0;
/**
 * Remove all empty items from the array.
 * @param target Array to clean.
 * @returns Cleaned array.
 */
function cleanArray(target) {
    return target.filter(() => true);
}
exports.cleanArray = cleanArray;
/**
 * Generate array of numbers from 0 to Nth.
 * @param number Nth value.
 * @returns Generated array.
 */
function numbersList(number) {
    const array = [];
    for (let i = 0; i <= number; i++)
        array.push(i);
    return array;
}
exports.numbersList = numbersList;
/**
 * Checks if the object is empty.
 * @param target Object to check.
 * @returns Is object empty or not.
 */
function isObjectEmpty(target) {
    for (let _key in target)
        return false;
    return true;
}
exports.isObjectEmpty = isObjectEmpty;
/**
 * Get number of keys in object.
 * @param target An object for key counting.
 * @returns Number of keys.
 */
function getObjectLength(target) {
    let length = 0;
    for (let _key in target)
        length++;
    return length;
}
exports.getObjectLength = getObjectLength;
/**
 * Get filename from the path.
 * @param path Path to the file.
 * @returns Filename from the path.
 */
function getPathFilename(path) {
    const parsed = path.split(/[\\\/]/);
    const filename = parsed.pop();
    return filename ? filename : '';
}
exports.getPathFilename = getPathFilename;
/**
 * Get dirname from the path.
 * @param path Path to the file.
 * @returns Dirname from the path.
 */
function getPathDirname(path) {
    let parsed = path.split(/[\\\/]/);
    parsed = parsed.map(value => value.trim());
    parsed = parsed.filter(value => value !== '');
    parsed.pop();
    const dirname = parsed.join('/');
    return dirname;
}
exports.getPathDirname = getPathDirname;
/**
 * Deep clone for objects and arrays. Can also be used for primitives.
 * @param target Target to clone.
 * @return Clone of the target.
 */
function deepClone(target) {
    if (isNull(target))
        return target;
    if (isArray(target)) {
        const clone = [];
        for (let i = 0; i < target.length; i++)
            clone[i] = deepClone(target[i]);
        return clone;
    }
    if (isObject(target)) {
        const clone = {};
        for (const key in target)
            clone[key] = deepClone(target[key]);
        return clone;
    }
    return target;
}
exports.deepClone = deepClone;
/**
 * Deep targets comparison.
 * @param targetA First target for comparison.
 * @param targetB Second target for comparison.
 * @returns Targets equal or not.
 */
function deepCompare(targetA, targetB) {
    if (isNull(targetA))
        return isNull(targetB);
    if (isNull(targetB))
        return isNull(targetA);
    if (isArray(targetA) && isArray(targetB)) {
        if (targetA.length !== targetB.length)
            return false;
        for (let i = 0; i < targetA.length; i++) {
            if (!deepCompare(targetA[i], targetB[i]))
                return false;
        }
        return true;
    }
    if (isObject(targetA) && isObject(targetB)) {
        if (getObjectLength(targetA) !== getObjectLength(targetB))
            return false;
        for (const key in targetA) {
            if (!deepCompare(targetA[key], targetB[key]))
                return false;
        }
        return true;
    }
    return targetA === targetB;
}
exports.deepCompare = deepCompare;
/**
 * Prepare object for database storage.
 * @param target Object to prepare.
 */
function prepareObject(target) {
    for (const key in target) {
        const value = target[key];
        if (isString(value) || isNumber(value) || isBoolean(value) || isNull(value)) {
            continue;
        }
        if (isArray(value)) {
            prepareArray(value);
            continue;
        }
        if (isObject(value)) {
            prepareObject(value);
            continue;
        }
        delete target[key];
    }
}
exports.prepareObject = prepareObject;
/**
 * Prepare array for database storage.
 * @param target Array to prepare.
 */
function prepareArray(target) {
    for (let i = 0; i < target.length; i++) {
        const value = target[i];
        if (isString(value) || isNumber(value) || isBoolean(value) || isNull(value)) {
            continue;
        }
        if (isArray(value)) {
            prepareArray(value);
            continue;
        }
        if (isObject(value)) {
            prepareObject(value);
            continue;
        }
        if (isUndefined(value)) {
            target[i] = null;
            continue;
        }
        target[i] = null;
    }
}
exports.prepareArray = prepareArray;
/**
 * Checks whether the value is a string.
 * @param target Target to check.
 * @returns Result of checking.
 */
function isString(target) {
    return typeof target === 'string';
}
exports.isString = isString;
/**
 * Checks whether the value is a number.
 * @param target Target to check.
 * @returns Result of checking.
 */
function isNumber(target) {
    return typeof target === 'number' && !Number.isNaN(target);
}
exports.isNumber = isNumber;
/**
 * Checks whether the value is a boolean.
 * @param target Target to check.
 * @returns Result of checking.
 */
function isBoolean(target) {
    return typeof target === 'boolean';
}
exports.isBoolean = isBoolean;
/**
 * Checks whether the value is undefined.
 * @param target Target to check.
 * @returns Result of checking.
 */
function isUndefined(target) {
    return typeof target === 'undefined';
}
exports.isUndefined = isUndefined;
/**
 * Checks whether the value is a null.
 * @param target Target to check.
 * @returns Result of checking.
 */
function isNull(target) {
    return target === null;
}
exports.isNull = isNull;
/**
 * Checks whether the value is a function.
 * @param target Target to check.
 * @returns Result of checking.
 */
function isFunction(target) {
    return typeof target === 'function';
}
exports.isFunction = isFunction;
/**
 * Checks whether the value is an array.
 * @param target Target to check.
 * @returns Result of checking.
 */
function isArray(target) {
    return Object.prototype.toString.call(target) === '[object Array]';
}
exports.isArray = isArray;
/**
 * Checks whether the value is a object.
 * @param target Target to check.
 * @returns Result of checking.
 */
function isObject(target) {
    return Object.prototype.toString.call(target) === '[object Object]';
}
exports.isObject = isObject;
/**
 * Checks whether the value is a regular expression.
 * @param target Target to check.
 * @returns Result of checking.
 */
function isRegExp(target) {
    return target instanceof RegExp;
}
exports.isRegExp = isRegExp;
/**
 * Checks whether the value is an error.
 * @param target Target to check.
 * @returns Result of checking.
 */
function isError(target) {
    return target instanceof Error;
}
exports.isError = isError;
