"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Writer = void 0;
const fs_1 = require("fs");
/**
 * Data writing manager.
 * Uses atomic writing and prevents race condition.
 */
class Writer {
    /**
     * Storage initialization.
     * @param path Path to the database file.
     * @param pretty Write data in easy-to-read format.
     */
    constructor(path) {
        /** Next data for writing. */
        this.next = null;
        /** Lock writing. */
        this.locked = false;
        /** Temporary file extension. */
        this.extension = '.temp';
        this.path = path;
    }
    /**
     * Write data to the database file.
     * @param data Data to write.
     */
    async write(data) {
        // Add writing to the queue if writing is locked
        if (this.locked) {
            this.next = data;
            return;
        }
        // Lock writing
        this.locked = true;
        // Write data
        const temp = this.path + this.extension;
        await fs_1.writeFileSync(temp, data);
        await fs_1.renameSync(temp, this.path);
        // Unlock writing
        this.locked = false;
        // Start next writing if there is data in the queue
        if (this.next) {
            const nextCopy = this.next;
            this.next = null;
            this.write(nextCopy);
        }
    }
}
exports.Writer = Writer;
