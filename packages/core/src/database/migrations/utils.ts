import { existsSync, readFile, writeFile } from 'fs';
import { dirname } from 'path';
import {mkdirp} from 'mkdirp';

/**
 * Migration utils functions.
 * From https://github.com/typeorm/typeorm/blob/2bb0e398f922561f1cbb8ebbb19d20aa093e8bc2/src/commands/MigrationGenerateCommand.ts
 */
export class MigrationUtils {
	/**
	 * Creates directories recursively.
	 */
	static createDirectories(directory: string): Promise<void> {
        console.log("🚀 ~ file: utils.ts:14 ~ MigrationUtils ~ createDirectories ~ directory", directory)
    
		return new Promise<void>((resolve, reject) =>
			mkdirp(directory)
				.then(() => resolve())
				.catch((err) => reject(err))
		);
	}

	/**
	 * Creates a file with the given content in the given path.
	 */
	static async createFile(
		filePath: string,
		content: string,
		override: boolean = true
	): Promise<void> {
		await MigrationUtils.createDirectories(dirname(filePath));
		return new Promise<void>((resolve, reject) => {
			if (override === false && existsSync(filePath)) return resolve();

			writeFile(filePath, content, (err) =>
				err ? reject(err) : resolve()
			);
		});
	}

	/**
	 * Reads everything from a given file and returns its content as a string.
	 */
	static async readFile(filePath: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			readFile(filePath, (err, data) =>
				err ? reject(err) : resolve(data.toString())
			);
		});
	}

	static async fileExists(filePath: string) {
		return existsSync(filePath);
	}
}
