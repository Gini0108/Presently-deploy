"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reader = void 0;
const utils_1 = require("./utils");
const fs_1 = require("fs");
/**
 * Database storage file reader.
 */
class Reader {
    /**
     * Read database storage file. Creates a new file if its not exists.
     * @param path Path to the file.
     * @returns File content.
     */
    static async read(path) {
        if (utils_1.isUndefined(path))
            return '[]';
        if (await exists(path) === false) {
            await ensureFile(path, '[]');
            return '[]';
        }
        fs_1.readFile(path, (err, data) => {
            if (err)
                return "[]";
            else
                return data.toString();
        });
        return "[]";
    }
    /**
     * Read database storage file synchronously. Creates a new file if its not exists.
     * @param path Path to the file.
     * @returns File content.
     */
    static readSync(path) {
        if (utils_1.isUndefined(path))
            return '[]';
        if (existsSync(path) === false) {
            ensureFileSync(path, '[]');
            return '[]';
        }
        const content = fs_1.readFileSync(path).toString();
        return content;
    }
}
exports.Reader = Reader;
/**
 * Test whether or not the given path exists.
 * @param path Path to the file.
 * @returns Is file exists.
 */
async function exists(path) {
    try {
        await fs_1.lstatSync(path);
        return true;
    }
    catch (error) {
        return false;
        // throw error;
    }
}
/**
 * Synchronously test whether or not the given path exists.
 * @param path Path to the file.
 * @returns Is file exists.
 */
function existsSync(path) {
    try {
        fs_1.lstatSync(path);
        return true;
    }
    catch (error) {
        return false;
    }
}
/**
 * Ensures that the file exists.
 * @param path Path to the file.
 * @param data Data to write to if file not exists.
 * @returns Is file created.
 */
async function ensureFile(path, data = '') {
    try {
        const info = await fs_1.lstatSync(path);
        if (!info.isFile)
            throw new Error('Invalid file specified');
    }
    catch (error) {
        const dirname = utils_1.getPathDirname(path);
        await ensureDir(dirname);
        await fs_1.writeFileSync(path, data);
        return;
    }
}
/**
 * Ensures that the file exists synchronously.
 * @param path Path to the file.
 * @param data Data to write to if file not exists.
 * @returns Is file created.
 */
function ensureFileSync(path, data = '') {
    try {
        const info = fs_1.lstatSync(path);
        if (!info.isFile())
            throw new Error('Invalid file specified');
    }
    catch (error) {
        const dirname = utils_1.getPathDirname(path);
        ensureDirSync(dirname);
        fs_1.writeFileSync(path, data);
        return;
    }
}
/**
 * Ensures that the file directory.
 * @param path Path to the directory.
 * @returns Is directory created.
 */
async function ensureDir(path) {
    try {
        const info = await fs_1.lstatSync(path);
        if (!info.isDirectory())
            throw new Error('Invalid directory specified');
    }
    catch (error) {
        await fs_1.mkdirSync(path, { recursive: true });
        return;
    }
}
/**
 * Ensures that the file directory synchronously.
 * @param path Path to the directory.
 * @returns Is directory created.
 */
function ensureDirSync(path) {
    try {
        const info = fs_1.lstatSync(path);
        if (!info.isDirectory)
            throw new Error('Invalid directory specified');
    }
    catch (error) {
        fs_1.mkdirSync(path, { recursive: true });
        return;
    }
}
