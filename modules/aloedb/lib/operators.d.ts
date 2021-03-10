import { DocumentValue, DocumentPrimitive, QueryValue } from './types';
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
export declare function moreThan(value: number): (target: DocumentValue) => boolean;
/**
 * Selects documents where the value of a field more than or equal to the specified number.
 * @param value
 */
export declare function moreThanOrEqual(value: number): (target: DocumentValue) => boolean;
/**
 * Selects documents where the value of a field less than specified number.
 * @param value
 */
export declare function lessThan(value: number): (target: DocumentValue) => boolean;
/**
 * Selects documents where the value of a field less than or equal to the specified number.
 * @param value
 */
export declare function lessThanOrEqual(value: number): (target: DocumentValue) => boolean;
/**
 * Matches if number is between specified range values.
 * @param min Range start.
 * @param max Range end.
 */
export declare function between(min: number, max: number): (target: DocumentValue) => boolean;
/**
 * Matches if number is between or equal to the specified range values.
 * @param min Range start.
 * @param max Range end.
 */
export declare function betweenOrEqual(min: number, max: number): (target: DocumentValue) => boolean;
/**
 * Matches if field exists.
 */
export declare function exists(): (target: DocumentValue) => boolean;
/**
 * Matches if value type equal to specified type.
 * @param type Type of the value.
 */
export declare function type(type: 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object'): (target: DocumentValue) => boolean;
/**
 * Matches if array includes specified value.
 * @param value
 */
export declare function includes(value: DocumentPrimitive): (target: DocumentValue) => boolean;
/**
 * Matches if array length equal to specified length.
 * @param length Length of the array.
 */
export declare function length(length: number): (target: DocumentValue) => boolean;
/**
 *
 * @param values
 */
export declare function someElementMatch(...values: QueryValue[]): (target: DocumentValue) => boolean;
/**
 *
 * @param values
 */
export declare function everyElementMatch(...values: QueryValue[]): (target: DocumentValue) => boolean;
/**
 * Logical AND operator. Selects documents where the value of a field equals to all specified values.
 * @param values Query values.
 */
export declare function and(...values: QueryValue[]): (target: DocumentValue) => boolean;
/**
 * Logical OR operator. Selects documents where the value of a field equals at least one specified value.
 * @param values Query values.
 */
export declare function or(...values: QueryValue[]): (target: DocumentValue) => boolean;
/**
 * Logical NOT operator. Selects documents where the value of a field not equal to specified value.
 * @param value Query value.
 */
export declare function not(value: QueryValue): (target: DocumentValue) => boolean;
