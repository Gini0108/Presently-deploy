/**
 * Database storage file reader.
 */
export declare class Reader {
    /**
     * Read database storage file. Creates a new file if its not exists.
     * @param path Path to the file.
     * @returns File content.
     */
    static read(path: string): Promise<string>;
    /**
     * Read database storage file synchronously. Creates a new file if its not exists.
     * @param path Path to the file.
     * @returns File content.
     */
    static readSync(path: string): string;
}
