"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDatabaseStorage = exports.matchValues = exports.updateDocument = exports.searchDocuments = void 0;
const utils_1 = require("./utils");
/**
 * Find documents positions.
 * @param query Documents selection criteria.
 * @param documents Array of documents to search.
 * @returns Found positions.
 */
function searchDocuments(query, documents) {
    let found = [];
    let firstSearch = true;
    if (utils_1.isFunction(query)) {
        for (let i = 0; i < documents.length; i++) {
            const document = documents[i];
            const isMatched = query(document);
            if (isMatched)
                found.push(i);
        }
        return found;
    }
    if (utils_1.isUndefined(query) || utils_1.isObjectEmpty(query))
        return utils_1.numbersList(documents.length - 1);
    for (const key in query) {
        const queryValue = query[key];
        if (firstSearch) {
            firstSearch = false;
            for (let i = 0; i < documents.length; i++) {
                const document = documents[i];
                const documentValue = document[key];
                const isMatched = matchValues(queryValue, documentValue);
                if (isMatched)
                    found.push(i);
            }
            if (found.length === 0)
                return [];
            continue;
        }
        for (let i = 0; i < found.length; i++) {
            if (utils_1.isUndefined(found[i]))
                continue;
            const position = found[i];
            const document = documents[position];
            const documentValue = document[key];
            const isMatched = matchValues(queryValue, documentValue);
            if (isMatched)
                continue;
            delete found[i];
        }
    }
    return utils_1.cleanArray(found);
}
exports.searchDocuments = searchDocuments;
/**
 * Create new document applying modifications to specified document.
 * @param document Document to update.
 * @param update The modifications to apply.
 * @returns New document with applyed updates.
 */
function updateDocument(document, update) {
    const documentClone = utils_1.deepClone(document);
    if (utils_1.isFunction(update)) {
        const newDocument = update(documentClone);
        if (!utils_1.isObject(newDocument))
            throw new TypeError('Document must be an object');
        utils_1.prepareObject(newDocument);
        return newDocument;
    }
    for (const key in update) {
        const value = update[key];
        const result = utils_1.isFunction(value) ? value(documentClone[key]) : value;
        if (utils_1.isUndefined(result)) {
            delete documentClone[key];
            continue;
        }
        documentClone[key] = result;
    }
    utils_1.prepareObject(documentClone);
    return documentClone;
}
exports.updateDocument = updateDocument;
/**
 * Compares the value from the query and from the document.
 * @param queryValue Value from query.
 * @param documentValue Value from document.
 * @returns Are the values equal.
 */
function matchValues(queryValue, documentValue) {
    if (utils_1.isString(queryValue) || utils_1.isNumber(queryValue) || utils_1.isBoolean(queryValue) || utils_1.isNull(queryValue)) {
        return queryValue === documentValue;
    }
    if (utils_1.isFunction(queryValue)) {
        return queryValue(documentValue) ? true : false;
    }
    if (utils_1.isRegExp(queryValue)) {
        return utils_1.isString(documentValue) && queryValue.test(documentValue);
    }
    if (utils_1.isArray(queryValue) || utils_1.isObject(queryValue)) {
        return utils_1.deepCompare(queryValue, documentValue);
    }
    if (utils_1.isUndefined(queryValue)) {
        return utils_1.isUndefined(documentValue);
    }
    return false;
}
exports.matchValues = matchValues;
/**
 * Parse database storage file.
 * @param content Content of the file.
 * @returns Array of documents.
 */
function parseDatabaseStorage(content) {
    const documents = JSON.parse(content);
    if (!utils_1.isArray(documents))
        throw new TypeError('Database storage should be an array of objects');
    for (let i = 0; i < documents.length; i++) {
        const document = documents[i];
        if (!utils_1.isObject(document))
            throw new TypeError('Database storage should contain only objects');
        utils_1.prepareObject(document);
    }
    return documents;
}
exports.parseDatabaseStorage = parseDatabaseStorage;
