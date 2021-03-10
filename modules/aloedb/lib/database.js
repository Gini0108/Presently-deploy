"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const writer_1 = require("./writer");
const reader_1 = require("./reader");
const error_1 = require("./error");
const core_1 = require("./core");
const utils_1 = require("./utils");
/**
 * # AloeDB 🌿
 * Light, Embeddable, NoSQL database for Deno
 *
 * [Deno](https://deno.land/x/aloedb) | [Github](https://github.com/Kirlovon/AloeDB)
 */
class Database {
    /**
     * Create database collection to store documents.
     * @param config Database configuration.
     */
    constructor(config) {
        /**
         * In-Memory documents storage.
         *
         * ***WARNING:*** It is better not to modify these documents manually, as the changes will not pass the necessary checks.
         * ***However, if you modify storage manualy, call the method `db.save()` to save your changes.***
         */
        this.documents = [];
        /** Database configuration. */
        this.config = {
            path: undefined,
            pretty: true,
            autoload: true,
            immutable: true,
            onlyInMemory: true,
            schemaValidator: undefined,
        };
        if (utils_1.isUndefined(config))
            config = { onlyInMemory: true };
        if (utils_1.isString(config))
            config = { path: config, onlyInMemory: false };
        if (!utils_1.isObject(config))
            throw new error_1.DatabaseError('Database initialization error', 'Config must be an object');
        if (utils_1.isUndefined(config?.path) && utils_1.isUndefined(config?.onlyInMemory))
            config.onlyInMemory = true;
        if (utils_1.isString(config?.path) && utils_1.isUndefined(config?.onlyInMemory))
            config.onlyInMemory = false;
        if (utils_1.isUndefined(config?.path) && config?.onlyInMemory === false)
            throw new error_1.DatabaseError('Database initialization error', 'It is impossible to disable "onlyInMemory" mode if the "path" is not specified');
        this.config = { ...this.config, ...config };
        // Writer initialization
        if (this.config.path) {
            this.writer = new writer_1.Writer(this.config.path);
            if (this.config.autoload)
                this.loadSync();
        }
    }
    /**
     * Insert a document.
     * @param document Document to insert.
     * @returns Inserted document.
     */
    async insertOne(document) {
        try {
            const { immutable, schemaValidator, onlyInMemory } = this.config;
            if (!utils_1.isObject(document))
                throw new TypeError('Document must be an object');
            utils_1.prepareObject(document);
            if (schemaValidator)
                schemaValidator(document);
            const internal = utils_1.deepClone(document);
            this.documents.push(internal);
            if (!onlyInMemory)
                await this.save();
            return immutable ? utils_1.deepClone(internal) : internal;
        }
        catch (error) {
            throw new error_1.DatabaseError('Error inserting document', error);
        }
    }
    /**
     * Inserts multiple documents.
     * @param documents Array of documents to insert.
     * @returns Array of inserted documents.
     */
    async insertMany(documents) {
        try {
            const { immutable, schemaValidator, onlyInMemory } = this.config;
            if (!utils_1.isArray(documents))
                throw new TypeError('Input must be an array');
            const inserted = [];
            for (let i = 0; i < documents.length; i++) {
                const document = documents[i];
                if (!utils_1.isObject(document)) {
                    throw new TypeError('Documents must be an objects');
                }
                utils_1.prepareObject(document);
                if (schemaValidator)
                    schemaValidator(document);
                const internal = utils_1.deepClone(document);
                inserted.push(internal);
            }
            this.documents = [...this.documents, ...inserted];
            if (!onlyInMemory)
                await this.save();
            return immutable ? utils_1.deepClone(inserted) : inserted;
        }
        catch (error) {
            throw new error_1.DatabaseError('Error inserting documents', error);
        }
    }
    /**
     * Find document by search query.
     * @param query Document selection criteria.
     * @returns Found document.
     */
    async findOne(query) {
        try {
            const { immutable } = this.config;
            if (!utils_1.isUndefined(query) && !utils_1.isObject(query) && !utils_1.isFunction(query))
                throw new TypeError('Search query must be an object or function');
            // Optimization for empty queries
            if (!utils_1.isFunction(query) && (utils_1.isUndefined(query) || utils_1.isObjectEmpty(query))) {
                if (this.documents.length === 0)
                    return null;
                const document = this.documents[0];
                return immutable ? utils_1.deepClone(document) : document;
            }
            const found = core_1.searchDocuments(query, this.documents);
            if (found.length === 0)
                return null;
            const position = found[0];
            const document = this.documents[position];
            return immutable ? utils_1.deepClone(document) : document;
        }
        catch (error) {
            throw new error_1.DatabaseError('Error searching document', error);
        }
    }
    /**
     * Find multiple documents by search query.
     * @param query Documents selection criteria.
     * @returns Found documents.
     */
    async findMany(query) {
        try {
            const { immutable } = this.config;
            if (!utils_1.isUndefined(query) && !utils_1.isObject(query) && !utils_1.isFunction(query))
                throw new TypeError('Search query must be an object or function');
            // Optimization for empty queries
            if (utils_1.isUndefined(query) || (utils_1.isObject(query) && utils_1.isObjectEmpty(query))) {
                return immutable ? utils_1.deepClone(this.documents) : [...this.documents];
            }
            const found = core_1.searchDocuments(query, this.documents);
            if (found.length === 0)
                return [];
            const documents = [];
            for (let i = 0; i < found.length; i++) {
                const position = found[i];
                const document = this.documents[position];
                documents.push(document);
            }
            return immutable ? utils_1.deepClone(documents) : documents;
        }
        catch (error) {
            throw new error_1.DatabaseError('Error searching document', error);
        }
    }
    /**
     * Modifies an existing document.
     * @param query Document selection criteria.
     * @param update The modifications to apply.
     * @returns Original document that has been modified.
     */
    async updateOne(query, update) {
        try {
            const { schemaValidator, onlyInMemory } = this.config;
            if (!utils_1.isUndefined(query) && !utils_1.isObject(query) && !utils_1.isFunction(query))
                throw new TypeError('Search query must be an object or function');
            if (!utils_1.isObject(update) && !utils_1.isFunction(update))
                throw new TypeError('Update must be an object or function');
            const found = core_1.searchDocuments(query, this.documents);
            if (found.length === 0)
                return null;
            const position = found[0];
            const document = this.documents[position];
            const updated = core_1.updateDocument(document, update);
            if (schemaValidator)
                schemaValidator(updated);
            this.documents[position] = updated;
            if (!onlyInMemory)
                await this.save();
            return document;
        }
        catch (error) {
            throw new error_1.DatabaseError('Error updating document', error);
        }
    }
    /**
     * Modifies all documents that match search query.
     * @param query Documents selection criteria.
     * @param update The modifications to apply.
     * @returns Original documents that has been modified.
     */
    async updateMany(query, update) {
        try {
            const { schemaValidator, onlyInMemory } = this.config;
            if (!utils_1.isUndefined(query) && !utils_1.isObject(query) && !utils_1.isFunction(query))
                throw new TypeError('Search query must be an object or function');
            if (!utils_1.isObject(update) && !utils_1.isFunction(update))
                throw new TypeError('Update must be an object');
            const found = core_1.searchDocuments(query, this.documents);
            if (found.length === 0)
                return [];
            let temporary = [...this.documents];
            const originals = [];
            for (let i = 0; i < found.length; i++) {
                const position = found[i];
                const document = temporary[position];
                const updated = core_1.updateDocument(document, update);
                if (schemaValidator)
                    schemaValidator(updated);
                temporary[position] = updated;
                originals.push(document);
            }
            this.documents = temporary;
            if (!onlyInMemory)
                await this.save();
            return originals;
        }
        catch (error) {
            throw new error_1.DatabaseError('Error updating documents', error);
        }
    }
    /**
     * Delete one document.
     * @param query Document selection criteria.
     * @returns Deleted document.
     */
    async deleteOne(query) {
        try {
            const { onlyInMemory } = this.config;
            if (!utils_1.isUndefined(query) && !utils_1.isObject(query) && !utils_1.isFunction(query))
                throw new TypeError('Search query must be an object or function');
            const found = core_1.searchDocuments(query, this.documents);
            if (found.length === 0)
                return null;
            const position = found[0];
            const deleted = this.documents[position];
            this.documents.splice(position, 1);
            if (!onlyInMemory)
                await this.save();
            return deleted;
        }
        catch (error) {
            throw new error_1.DatabaseError('Error deleting documents', error);
        }
    }
    /**
     * Delete many documents.
     * @param query Document selection criteria.
     * @returns Array of deleted documents.
     */
    async deleteMany(query) {
        try {
            const { onlyInMemory } = this.config;
            if (!utils_1.isUndefined(query) && !utils_1.isObject(query) && !utils_1.isFunction(query))
                throw new TypeError('Search query must be an object or function');
            const found = core_1.searchDocuments(query, this.documents);
            if (found.length === 0)
                return [];
            let temporary = [...this.documents];
            const deleted = [];
            for (let i = 0; i < found.length; i++) {
                const position = found[i];
                const document = temporary[position];
                deleted.push(document);
                delete temporary[position];
            }
            temporary = utils_1.cleanArray(temporary);
            this.documents = temporary;
            if (!onlyInMemory)
                await this.save();
            return deleted;
        }
        catch (error) {
            throw new error_1.DatabaseError('Error deleting documents', error);
        }
    }
    /**
     * Count found documents.
     * @param query Documents selection criteria.
     * @returns Documents count.
     */
    async count(query) {
        try {
            if (!utils_1.isUndefined(query) && !utils_1.isObject(query) && !utils_1.isFunction(query))
                throw new TypeError('Search query must be an object or function');
            // Optimization for empty queries
            if (utils_1.isUndefined(query) || (utils_1.isObject(query) && utils_1.isObjectEmpty(query)))
                return this.documents.length;
            const found = core_1.searchDocuments(query, this.documents);
            return found.length;
        }
        catch (error) {
            throw new error_1.DatabaseError('Error counting documents', error);
        }
    }
    /**
     * Delete all documents.
     */
    async drop() {
        try {
            this.documents = [];
            await this.save();
        }
        catch (error) {
            throw new error_1.DatabaseError('Error dropping database', error);
        }
    }
    /**
     * Load data from database storage file.
     */
    async load() {
        try {
            const { path, schemaValidator } = this.config;
            if (!path)
                return;
            const content = await reader_1.Reader.read(path);
            const documents = core_1.parseDatabaseStorage(content);
            // Schema validation
            if (schemaValidator) {
                for (let i = 0; i < documents.length; i++)
                    schemaValidator(documents[i]);
            }
            this.documents = documents;
        }
        catch (error) {
            throw new error_1.DatabaseError('Error loading documents', error);
        }
    }
    /**
     * Load data from database storage file synchronously.
     */
    loadSync() {
        try {
            const { path, schemaValidator } = this.config;
            if (!path)
                return;
            const content = reader_1.Reader.readSync(path);
            const documents = core_1.parseDatabaseStorage(content);
            // Schema validation
            if (schemaValidator) {
                for (let i = 0; i < documents.length; i++)
                    schemaValidator(documents[i]);
            }
            this.documents = documents;
        }
        catch (error) {
            throw new error_1.DatabaseError('Error loading documents', error);
        }
    }
    /**
     * Write documents to the database storage file.
     * Called automatically after each insert, update or delete operation. _(Only if `onlyInMemory` mode disabled)_
     */
    async save() {
        try {
            if (!this.writer)
                return;
            const encoded = this.config.pretty
                ? JSON.stringify(this.documents, null, '\t')
                : JSON.stringify(this.documents);
            this.writer.write(encoded);
        }
        catch (error) {
            throw new error_1.DatabaseError('Error saving documents', error);
        }
    }
}
exports.Database = Database;
