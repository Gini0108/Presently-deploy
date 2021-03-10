import { Document, DatabaseConfig, Query, QueryFunction, Update, UpdateFunction, Acceptable } from './types';
/**
 * # AloeDB 🌿
 * Light, Embeddable, NoSQL database for Deno
 *
 * [Deno](https://deno.land/x/aloedb) | [Github](https://github.com/Kirlovon/AloeDB)
 */
export declare class Database<Schema extends Acceptable<Schema> = Document> {
    /**
     * In-Memory documents storage.
     *
     * ***WARNING:*** It is better not to modify these documents manually, as the changes will not pass the necessary checks.
     * ***However, if you modify storage manualy, call the method `db.save()` to save your changes.***
     */
    documents: Schema[];
    /** Data writing manager. */
    private readonly writer?;
    /** Database configuration. */
    private readonly config;
    /**
     * Create database collection to store documents.
     * @param config Database configuration.
     */
    constructor(config?: Partial<DatabaseConfig> | string);
    /**
     * Insert a document.
     * @param document Document to insert.
     * @returns Inserted document.
     */
    insertOne(document: Schema): Promise<Schema>;
    /**
     * Inserts multiple documents.
     * @param documents Array of documents to insert.
     * @returns Array of inserted documents.
     */
    insertMany(documents: Schema[]): Promise<Schema[]>;
    /**
     * Find document by search query.
     * @param query Document selection criteria.
     * @returns Found document.
     */
    findOne(query?: Query<Schema> | QueryFunction<Schema>): Promise<Schema | null>;
    /**
     * Find multiple documents by search query.
     * @param query Documents selection criteria.
     * @returns Found documents.
     */
    findMany(query?: Query<Schema> | QueryFunction<Schema>): Promise<Schema[]>;
    /**
     * Modifies an existing document.
     * @param query Document selection criteria.
     * @param update The modifications to apply.
     * @returns Original document that has been modified.
     */
    updateOne(query: Query<Schema> | QueryFunction<Schema>, update: Update<Schema> | UpdateFunction<Schema>): Promise<Schema | null>;
    /**
     * Modifies all documents that match search query.
     * @param query Documents selection criteria.
     * @param update The modifications to apply.
     * @returns Original documents that has been modified.
     */
    updateMany(query: Query<Schema> | QueryFunction<Schema>, update: Update<Schema> | UpdateFunction<Schema>): Promise<Schema[]>;
    /**
     * Delete one document.
     * @param query Document selection criteria.
     * @returns Deleted document.
     */
    deleteOne(query?: Query<Schema> | QueryFunction<Schema>): Promise<Schema | null>;
    /**
     * Delete many documents.
     * @param query Document selection criteria.
     * @returns Array of deleted documents.
     */
    deleteMany(query?: Query<Schema> | QueryFunction<Schema>): Promise<Schema[]>;
    /**
     * Count found documents.
     * @param query Documents selection criteria.
     * @returns Documents count.
     */
    count(query?: Query<Schema> | QueryFunction<Schema>): Promise<number>;
    /**
     * Delete all documents.
     */
    drop(): Promise<void>;
    /**
     * Load data from database storage file.
     */
    load(): Promise<void>;
    /**
     * Load data from database storage file synchronously.
     */
    loadSync(): void;
    /**
     * Write documents to the database storage file.
     * Called automatically after each insert, update or delete operation. _(Only if `onlyInMemory` mode disabled)_
     */
    save(): Promise<void>;
}
