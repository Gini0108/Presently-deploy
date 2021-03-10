/**
 * Data writing manager.
 * Uses atomic writing and prevents race condition.
 */
export declare class Writer {
    /** Next data for writing. */
    private next;
    /** Lock writing. */
    private locked;
    /** Path to the database file. */
    private readonly path;
    /** Temporary file extension. */
    private readonly extension;
    /**
     * Storage initialization.
     * @param path Path to the database file.
     * @param pretty Write data in easy-to-read format.
     */
    constructor(path: string);
    /**
     * Write data to the database file.
     * @param data Data to write.
     */
    write(data: string): Promise<void>;
}
