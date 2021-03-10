"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.not = exports.or = exports.and = exports.everyElementMatch = exports.someElementMatch = exports.length = exports.includes = exports.type = exports.exists = exports.betweenOrEqual = exports.between = exports.lessThanOrEqual = exports.lessThan = exports.moreThanOrEqual = exports.moreThan = void 0;
const core_1 = require("./core");
const utils_1 = require("./utils");
/**
 * Selects documents where the value of a field more than specified number.
 * @param value
 * @example
 * ```typescript
 * db.documents; // [{ value: 5 }]
 * db.findOne({ value: moreThan(6) }); // null
 * db.findOne({ value: moreThan(3) }); // { value: 5 }
 * ```
 */
function moreThan(value) {
    return (target) => utils_1.isNumber(target) && target > value;
}
exports.moreThan = moreThan;
/**
 * Selects documents where the value of a field more than or equal to the specified number.
 * @param value
 */
function moreThanOrEqual(value) {
    return (target) => utils_1.isNumber(target) && target >= value;
}
exports.moreThanOrEqual = moreThanOrEqual;
/**
 * Selects documents where the value of a field less than specified number.
 * @param value
 */
function lessThan(value) {
    return (target) => utils_1.isNumber(target) && target < value;
}
exports.lessThan = lessThan;
/**
 * Selects documents where the value of a field less than or equal to the specified number.
 * @param value
 */
function lessThanOrEqual(value) {
    return (target) => utils_1.isNumber(target) && target <= value;
}
exports.lessThanOrEqual = lessThanOrEqual;
/**
 * Matches if number is between specified range values.
 * @param min Range start.
 * @param max Range end.
 */
function between(min, max) {
    return (target) => utils_1.isNumber(target) && target > min && target < max;
}
exports.between = between;
/**
 * Matches if number is between or equal to the specified range values.
 * @param min Range start.
 * @param max Range end.
 */
function betweenOrEqual(min, max) {
    return (target) => utils_1.isNumber(target) && target >= min && target <= max;
}
exports.betweenOrEqual = betweenOrEqual;
/**
 * Matches if field exists.
 */
function exists() {
    return (target) => !utils_1.isUndefined(target);
}
exports.exists = exists;
/**
 * Matches if value type equal to specified type.
 * @param type Type of the value.
 */
function type(type) {
    return (target) => {
        switch (type) {
            case 'string':
                return utils_1.isString(target);
            case 'number':
                return utils_1.isNumber(target);
            case 'boolean':
                return utils_1.isBoolean(target);
            case 'null':
                return utils_1.isNull(target);
            case 'array':
                return utils_1.isArray(target);
            case 'object':
                return utils_1.isObject(target);
            default:
                return false;
        }
    };
}
exports.type = type;
/**
 * Matches if array includes specified value.
 * @param value
 */
function includes(value) {
    return (target) => utils_1.isArray(target) && target.includes(value);
}
exports.includes = includes;
/**
 * Matches if array length equal to specified length.
 * @param length Length of the array.
 */
function length(length) {
    return (target) => utils_1.isArray(target) && target.length === length;
}
exports.length = length;
/**
 *
 * @param values
 */
function someElementMatch(...values) {
    return (target) => utils_1.isArray(target) && target.some(targetValue => values.every(value => core_1.matchValues(value, targetValue)));
}
exports.someElementMatch = someElementMatch;
/**
 *
 * @param values
 */
function everyElementMatch(...values) {
    return (target) => utils_1.isArray(target) && target.every(targetValue => values.every(value => core_1.matchValues(value, targetValue)));
}
exports.everyElementMatch = everyElementMatch;
/**
 * Logical AND operator. Selects documents where the value of a field equals to all specified values.
 * @param values Query values.
 */
function and(...values) {
    return (target) => values.every(value => core_1.matchValues(value, target));
}
exports.and = and;
/**
 * Logical OR operator. Selects documents where the value of a field equals at least one specified value.
 * @param values Query values.
 */
function or(...values) {
    return (target) => values.some(value => core_1.matchValues(value, target));
}
exports.or = or;
/**
 * Logical NOT operator. Selects documents where the value of a field not equal to specified value.
 * @param value Query value.
 */
function not(value) {
    return (target) => core_1.matchValues(value, target) === false;
}
exports.not = not;
