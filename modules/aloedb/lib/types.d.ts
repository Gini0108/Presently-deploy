/**
 * Database initialization config
 */
export interface DatabaseConfig {
    /** Path to the database file. */
    path?: string;
    /** Save data in easy-to-read format. _(Default: true)_ */
    pretty: boolean;
    /** Automatically load the file synchronously when initializing the database. _(Default: true)_ */
    autoload: boolean;
    /** Automatically deeply clone all returned objects. _(Default: true)_ */
    immutable: boolean;
    /**
     * Do not write data to the database file.
     * If "path" specified, data will be read from the file, but new data will not be written.
     */
    onlyInMemory: boolean;
    /**
     * Manual document validation function.
     * If the document does not pass the validation, just throw the error.
     * Works well with [Superstruct](https://github.com/ianstormtaylor/superstruct)!
     */
    schemaValidator?: SchemaValidator;
}
/** Any object without specified structure. */
export interface PlainObject {
    [key: string]: unknown;
}
/** Checking the object for suitability for storage. */
export declare type Acceptable<T extends Document> = {
    [K in keyof T]: T[K] & DocumentValue;
};
/** Any document-like object. */
export declare type Document = {
    [key: string]: DocumentValue;
};
/** Array of document values. */
export declare type DocumentArray = DocumentValue[];
/** Supported documents values. */
export declare type DocumentValue = DocumentPrimitive | Document | DocumentArray;
/** Supported primitives. */
export declare type DocumentPrimitive = string | number | boolean | null;
/** Documents selection criteria. */
export declare type Query<T extends Document = Document> = {
    [K in keyof T]?: QueryValue<T[K]>;
};
/** Manual вocuments selection function. */
export declare type QueryFunction<T extends Document = Document> = (document: Readonly<T>) => boolean;
/** Possible search query values. */
export declare type QueryValue<T extends DocumentValue = DocumentValue> = DocumentValue | ((value: Readonly<T>) => boolean) | RegExp | undefined;
/** The modifications to apply. */
export declare type Update<T extends Document = Document> = {
    [K in keyof T]?: UpdateValue<T[K]>;
};
/** Manual modifications applying. */
export declare type UpdateFunction<T extends Document = Document> = (document: T) => T;
/** Possible update values. */
export declare type UpdateValue<T extends DocumentValue = DocumentValue> = T | ((value: T) => T) | undefined;
/** Schema validation. Throw error, if document unsuitable.  */
export declare type SchemaValidator = (document: Readonly<Document>) => void;
