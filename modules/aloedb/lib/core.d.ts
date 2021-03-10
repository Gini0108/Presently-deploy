import { Document, DocumentValue, Query, QueryFunction, QueryValue, Update, UpdateFunction } from './types';
/**
 * Find documents positions.
 * @param query Documents selection criteria.
 * @param documents Array of documents to search.
 * @returns Found positions.
 */
export declare function searchDocuments(query: Query | QueryFunction | undefined, documents: Document[]): number[];
/**
 * Create new document applying modifications to specified document.
 * @param document Document to update.
 * @param update The modifications to apply.
 * @returns New document with applyed updates.
 */
export declare function updateDocument(document: Document, update: Update | UpdateFunction): Document;
/**
 * Compares the value from the query and from the document.
 * @param queryValue Value from query.
 * @param documentValue Value from document.
 * @returns Are the values equal.
 */
export declare function matchValues(queryValue: QueryValue, documentValue: DocumentValue): boolean;
/**
 * Parse database storage file.
 * @param content Content of the file.
 * @returns Array of documents.
 */
export declare function parseDatabaseStorage(content: string): Document[];
